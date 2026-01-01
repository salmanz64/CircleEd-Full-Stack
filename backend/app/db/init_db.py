from app.core.database import engine, Base
from app.models import User, Skill, SkillReview, Session, Transaction, Chat, Message

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
    print("Database initialized!")




