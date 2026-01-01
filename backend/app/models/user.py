from sqlalchemy import Column, Integer, String, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy import JSON
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    skills_to_teach = Column(JSON, default=list)
    skills_to_learn = Column(JSON, default=list)
    token_balance = Column(Integer, default=100)  # Starting tokens
    streak = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    skills = relationship("Skill", back_populates="teacher")
    reviews_given = relationship("SkillReview", back_populates="reviewer")
    sessions_as_student = relationship("Session", foreign_keys="Session.student_id", back_populates="student")
    sessions_as_teacher = relationship("Session", foreign_keys="Session.teacher_id", back_populates="teacher")
    transactions = relationship("Transaction", back_populates="user")
    chats_initiated = relationship("Chat", foreign_keys="Chat.user1_id", back_populates="user1")
    chats_received = relationship("Chat", foreign_keys="Chat.user2_id", back_populates="user2")

