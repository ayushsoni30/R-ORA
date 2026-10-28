from typing import Literal
from pydantic import BaseModel, EmailStr, Field, field_validator


# Data validation for user registration, login, and profile update

class UserRegister(BaseModel):
    phone: str = Field(
        min_length=10,
        max_length=15,
        pattern=r"^\+?[0-9]{10,15}$",
        description="Valid contact phone number containing 10-15 digits",
    )
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: Literal["student", "owner"] = "student"
    gender: str | None = None
    age: int | None = Field(default=None, ge=16, le=120)
    profile_photo: str | None = None

    @field_validator("full_name")
    @classmethod
    def clean_name(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2:
            raise ValueError("Full name must be at least 2 characters")
        return cleaned

    @field_validator("email", mode="after")
    @classmethod
    def normalize_email(cls, v: EmailStr) -> str:
        return str(v).strip().lower()


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @field_validator("email", mode="after")
    @classmethod
    def normalize_email(cls, v: EmailStr) -> str:
        return str(v).strip().lower()


class UserProfileUpdate(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    phone: str = Field(
        min_length=10,
        max_length=15,
        pattern=r"^\+?[0-9]{10,15}$",
        description="Valid contact phone number containing 10-15 digits",
    )
    gender: str | None = None
    age: int | None = Field(default=None, ge=16, le=120)
    profile_photo: str | None = None

    @field_validator("full_name")
    @classmethod
    def clean_name(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2:
            raise ValueError("Full name must be at least 2 characters")
        return cleaned
