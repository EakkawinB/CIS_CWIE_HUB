from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.core.redis import connect_redis, disconnect_redis

from app import models
from app.routers import auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_redis()
    yield
    # Shutdown
    await disconnect_redis()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan
)


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "CIS CWIE Hub",
        "version": settings.APP_VERSION
    }


@app.get("/health")
def health_check():
    return {
        "status": "running"
    }


app.include_router(
    auth.router
)