from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    email: EmailStr
    full_name: str
    bio: Optional[str] = None
    skills_to_teach: List[str] = []
    skills_to_learn: List[str] = []

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(..., min_length=8)
    bio: Optional[str] = None
    skills_to_teach: List[str] = Field(default_factory=list)
    skills_to_learn: List[str] = Field(default_factory=list)

class UserUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    skills_to_teach: Optional[List[str]] = None
    skills_to_learn: Optional[List[str]] = None

class User(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    
    id: int
    email: EmailStr
    full_name: str = Field(validation_alias="name")
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    token_balance: int
    streak: int
    is_active: bool
    skills_to_teach: List[str] = []
    skills_to_learn: List[str] = []


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)




