from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, skills, sessions, transactions, chats

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(skills.router, prefix="/skills", tags=["skills"])
api_router.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
api_router.include_router(chats.router, prefix="/chats", tags=["chats"])




