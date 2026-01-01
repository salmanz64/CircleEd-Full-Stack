from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as SQLSession
from app.core.database import get_db
from app.models.session import Session as SessionModel
from app.models.skill import Skill as SkillModel
from app.models.user import User as UserModel
from app.models.transaction import Transaction as TransactionModel
from app.schemas.session import Session as SessionSchema, SessionCreate
from typing import List
from app.core.auth import get_current_user as get_current_user_dep
from datetime import datetime

router = APIRouter()

def create_transaction(db: SQLSession, user_id: int, type: str, amount: int, description: str):
    """Helper function to create transaction records"""
    transaction = TransactionModel(
        user_id=user_id,
        type=type,
        amount=amount,
        description=description,
        created_at=datetime.utcnow()
    )
    db.add(transaction)
    db.commit()

@router.get("/", response_model=List[SessionSchema])
async def get_sessions(db: SQLSession = Depends(get_db), current_user: UserModel = Depends(get_current_user_dep)):
    # Return sessions where the current user is either student or teacher
    sessions = db.query(SessionModel).filter(
        (SessionModel.student_id == current_user.id) | (SessionModel.teacher_id == current_user.id)
    ).all()
    return sessions

@router.get("/upcoming", response_model=List[SessionSchema])
async def get_upcoming_sessions(db: SQLSession = Depends(get_db), current_user: UserModel = Depends(get_current_user_dep)):
    from datetime import datetime
    sessions = db.query(SessionModel).filter(
        SessionModel.student_id == current_user.id,
        SessionModel.scheduled_at > datetime.utcnow(),
        SessionModel.status.in_(["pending", "confirmed"])
    ).all()
    return sessions

@router.post("/", response_model=SessionSchema)
async def create_session(session: SessionCreate, db: SQLSession = Depends(get_db), current_user: UserModel = Depends(get_current_user_dep)):
    # Create a booking for the authenticated user as student
    # Check if skill exists
    skill = db.query(SkillModel).filter(SkillModel.id == session.skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    # Check token balance
    student = db.query(UserModel).filter(UserModel.id == current_user.id).first()
    if student.token_balance < skill.tokens_per_session:
        raise HTTPException(status_code=400, detail="Insufficient tokens")
    
    # Deduct tokens
    student.token_balance -= skill.tokens_per_session
    
    # Create transaction record for token spend
    create_transaction(
        db,
        user_id=current_user.id,
        type="spend",
        amount=skill.tokens_per_session,
        description=f"Booked session for {skill.title}"
    )
    
    # Create session
    db_session = SessionModel(
        skill_id=session.skill_id,
        teacher_id=skill.teacher_id,
        student_id=current_user.id,
        scheduled_at=session.scheduled_at,
        duration_minutes=session.duration_minutes,
        status="pending"
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.post("/{session_id}/confirm", response_model=SessionSchema)
async def confirm_session(session_id: int, db: SQLSession = Depends(get_db), current_user: UserModel = Depends(get_current_user_dep)):
    # Only teacher can confirm
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only teacher can confirm this session")
    
    if session.status != "pending":
        raise HTTPException(status_code=400, detail="Session can only be confirmed from pending status")
    
    session.status = "confirmed"
    db.commit()
    db.refresh(session)
    return session

@router.post("/{session_id}/decline", response_model=SessionSchema)
async def decline_session(session_id: int, db: SQLSession = Depends(get_db), current_user: UserModel = Depends(get_current_user_dep)):
    # Only teacher can decline
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only teacher can decline this session")
    
    if session.status != "pending":
        raise HTTPException(status_code=400, detail="Session can only be declined from pending status")
    
    # Get skill to find token cost
    skill = db.query(SkillModel).filter(SkillModel.id == session.skill_id).first()
    
    # Refund tokens to student
    student = db.query(UserModel).filter(UserModel.id == session.student_id).first()
    if student and skill:
        student.token_balance += skill.tokens_per_session
        
        # Create transaction record for token refund
        create_transaction(
            db,
            user_id=session.student_id,
            type="earn",
            amount=skill.tokens_per_session,
            description=f"Refund for declined session on {skill.title}"
        )
    
    session.status = "cancelled"
    db.commit()
    db.refresh(session)
    return session

@router.post("/{session_id}/cancel", response_model=SessionSchema)
async def cancel_session(session_id: int, db: SQLSession = Depends(get_db), current_user: UserModel = Depends(get_current_user_dep)):
    # Only student can cancel
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only student can cancel this session")
    
    if session.status == "completed":
        raise HTTPException(status_code=400, detail="Cannot cancel a completed session")
    
    if session.status == "cancelled":
        raise HTTPException(status_code=400, detail="Session is already cancelled")
    
    # Get skill to find token cost
    skill = db.query(SkillModel).filter(SkillModel.id == session.skill_id).first()
    
    # Refund tokens to student
    student = db.query(UserModel).filter(UserModel.id == session.student_id).first()
    if student and skill:
        student.token_balance += skill.tokens_per_session
        
        # Create transaction record for token refund
        create_transaction(
            db,
            user_id=session.student_id,
            type="earn",
            amount=skill.tokens_per_session,
            description=f"Refund for cancelled session on {skill.title}"
        )
    
    session.status = "cancelled"
    db.commit()
    db.refresh(session)
    return session

@router.post("/{session_id}/complete", response_model=SessionSchema)
async def complete_session(session_id: int, db: SQLSession = Depends(get_db), current_user: UserModel = Depends(get_current_user_dep)):
    # Only teacher can mark as complete
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only teacher can mark this session as complete")
    
    if session.status != "confirmed":
        raise HTTPException(status_code=400, detail="Session must be confirmed before marking as complete")
    
    # Get skill to award tokens to teacher
    skill = db.query(SkillModel).filter(SkillModel.id == session.skill_id).first()
    
    # Award tokens to teacher
    teacher = db.query(UserModel).filter(UserModel.id == session.teacher_id).first()
    if teacher and skill:
        teacher.token_balance += skill.tokens_per_session
        
        # Create transaction record for teacher earning
        create_transaction(
            db,
            user_id=session.teacher_id,
            type="earn",
            amount=skill.tokens_per_session,
            description=f"Earned from teaching {skill.title}"
        )
    
    # Increment student's learning streak
    student = db.query(UserModel).filter(UserModel.id == session.student_id).first()
    if student:
        student.streak = (student.streak or 0) + 1
    
    session.status = "completed"
    db.commit()
    db.refresh(session)
    return session





