from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, HTTPException, status
from pwdlib import PasswordHash

from app.core.config import settings
from app.db.mongodb import database
from app.schemas.user import UserLogin, UserRegister


router = APIRouter(prefix="/api/auth", tags=["Authentication"])

password_hash = PasswordHash.recommended()


# REGISTER API
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user: UserRegister):

    existing_user = await database.users.find_one(
        {"email": str(user.email)}
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    hashed_password = password_hash.hash(user.password)

    new_user = {
        "full_name": user.full_name,
        "email": str(user.email),
        "password": hashed_password,
        "role": user.role,
    }

    result = await database.users.insert_one(new_user)

    return {
        "message": "Registration successful",
        "user": {
            "id": str(result.inserted_id),
            "full_name": user.full_name,
            "email": str(user.email),
            "role": user.role,
        },
    }


# LOGIN API
@router.post("/login")
async def login_user(user: UserLogin):

    existing_user = await database.users.find_one(
        {"email": str(user.email)}
    )

    if (
        not existing_user
        or not password_hash.verify(
            user.password,
            existing_user["password"],
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    token_payload = {
        "sub": str(existing_user["_id"]),
        "exp": expires_at,
    }

    access_token = jwt.encode(
        token_payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(existing_user["_id"]),
            "full_name": existing_user["full_name"],
            "email": existing_user["email"],
            "role": existing_user["role"],
        },
    }