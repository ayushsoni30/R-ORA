from datetime import date

from pydantic import BaseModel, Field


class RoomCreate(BaseModel):
    title: str = Field(min_length=3, max_length=100)
    description: str = Field(min_length=10, max_length=1000)
    location: str = Field(min_length=2, max_length=200)
    monthly_rent: float = Field(gt=0)
    max_occupants: int = Field(ge=1, le=20)
    expected_vacancy_date: date | None = None