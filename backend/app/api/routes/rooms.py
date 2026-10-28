
import re

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.dependencies import get_current_user
from app.core.config import settings
from app.db.mongodb import database
from app.schemas.room import RoomCreate, RoomStatusUpdate


router = APIRouter(prefix="/api/rooms", tags=["Rooms"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_room(
    room: RoomCreate,
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners can create rooms",
        )

    new_room = {
        "title": room.title,
        "description": room.description,
        "location": room.location,
        "monthly_rent": room.monthly_rent,
        "max_occupants": room.max_occupants,
        "status": "available",
        "owner_id": current_user["_id"],
        "expected_vacancy_date": (
            room.expected_vacancy_date.isoformat()
            if room.expected_vacancy_date
            else None
        ),
        "images": room.images or [],
    }

    result = await database.rooms.insert_one(new_room)

    return {
        "message": "Room created successfully",
        "room": {
            "id": str(result.inserted_id),
            "title": room.title,
            "description": room.description,
            "location": room.location,
            "monthly_rent": room.monthly_rent,
            "max_occupants": room.max_occupants,
            "status": "available",
            "expected_vacancy_date": new_room["expected_vacancy_date"],
            "images": new_room["images"],
        },
    }


@router.get("/search")
async def search_rooms(
    location: str = Query(..., min_length=1, max_length=100, description="Location search query"),
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE, description="Number of items to return"),
):
    stripped_location = location.strip()
    if not stripped_location:
        return []

    escaped_location = re.escape(stripped_location)

    rooms = await database.rooms.find(
        {
            "location": {
                "$regex": escaped_location,
                "$options": "i",
            }
        }
    ).skip(skip).limit(limit).to_list(length=limit)

    return [
        {
            "id": str(room["_id"]),
            "title": room["title"],
            "description": room["description"],
            "location": room["location"],
            "monthly_rent": room["monthly_rent"],
            "max_occupants": room["max_occupants"],
            "status": room["status"],
            "expected_vacancy_date": room.get("expected_vacancy_date"),
            "images": room.get("images", []),
        }
        for room in rooms
    ]


@router.get("/owner/dashboard")
async def get_owner_dashboard(
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners can access this dashboard",
        )

    owner_id = current_user["_id"]

    total_rooms = await database.rooms.count_documents(
        {"owner_id": owner_id}
    )

    available_rooms = await database.rooms.count_documents(
        {"owner_id": owner_id, "status": "available"}
    )

    occupied_rooms = await database.rooms.count_documents(
        {"owner_id": owner_id, "status": "occupied"}
    )

    pending_requests = await database.bookings.count_documents(
        {"owner_id": owner_id, "status": "pending"}
    )

    return {
        "total_rooms": total_rooms,
        "available_rooms": available_rooms,
        "occupied_rooms": occupied_rooms,
        "pending_requests": pending_requests,
    }


@router.get("/owner")
async def get_owner_rooms(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE, description="Number of items to return"),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners can access their listings",
        )

    rooms = await database.rooms.find(
        {"owner_id": current_user["_id"]}
    ).skip(skip).limit(limit).to_list(length=limit)

    return [
        {
            "id": str(room["_id"]),
            "title": room["title"],
            "description": room["description"],
            "location": room["location"],
            "monthly_rent": room["monthly_rent"],
            "max_occupants": room["max_occupants"],
            "status": room["status"],
            "expected_vacancy_date": room.get("expected_vacancy_date"),
            "images": room.get("images", []),
        }
        for room in rooms
    ]


@router.get("/")
async def get_all_rooms(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE, description="Number of items to return"),
):
    rooms = await database.rooms.find().skip(skip).limit(limit).to_list(length=limit)

    return [
        {
            "id": str(room["_id"]),
            "title": room["title"],
            "description": room["description"],
            "location": room["location"],
            "monthly_rent": room["monthly_rent"],
            "max_occupants": room["max_occupants"],
            "status": room["status"],
            "expected_vacancy_date": room.get("expected_vacancy_date"),
            "images": room.get("images", []),
        }
        for room in rooms
    ]


@router.get("/{room_id}")
async def get_room_by_id(room_id: str):
    try:
        room_object_id = ObjectId(room_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid room ID",
        )

    room = await database.rooms.find_one(
        {"_id": room_object_id}
    )

    if room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found",
        )

    return {
        "id": str(room["_id"]),
        "title": room["title"],
        "description": room["description"],
        "location": room["location"],
        "monthly_rent": room["monthly_rent"],
        "max_occupants": room["max_occupants"],
        "status": room["status"],
        "expected_vacancy_date": room.get("expected_vacancy_date"),
        "images": room.get("images", []),
    }


@router.put("/{room_id}")
async def update_room(
    room_id: str,
    room: RoomCreate,
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners can update rooms",
        )

    try:
        room_object_id = ObjectId(room_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid room ID",
        )

    updated_data = {
        "title": room.title,
        "description": room.description,
        "location": room.location,
        "monthly_rent": room.monthly_rent,
        "max_occupants": room.max_occupants,
        "expected_vacancy_date": (
            room.expected_vacancy_date.isoformat()
            if room.expected_vacancy_date
            else None
        ),
    }
    if room.images is not None:
        updated_data["images"] = room.images

    result = await database.rooms.update_one(
        {
            "_id": room_object_id,
            "owner_id": current_user["_id"],
        },
        {"$set": updated_data},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found",
        )

    return {
        "message": "Room updated successfully",
        "room": {
            "id": room_id,
            **updated_data,
        },
    }


@router.delete("/{room_id}")
async def delete_room(
    room_id: str,
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners can delete rooms",
        )

    try:
        room_object_id = ObjectId(room_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid room ID",
        )

    room = await database.rooms.find_one(
        {"_id": room_object_id, "owner_id": current_user["_id"]}
    )
    if room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found",
        )

    active_booking = await database.bookings.find_one(
        {"room_id": room_object_id, "status": "accepted"}
    )
    if active_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete room with an active accepted booking. Please coordinate checkout or cancellation first.",
        )

    await database.bookings.update_many(
        {"room_id": room_object_id, "status": "pending"},
        {"$set": {"status": "cancelled"}},
    )

    result = await database.rooms.delete_one(
        {
            "_id": room_object_id,
            "owner_id": current_user["_id"],
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found",
        )

    return {
        "message": "Room deleted successfully",
        "id": room_id,
    }


@router.patch("/{room_id}/status")
async def update_room_status(
    room_id: str,
    status_update: RoomStatusUpdate | None = None,
    room_status: str | None = Query(None, description="Legacy query param for status update"),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners can update room status",
        )

    target_status = status_update.status if status_update else room_status

    if not target_status or target_status not in ["available", "occupied"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be available or occupied",
        )

    try:
        room_object_id = ObjectId(room_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid room ID",
        )

    result = await database.rooms.update_one(
        {
            "_id": room_object_id,
            "owner_id": current_user["_id"],
        },
        {"$set": {"status": target_status}},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found",
        )

    return {
        "message": "Room status updated successfully",
        "id": room_id,
        "status": target_status,
    }
