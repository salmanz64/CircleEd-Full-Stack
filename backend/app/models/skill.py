from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String, nullable=False, index=True)
    level = Column(String, nullable=False)  # Beginner, Intermediate, Advanced
    language = Column(String, nullable=False, default="English")
    tokens_per_session = Column(Integer, nullable=False)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    badges = Column(JSON, default=list)
    availability = Column(JSON, default=list)  # [{day: "Monday", timeSlots: ["10:00 AM", "2:00 PM"]}]
    
    # Relationships
    teacher = relationship("User", back_populates="skills")
    reviews = relationship("SkillReview", back_populates="skill", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="skill")

class SkillReview(Base):
    __tablename__ = "skill_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    skill = relationship("Skill", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews_given")
