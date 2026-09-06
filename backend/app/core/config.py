from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    APP_NAME: str 
    APP_VERSION: str

    SECRET_KEY: str
    RESEND_API_KEY: str

    DATABASE_URL: str

    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60


    class Config:
        env_file = ".env"


settings = Settings()