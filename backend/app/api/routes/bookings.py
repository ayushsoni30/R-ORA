from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_current_user
from app.db.mongodb import database
from app.schemas.booking import BookingCreate


router = APIRouter(prefix="/api/bookings", tags=["Bookings"])


# CREATE BOOKING REQUEST API
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking: BookingCreate,
    current_user: dict = Depends(get_current_user),
):
    # Only students can send booking requests
    if current_user["role"] != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can request bookings",
        )

    # Validate room ID
    try:
        room_object_id = ObjectId(booking.room_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid room ID",
        )

    # Find room
    room = await database.rooms.find_one(
        {"_id": room_object_id}
    )

    if room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found",
        )

    # Only available rooms can be requested
    if room["status"] != "available":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This room is not available for booking",
        )

    # Prevent booking own room
    if room["owner_id"] == current_user["_id"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot book your own room",
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

    result = await database.bookings.insert_one(new_booking)

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
    booking_status: str,
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners can manage booking requests",
        )

    if booking_status not in ["accepted", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be accepted or rejected",
        )

    try:
        booking_object_id = ObjectId(booking_id)
    except InvalidId:
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

    if existing_booking["status"] != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This request has already been processed",
        )

    if booking_status == "accepted":
        room = await database.rooms.find_one(
            {"_id": existing_booking["room_id"]}
        )

        if room is None or room["status"] != "available":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Room is no longer available",
            )

        await database.rooms.update_one(
            {"_id": existing_booking["room_id"]},
            {"$set": {"status": "occupied"}},
        )

    await database.bookings.update_one(
        {"_id": booking_object_id},
        {"$set": {"status": booking_status}},
    )

    return {
        "message": f"Booking request {booking_status}",
        "booking_id": booking_id,
        "status": booking_status,
    }