from fastapi import FastAPI

from app.config import settings
from app.database import Base, engine

from app import models
from app.routers import auth


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
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