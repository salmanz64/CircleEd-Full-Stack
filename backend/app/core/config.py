from typing import List
import os
from dotenv import load_dotenv
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is not set")

    SECRET_KEY: str = os.getenv("SECRET_KEY")
    if not SECRET_KEY:
        raise RuntimeError("SECRET_KEY is not set")

    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    CORS_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "").split(",")
        if origin.strip()
    ]

    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")

    USE_MOCK_DB: bool = os.getenv("USE_MOCK_DB", "false").lower() == "true"

    def __init__(self):
        logger.info(f"✅ CORS Origins configured: {self.CORS_ORIGINS if self.CORS_ORIGINS else 'ALLOWING ALL (*)'}")
        if not self.CORS_ORIGINS:
            logger.warning("⚠️  No CORS_ORIGINS set - allowing all origins for development")
        else:
            logger.info(f"🔒 Restricted to origins: {self.CORS_ORIGINS}")

settings = Settings()
