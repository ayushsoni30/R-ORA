
from app.db.mongodb import database
from app.schemas.room import RoomCreate
from bson import ObjectId
from fastapi import HTTPException
from bson.errors import InvalidId
from fastapi import APIRouter, HTTPException, status
from app.schemas.room import RoomCreate
from app.api.dependencies import get_current_user
from fastapi import Depends
router = APIRouter(prefix="/api/rooms", tags=["Rooms"])


# CREATE ROOM API
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_room(
    room: RoomCreate,
    current_user: dict = Depends(get_current_user),
):
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
        },
    }
    
# SEARCH ROOMS BY LOCATION API
@router.get("/search")
async def search_rooms(location: str):
    

    rooms = await database.rooms.find(
        {
            "location": {
                "$regex": location,
                "$options": "i",
                
            }
        }
    ).to_list(length=100)

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
        }
        for room in rooms
    ]


# GET ALL ROOMS API
@router.get("/")
async def get_all_rooms():

    rooms = await database.rooms.find().to_list(length=100)

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
        }
        for room in rooms
    ]

# GET ROOM DETAILS BY ID
@router.get("/{room_id}")
async def get_room_by_id(room_id: str):

    try:
        room_object_id = ObjectId(room_id)
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid room ID",
        )

    room = await database.rooms.find_one(
        {"_id": room_object_id}
    )

    if room is None:
        raise HTTPException(
            status_code=404,
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
    }
    # UPDATE ROOM API
@router.put("/{room_id}")
async def update_room(room_id: str, room: RoomCreate):
    

    try:
        room_object_id = ObjectId(room_id)
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid room ID",
        )

    existing_room = await database.rooms.find_one(
        {"_id": room_object_id}
    )

    if existing_room is None:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
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
    

    await database.rooms.update_one(
        {"_id": room_object_id},
        {"$set": updated_data},
    )

    return {
        "message": "Room updated successfully",
        "room": {
            "id": room_id,
            **updated_data,
            "status": existing_room["status"],
        },
    }
    # DELETE ROOM API
@router.delete("/{room_id}")
async def delete_room(room_id: str):

    try:
        room_object_id = ObjectId(room_id)
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid room ID",
        )

    existing_room = await database.rooms.find_one(
        {"_id": room_object_id}
    )

    if existing_room is None:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    await database.rooms.delete_one(
        {"_id": room_object_id}
    )

    return {
        "message": "Room deleted successfully",
        "id": room_id,
    }
    # UPDATE ROOM STATUS API
@router.patch("/{room_id}/status")
async def update_room_status(room_id: str, room_status: str):

    if room_status not in ["available", "occupied"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be available or occupied",
        )

    try:
        room_object_id = ObjectId(room_id)
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid room ID",
        )

    result = await database.rooms.update_one(
        {"_id": room_object_id},
        {"$set": {"status": room_status}},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    return {
        "message": "Room status updated successfully",
        "id": room_id,
        "status": room_status,
    }