from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pymongo.errors import DuplicateKeyError

from app.api.dependencies import get_current_user
from app.core.config import settings
from app.db.mongodb import database
from app.schemas.booking import BookingCreate, BookingStatusUpdate


router = APIRouter(prefix="/api/bookings", tags=["Bookings"])


# CREATE BOOKING REQUEST API
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking: BookingCreate,
    current_user: dict = Depends(get_current_user),
):
    # Only students can send booking requests
    if current_user.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can request bookings",
        )

    # Validate room ID
    try:
        room_object_id = ObjectId(booking.room_id)
    except (InvalidId, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid room ID",
        )

    # Find room
    room = await database.rooms.find_one({"_id": room_object_id})

    if room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found",
        )

    # Only available rooms can be requested
    if room.get("status") != "available":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This room is not available for booking",
        )

    # Prevent duplicate pending requests
    existing_booking = await database.bookings.find_one(
        {
            "room_id": room_object_id,
            "student_id": current_user["_id"],
            "status": "pending",
        }
    )

    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have a pending request for this room",
        )

    # Save booking request
    new_booking = {
        "room_id": room_object_id,
        "student_id": current_user["_id"],
        "owner_id": room["owner_id"],
        "status": "pending",
        "created_at": datetime.now(timezone.utc),
    }

    try:
        result = await database.bookings.insert_one(new_booking)
    except DuplicateKeyError:
        # Caught by MongoDB unique partial index under concurrent duplicate calls
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have a pending request for this room",
        )

    return {
        "message": "Booking request sent successfully",
        "booking": {
            "id": str(result.inserted_id),
            "room_id": booking.room_id,
            "status": "pending",
        },
    }


@router.patch("/{booking_id}")
async def update_booking_status(
    booking_id: str,
    status_update: BookingStatusUpdate | None = None,
    booking_status: str | None = Query(None, description="Legacy query param for booking status"),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners can manage booking requests",
        )

    target_status = status_update.status if status_update else booking_status

    if not target_status or target_status not in ["accepted", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be accepted or rejected",
        )

    try:
        booking_object_id = ObjectId(booking_id)
    except (InvalidId, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID",
        )

    existing_booking = await database.bookings.find_one(
        {
            "_id": booking_object_id,
            "owner_id": current_user["_id"],
        }
    )

    if existing_booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking request not found",
        )

    if existing_booking.get("status") != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This request has already been processed",
        )

    if target_status == "accepted":
        # ATOMIC OPERATION 1: Claim room only if status is currently 'available'
        claimed_room = await database.rooms.find_one_and_update(
            {"_id": existing_booking["room_id"], "status": "available"},
            {"$set": {"status": "occupied"}},
            return_document=True,
        )

        if claimed_room is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Room is no longer available",
            )

        # ATOMIC OPERATION 2: Accept target booking (conditional on status remaining 'pending')
        booking_update_result = await database.bookings.update_one(
            {"_id": booking_object_id, "status": "pending"},
            {"$set": {"status": "accepted"}},
        )

        if booking_update_result.modified_count == 0:
            # Race condition: booking was cancelled simultaneously. Roll back room claim!
            await database.rooms.update_one(
                {"_id": existing_booking["room_id"]},
                {"$set": {"status": "available"}},
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Booking request is no longer pending",
            )

        # ATOMIC OPERATION 3: Reject all competing pending requests for the same room
        await database.bookings.update_many(
            {
                "room_id": existing_booking["room_id"],
                "_id": {"$ne": booking_object_id},
                "status": "pending",
            },
            {"$set": {"status": "rejected"}},
        )

    else:
        # Target status == "rejected"
        await database.bookings.update_one(
            {"_id": booking_object_id},
            {"$set": {"status": "rejected"}},
        )

    return {
        "message": f"Booking request {target_status}",
        "booking_id": booking_id,
        "status": target_status,
    }


@router.get("/{booking_id}/contact")
async def get_owner_contact(
    booking_id: str,
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access owner contact details",
        )

    try:
        booking_object_id = ObjectId(booking_id)
    except (InvalidId, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID",
        )

    booking = await database.bookings.find_one(
        {
            "_id": booking_object_id,
            "student_id": current_user["_id"],
        }
    )

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking request not found",
        )

    if booking.get("status") != "accepted":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Contact details are available only after acceptance",
        )

    owner = await database.users.find_one(
        {"_id": booking["owner_id"]},
        {"password": 0},
    )

    if owner is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Owner not found",
        )

    return {
        "owner_name": owner.get("full_name"),
        "email": owner.get("email"),
        "phone": owner.get("phone"),
    }


@router.get("/{booking_id}/student-contact")
async def get_student_contact(
    booking_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Allows the owner of the room to view student contact details once a booking is accepted.
    """
    if current_user.get("role") != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners can access student contact details",
        )

    try:
        booking_object_id = ObjectId(booking_id)
    except (InvalidId, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID",
        )

    booking = await database.bookings.find_one(
        {
            "_id": booking_object_id,
            "owner_id": current_user["_id"],
        }
    )

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking request not found",
        )

    if booking.get("status") != "accepted":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student contact details are available only after acceptance",
        )

    student = await database.users.find_one(
        {"_id": booking["student_id"]},
        {"password": 0},
    )

    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found",
        )

    return {
        "student_name": student.get("full_name"),
        "email": student.get("email"),
        "phone": student.get("phone"),
    }


@router.get("/my")
async def get_my_bookings(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE, description="Number of items to return"),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can view their bookings",
        )

    bookings = await database.bookings.find(
        {"student_id": current_user["_id"]}
    ).skip(skip).limit(limit).to_list(length=limit)

    return [
        {
            "id": str(booking["_id"]),
            "room_id": str(booking["room_id"]),
            "status": booking["status"],
            "created_at": (
                booking["created_at"].isoformat()
                if isinstance(booking.get("created_at"), datetime)
                else booking.get("created_at")
            ),
        }
        for booking in bookings
    ]


@router.get("/owner")
async def get_owner_bookings(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE, description="Number of items to return"),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners can view booking requests",
        )

    bookings = await database.bookings.find(
        {"owner_id": current_user["_id"]}
    ).skip(skip).limit(limit).to_list(length=limit)

    return [
        {
            "id": str(booking["_id"]),
            "room_id": str(booking["room_id"]),
            "student_id": str(booking["student_id"]),
            "status": booking["status"],
            "created_at": (
                booking["created_at"].isoformat()
                if isinstance(booking.get("created_at"), datetime)
                else booking.get("created_at")
            ),
        }
        for booking in bookings
    ]


@router.patch("/{booking_id}/cancel")
async def cancel_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can cancel booking requests",
        )

    try:
        booking_object_id = ObjectId(booking_id)
    except (InvalidId, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID",
        )

    # Atomic conditional update: cancel only if current status is 'pending'
    result = await database.bookings.update_one(
        {
            "_id": booking_object_id,
            "student_id": current_user["_id"],
            "status": "pending",
        },
        {"$set": {"status": "cancelled"}},
    )

    if result.matched_count == 0:
        # Check if booking exists
        booking = await database.bookings.find_one(
            {
                "_id": booking_object_id,
                "student_id": current_user["_id"],
            }
        )
        if booking is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking request not found",
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending booking requests can be cancelled",
        )

    return {
        "message": "Booking request cancelled successfully",
        "booking_id": booking_id,
        "status": "cancelled",
    }