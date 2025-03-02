<<<<<<< HEAD
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    APP_NAME = "AI Legal Aid System"
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60

config = Config()
=======
from pydantic import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Legal Aid API"
    DEBUG: bool = True
    SECRET_KEY: str = "supersecretkey"

    class Config:
        env_file = ".env"  # Load from .env file

settings = Settings()
>>>>>>> ac73e99c020b2d7bb0bc31f1d8f215e36d80d296
