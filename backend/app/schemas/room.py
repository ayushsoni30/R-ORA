from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class RoomCreate(BaseModel):
    title: str = Field(min_length=3, max_length=100)
    description: str = Field(min_length=10, max_length=1000)
    location: str = Field(min_length=2, max_length=200)
    monthly_rent: float = Field(gt=0)
    max_occupants: int = Field(ge=1, le=20)
    expected_vacancy_date: date | None = None
    images: list[str] | None = None

    @field_validator("expected_vacancy_date")
    @classmethod
    def validate_future_date(cls, v: date | None) -> date | None:
        if v is not None and v < date.today():
            raise ValueError("Expected vacancy date cannot be in the past")
        return v


class RoomStatusUpdate(BaseModel):
    status: Literal["available", "occupied"]
