from typing import Optional
from pydantic import BaseSettings


class Settings(BaseSettings):
    # default to SQLite for local development/testing
    DATABASE_URL: str = "sqlite:///./test.db"
    SECRET_KEY: str = "CHANGE_ME"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    # Resend API settings
    RESEND_API_KEY: Optional[str] = None
    EMAIL_FROM: str = "no-reply@example.com"
    SMTP_PASSWORD: Optional[str] = None

    class Config:
        env_file = ".env"


settings = Settings()
