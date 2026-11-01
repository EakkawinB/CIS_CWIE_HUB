from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.core.redis import connect_redis, disconnect_redis

from app import models
from app.routers import (
    auth,
    statistics,
    student,
    advisor,
    mentor,
    staff,
    company,
    position,
    application,
    document,
    advisor_assignment,
    staff_application,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    await connect_redis()
    yield
    # Shutdown
    print("🛑 Shutting down...")
    await disconnect_redis()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    description="CIS CWIE Hub - Cooperative and Work-Integrated Education Management System"
)


cors_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]
if settings.FRONTEND_URL and settings.FRONTEND_URL not in cors_origins:
    cors_origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)


@app.get("/")
def root():
    """Root endpoint - returns API information"""
    return {
        "message": "CIS CWIE Hub",
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "running",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


# Include routers
app.include_router(auth.router)
app.include_router(statistics.router)
app.include_router(student.router)
app.include_router(advisor.router)
app.include_router(mentor.router)
app.include_router(staff.router)
app.include_router(company.router)
app.include_router(position.router)
app.include_router(application.router)
app.include_router(staff_application.router)
app.include_router(document.router)
app.include_router(advisor_assignment.router)