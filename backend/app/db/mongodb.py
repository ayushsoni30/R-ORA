from pymongo import AsyncMongoClient
from app.core.config import settings

client = AsyncMongoClient(settings.MONGODB_URI)

database = client[settings.MONGODB_DATABASE]


async def connect_to_mongodb():
    await client.admin.command("ping")
    print("MongoDB connected successfully!")


async def close_mongodb_connection():
    await client.close()
    print("MongoDB connection closed.")