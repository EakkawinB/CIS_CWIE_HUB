from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine

from app import models
from app.routers import auth, company, position
from app.routers import student
from app.routers import advisor
from app.routers import mentor
from app.routers import staff



from app.routers.email_test import router as email_test_router

Base.metadata.create_all(bind=engine)


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

@app.get("/")
def root():

    return {
        "message":"CIS CWIE Hub",
        "version":settings.APP_VERSION
    }
    
@app.get("/health")

def health_check():

    return {

        "status":"running"

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

app.include_router(email_test_router, prefix="/email")