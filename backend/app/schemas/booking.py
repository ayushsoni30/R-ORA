from pydantic import BaseModel, Field


class BookingCreate(BaseModel):
    room_id: str = Field(min_length=24, max_length=24)