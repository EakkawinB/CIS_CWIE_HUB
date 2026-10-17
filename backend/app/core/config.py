from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    APP_NAME: str 
    APP_VERSION: str

    SECRET_KEY: str
    RESEND_API_KEY: str

    DATABASE_URL: str

    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    EMAIL_PROVIDER: str = "resend"
    SMTP_HOST: str = "127.0.0.1"
    SMTP_PORT: int = 1025

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
