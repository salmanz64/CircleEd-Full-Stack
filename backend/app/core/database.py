from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# For mock database, use SQLite
if settings.USE_MOCK_DB or "mock" in settings.DATABASE_URL.lower():
    SQLALCHEMY_DATABASE_URL = "sqlite:///./circleed_mock.db"
else:
    SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

if "sqlite" in SQLALCHEMY_DATABASE_URL:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False},
        echo=False
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

