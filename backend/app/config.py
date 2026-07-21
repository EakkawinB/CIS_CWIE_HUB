from pathlib import Path
from pydantic_settings import BaseSettings


BASE_DIR = Path(__file__).resolve().parent.parent



class Settings(BaseSettings):

    APP_NAME: str
    APP_VERSION: str

    DATABASE_URL: str 

    SECRET_KEY: str 
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    REDIS_URL: str = "redis://localhost:6379"

    EMAIL_HOST: str | None = None
    EMAIL_PORT: int | None = None
    EMAIL_ADDRESS: str | None = None
    EMAIL_PASSWORD: str | None = None


    class Config:
        env_file = BASE_DIR / ".env"
        extra = "ignore"


settings = Settings()