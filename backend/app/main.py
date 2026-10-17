from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
<<<<<<< HEAD
=======
from app.core.redis import connect_redis, disconnect_redis
>>>>>>> origin/su

from app import models
from app.routers import (
    application,
    advisor_assignment,
    auth,
    company,
    document,
    position,
    staff_application,
)
from app.routers import student
from app.routers import advisor
from app.routers import mentor
from app.routers import staff


<<<<<<< HEAD

from app.routers.email_test import router as email_test_router


=======
>>>>>>> origin/su
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await connect_redis()


@app.on_event("shutdown")
async def shutdown():
    await disconnect_redis()


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

app.include_router(
    company.router
)

app.include_router(
    position.router
)
app.include_router(
    student.router
)

app.include_router(
    advisor.router
)

app.include_router(
    mentor.router
)

app.include_router(
    staff.router
)

app.include_router(
    document.router
)

app.include_router(
    application.router
)

app.include_router(
    staff_application.router
)

app.include_router(
    advisor_assignment.router
)

app.include_router(email_test_router, prefix="/email")
