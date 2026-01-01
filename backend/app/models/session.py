from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum
from datetime import datetime

class SessionStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    status = Column(String, default=SessionStatus.PENDING.value)
    duration_minutes = Column(Integer, default=60)
    review_submitted = Column(Integer, default=0)  # 0 = not reviewed, > 0 = reviewed with rating
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    skill = relationship("Skill", back_populates="sessions")
    teacher = relationship("User", foreign_keys=[teacher_id], back_populates="sessions_as_teacher")
    student = relationship("User", foreign_keys=[student_id], back_populates="sessions_as_student")




