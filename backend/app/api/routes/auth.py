from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, status
from pymongo.errors import DuplicateKeyError
from pwdlib import PasswordHash

from app.api.dependencies import get_current_user
from app.core.config import settings
from app.core.limiter import limiter
from app.db.mongodb import database
from app.schemas.user import UserLogin, UserRegister, UserProfileUpdate


router = APIRouter(prefix="/api/auth", tags=["Authentication"])

password_hash = PasswordHash.recommended()


# REGISTER API
@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit(settings.RATE_LIMIT_REGISTER)
async def register_user(request: Request, user: UserRegister):
    normalized_email = user.email.strip().lower()

    existing_user = await database.users.find_one(
        {"email": normalized_email}
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    hashed_password = password_hash.hash(user.password)

    new_user = {
        "full_name": user.full_name,
        "email": normalized_email,
        "password": hashed_password,
        "role": user.role,
        "phone": user.phone,
    }

    try:
        result = await database.users.insert_one(new_user)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    return {
        "message": "Registration successful",
        "user": {
            "id": str(result.inserted_id),
            "full_name": user.full_name,
            "email": normalized_email,
            "role": user.role,
        },
    }


# LOGIN API
@router.post("/login")
@limiter.limit(settings.RATE_LIMIT_LOGIN)
async def login_user(request: Request, user: UserLogin):
    normalized_email = user.email.strip().lower()

    existing_user = await database.users.find_one(
        {"email": normalized_email}
    )

    if (
        not existing_user
        or not password_hash.verify(
            user.password,
            existing_user.get("password", ""),
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


@router.get("/profile")
async def get_profile(
    current_user: dict = Depends(get_current_user),
):
    return {
        "id": str(current_user["_id"]),
        "full_name": current_user["full_name"],
        "email": current_user["email"],
        "phone": current_user.get("phone"),
        "role": current_user["role"],
    }


@router.put("/profile")
async def update_profile(
    profile: UserProfileUpdate,
    current_user: dict = Depends(get_current_user),
):
    await database.users.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "full_name": profile.full_name,
                "phone": profile.phone,
            }
        },
    )

    return {
        "message": "Profile updated successfully",
        "full_name": profile.full_name,
        "phone": profile.phone,
    }