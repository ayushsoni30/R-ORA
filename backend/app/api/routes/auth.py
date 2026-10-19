from fastapi import APIRouter, HTTPException, status
from pwdlib import PasswordHash


from app.db.mongodb import database
from app.schemas.user import UserRegister

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

password_hash = PasswordHash.recommended()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user: UserRegister):
    existing_user = await database.users.find_one(
        {"email": user.email}
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
        "role": "student",
    }

    result = await database.users.insert_one(new_user)

    return {
        "message": "Registration successful",
        "user": {
            "id": str(result.inserted_id),
            "full_name": user.full_name,
            "email": str(user.email),
            "role": "student",
        },
    }