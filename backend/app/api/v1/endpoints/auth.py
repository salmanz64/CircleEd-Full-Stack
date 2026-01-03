from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User as UserModel
from app.schemas.user import UserCreate, UserLogin, User as UserSchema
from datetime import timedelta
from app.core.config import settings
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/register", response_model=UserSchema)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Register request received: {user_data.model_dump()}")
    try:
        # Check if user exists
        db_user = db.query(UserModel).filter(UserModel.email == user_data.email).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        db_user = UserModel(
            email=user_data.email,
            name=user_data.full_name,
            hashed_password=hashed_password,
            bio=user_data.bio,
            skills_to_teach=user_data.skills_to_teach,
            skills_to_learn=user_data.skills_to_learn,
            token_balance=100  # Starting tokens
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logger.info(f"User registered successfully: {user_data.email}")
        return db_user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration error: {str(e)}"
        )

@router.post("/login")
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }




