from typing import List
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://user:password@localhost:5432/circleed_db"
    )
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # CORS - Parse comma-separated string into list
    CORS_ORIGINS: List[str] = [
        origin.strip() for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://localhost:3001"
        ).split(",")
    ]
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Use mock database if DATABASE_URL is not set or is mock
    USE_MOCK_DB: bool = os.getenv("USE_MOCK_DB", "true").lower() == "true"

settings = Settings()




