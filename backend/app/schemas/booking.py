from typing import Literal

from pydantic import BaseModel, Field


class BookingCreate(BaseModel):
    room_id: str = Field(
        min_length=24,
        max_length=24,
        pattern=r"^[0-9a-fA-F]{24}$",
        description="24-character hexadecimal ObjectId of the room",
    )


class BookingStatusUpdate(BaseModel):
    status: Literal["accepted", "rejected"]