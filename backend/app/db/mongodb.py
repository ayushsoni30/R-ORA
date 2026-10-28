import logging
from pymongo import AsyncMongoClient
from pymongo.errors import PyMongoError

from app.core.config import settings

logger = logging.getLogger(__name__)

client = AsyncMongoClient(
    settings.MONGODB_URI,
    serverSelectionTimeoutMS=5000,
)

database = client[settings.MONGODB_DATABASE]


async def init_db_indexes():
    """
    Initialize essential MongoDB indexes idempotently.
    - Unique index on normalized user emails
    - Partial unique index on active pending bookings (preventing concurrent duplicates)
    - Query acceleration indexes for room searches and dashboard counts
    """
    try:
        await database.users.create_index("email", unique=True, name="uniq_user_email")

        await database.rooms.create_index("owner_id", name="idx_rooms_owner_id")
        await database.rooms.create_index("location", name="idx_rooms_location")
        await database.rooms.create_index("status", name="idx_rooms_status")

        await database.bookings.create_index(
            [("room_id", 1), ("student_id", 1)],
            unique=True,
            partialFilterExpression={"status": "pending"},
            name="uniq_active_pending_booking",
        )
        await database.bookings.create_index("owner_id", name="idx_bookings_owner_id")
        await database.bookings.create_index("student_id", name="idx_bookings_student_id")
        await database.bookings.create_index("status", name="idx_bookings_status")
        logger.info("MongoDB indexes verified/created successfully.")
    except PyMongoError as e:
        logger.warning("Index initialization encountered an issue: %s", e)


async def connect_to_mongodb():
    try:
        await client.admin.command("ping")
        print("MongoDB connected successfully!")
        await init_db_indexes()
    except Exception as e:
        logger.error("Failed to connect to MongoDB: %s", e)
        print(f"MongoDB connection failed: {e}")
        raise


async def close_mongodb_connection():
    try:
        await client.close()
        print("MongoDB connection closed.")
    except Exception as e:
        logger.error("Error closing MongoDB connection: %s", e)