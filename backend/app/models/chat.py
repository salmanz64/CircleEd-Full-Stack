from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Chat(Base):
    __tablename__ = "chats"
    
    id = Column(Integer, primary_key=True, index=True)
    user1_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user2_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    last_message = Column(Text, nullable=True)
    last_message_time = Column(DateTime, nullable=True)
    unread_count_user1 = Column(Integer, default=0)
    unread_count_user2 = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user1 = relationship("User", foreign_keys=[user1_id], back_populates="chats_initiated")
    user2 = relationship("User", foreign_keys=[user2_id], back_populates="chats_received")
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)
    
    # Relationships
    chat = relationship("Chat", back_populates="messages")




