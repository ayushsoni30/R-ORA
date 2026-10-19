from fastapi import APIRouter, status

from app.db.mongodb import database
from app.schemas.room import RoomCreate



router = APIRouter(prefix="/api/rooms", tags=["Rooms"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_room(room: RoomCreate):

    new_room = {
        "title": room.title,
        "description": room.description,
        "location": room.location,
        "monthly_rent": room.monthly_rent,
        "max_occupants": room.max_occupants,
        "status": "available",
    }

    result = await database.rooms.insert_one(new_room)

    return {
        "message": "Room created successfully",
        "room": {
            "id": str(result.inserted_id),
            "title": new_room["title"],
            "description": new_room["description"],
            "location": new_room["location"],
            "monthly_rent": new_room["monthly_rent"],
            "max_occupants": new_room["max_occupants"],
            "status": new_room["status"],
        },
    }
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
        }
        for room in rooms
    ]