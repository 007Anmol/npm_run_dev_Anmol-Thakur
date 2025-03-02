from pydantic import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Legal Aid API"
    DEBUG: bool = True
    SECRET_KEY: str = "supersecretkey"

    class Config:
        env_file = ".env"  # Load from .env file

settings = Settings()
