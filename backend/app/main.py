from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.routes.auth import router as auth_router
from app.api.routes.rooms import router as rooms_router
from app.api.routes.bookings import router as bookings_router
from app.core.config import settings
from app.db.mongodb import (
    connect_to_mongodb,
    close_mongodb_connection,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongodb()
    yield
    await close_mongodb_connection()


app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    lifespan=lifespan,
)

app.include_router(auth_router)
app.include_router(rooms_router)
app.include_router(bookings_router)


@app.get("/")
async def root():
    return {"message": "Welcome to Roomora API!"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}