from pydantic import BaseModel
from datetime import datetime

class TransactionBase(BaseModel):
    type: str
    amount: int
    description: str

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True




