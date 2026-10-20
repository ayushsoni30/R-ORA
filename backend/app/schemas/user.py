from pydantic import BaseModel, EmailStr, Field
#data validation for user registration and login
class UserRegister(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

