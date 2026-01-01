from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session as SQLSession
from app.core.database import get_db
from app.models.user import User as UserModel
from app.schemas.user import User, UserUpdate
from typing import List
from app.core.auth import get_current_user as get_current_user_dep

router = APIRouter()


@router.get("/me", response_model=User)
async def get_current_user(current_user: UserModel = Depends(get_current_user_dep)):
    return current_user


@router.get("/{user_id}", response_model=User)
async def get_user(user_id: int, db: SQLSession = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/me", response_model=User)
async def update_user(
    user_update: UserUpdate,
    db: SQLSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user_dep),
):
    user = db.query(UserModel).filter(UserModel.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user




