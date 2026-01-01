from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    # chat_id is provided in the URL path, so only content is required here
    pass

class Message(MessageBase):
    id: int
    chat_id: int
    sender_id: int
    created_at: datetime
    is_read: bool
    
    class Config:
        from_attributes = True

class Chat(BaseModel):
    id: int
    user1_id: int
    user2_id: int
    last_message: Optional[str] = None
    last_message_time: Optional[datetime] = None
    unread_count: int = 0
    participant_name: Optional[str] = None
    participant_avatar: Optional[str] = None
    
    class Config:
        from_attributes = True

class ChatCreate(BaseModel):
    user_id: int




