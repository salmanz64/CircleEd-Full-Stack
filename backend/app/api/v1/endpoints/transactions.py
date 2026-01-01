from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as SQLSession
from app.core.database import get_db
from app.models.transaction import Transaction as TransactionModel
from app.schemas.transaction import Transaction as TransactionSchema
from typing import List
from app.core.auth import get_current_user as get_current_user_dep
from app.models.user import User as UserModel

router = APIRouter()

@router.get("/", response_model=List[TransactionSchema])
async def get_transactions(db: SQLSession = Depends(get_db), current_user: UserModel = Depends(get_current_user_dep)):
    # Get transactions for authenticated user, ordered by most recent first
    transactions = db.query(TransactionModel).filter(TransactionModel.user_id == current_user.id).order_by(TransactionModel.created_at.desc()).all()
    return transactions

@router.get("/balance")
async def get_balance(db: SQLSession = Depends(get_db), current_user: UserModel = Depends(get_current_user_dep)):
    user = db.query(UserModel).filter(UserModel.id == current_user.id).first()
    if not user:
        return {"balance": 0}
    return {"balance": user.token_balance}




