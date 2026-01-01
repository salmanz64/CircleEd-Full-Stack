from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SessionBase(BaseModel):
    skill_id: int
    scheduled_at: datetime
    duration_minutes: int = 60

class SessionCreate(SessionBase):
    pass

class Session(SessionBase):
    id: int
    teacher_id: int
    student_id: int
    status: str
    review_submitted: int = 0
    created_at: datetime
    
    class Config:
        from_attributes = True




