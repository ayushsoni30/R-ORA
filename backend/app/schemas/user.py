from typing import Literal

from pydantic import BaseModel, EmailStr, Field


# Data validation for user registration and login

class UserRegister(BaseModel):
    phone: str = Field(min_length=10, max_length=15)
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: Literal["student", "owner"] = "student"


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)