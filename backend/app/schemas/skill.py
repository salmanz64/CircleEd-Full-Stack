from pydantic import BaseModel
from typing import Optional, List, Dict
from app.schemas.user import User
from datetime import datetime

class SkillBase(BaseModel):
    title: str
    description: str
    category: str
    level: str
    language: str = "English"
    tokens_per_session: int
    availability: List[Dict] = []

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    level: Optional[str] = None
    language: Optional[str] = None
    tokens_per_session: Optional[int] = None
    availability: Optional[List[Dict]] = None

class Skill(SkillBase):
    id: int
    teacher_id: int
    rating: float
    review_count: int
    badges: List[str] = []
    teacher: Optional[User] = None
    
    class Config:
        from_attributes = True

class SkillReviewBase(BaseModel):
    rating: int
    comment: Optional[str] = None

class SkillReviewCreate(SkillReviewBase):
    pass

class SkillReview(SkillReviewBase):
    id: int
    skill_id: int
    reviewer_id: int
    reviewer: Optional[User] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True




