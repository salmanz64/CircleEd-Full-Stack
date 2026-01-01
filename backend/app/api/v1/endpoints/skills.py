from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session as SQLSession
from sqlalchemy import update
from app.core.database import get_db
from app.models.skill import Skill as SkillModel, SkillReview as SkillReviewModel
from app.models.user import User
from app.schemas.skill import Skill, SkillCreate, SkillUpdate, SkillReview, SkillReviewCreate
from typing import List, Optional
from app.core.auth import get_current_user as get_current_user_dep

router = APIRouter()

@router.get("/", response_model=List[Skill])
async def get_skills(
    category: Optional[str] = Query(None),
    level: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: SQLSession = Depends(get_db)
):
    query = db.query(SkillModel)
    
    if category:
        query = query.filter(SkillModel.category == category)
    if level:
        query = query.filter(SkillModel.level == level)
    if language:
        query = query.filter(SkillModel.language == language)
    if search:
        query = query.filter(
            (SkillModel.title.ilike(f"%{search}%")) |
            (SkillModel.description.ilike(f"%{search}%"))
        )
    
    skills = query.all()
    # Load teacher relationship
    for skill in skills:
        skill.teacher = db.query(User).filter(User.id == skill.teacher_id).first()
    return skills

@router.get("/{skill_id}", response_model=Skill)
async def get_skill(skill_id: int, db: SQLSession = Depends(get_db)):
    skill = db.query(SkillModel).filter(SkillModel.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    skill.teacher = db.query(User).filter(User.id == skill.teacher_id).first()
    return skill

@router.post("/", response_model=Skill)
async def create_skill(
    skill: SkillCreate,
    db: SQLSession = Depends(get_db),
    current_user: User = Depends(get_current_user_dep),
):
    # Associate the created skill with the authenticated user
    db_skill = SkillModel(
        **skill.dict(),
        teacher_id=current_user.id
    )
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.put("/{skill_id}", response_model=Skill)
async def update_skill(
    skill_id: int,
    skill_update: SkillUpdate,
    db: SQLSession = Depends(get_db),
    current_user: User = Depends(get_current_user_dep),
):
    db_skill = db.query(SkillModel).filter(SkillModel.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    # Check if user is the skill owner
    if db_skill.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own skills")
    
    # Update skill fields
    update_data = skill_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_skill, field, value)
    
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.delete("/{skill_id}")
async def delete_skill(
    skill_id: int,
    db: SQLSession = Depends(get_db),
    current_user: User = Depends(get_current_user_dep),
):
    db_skill = db.query(SkillModel).filter(SkillModel.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    # Check if user is the skill owner
    if db_skill.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own skills")
    
    db.delete(db_skill)
    db.commit()
    return {"message": "Skill deleted successfully"}

@router.get("/{skill_id}/reviews", response_model=List[SkillReview])
async def get_skill_reviews(skill_id: int, db: SQLSession = Depends(get_db)):
    reviews = db.query(SkillReviewModel).filter(SkillReviewModel.skill_id == skill_id).all()
    for review in reviews:
        review.reviewer = db.query(User).filter(User.id == review.reviewer_id).first()
    return reviews

@router.post("/{skill_id}/reviews", response_model=SkillReview)
async def create_review(
    skill_id: int,
    review: SkillReviewCreate,
    db: SQLSession = Depends(get_db),
    current_user: User = Depends(get_current_user_dep)
):
    # Create the review
    db_review = SkillReviewModel(
        skill_id=skill_id,
        reviewer_id=current_user.id,
        rating=review.rating,
        comment=review.comment
    )
    db.add(db_review)
    db.flush()  # Flush to ensure the review is in the session
    
    # Calculate updated rating and review count
    all_reviews = db.query(SkillReviewModel).filter(SkillReviewModel.skill_id == skill_id).all()
    new_rating = sum(r.rating for r in all_reviews) / len(all_reviews) if all_reviews else 0.0
    new_review_count = len(all_reviews)
    
    # Use explicit UPDATE query to ensure the skill is updated in the database
    db.execute(
        update(SkillModel)
        .where(SkillModel.id == skill_id)
        .values(rating=new_rating, review_count=new_review_count)
    )
    
    db.commit()
    db.refresh(db_review)
    return db_review




