from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as SQLSession
from app.core.database import get_db
from app.models.chat import Chat as ChatModel, Message as MessageModel
from app.models.user import User as UserModel
from app.schemas.chat import Chat as ChatSchema, Message as MessageSchema, MessageCreate
from typing import List
from app.core.auth import get_current_user as get_current_user_dep
from app.schemas.chat import ChatCreate

router = APIRouter()

@router.get("/", response_model=List[ChatSchema])
async def get_chats(db: SQLSession = Depends(get_db), current_user: UserModel = Depends(get_current_user_dep)):
    # Return chats for authenticated user
    chats = db.query(ChatModel).filter(
        (ChatModel.user1_id == current_user.id) | (ChatModel.user2_id == current_user.id)
    ).all()

    result = []
    for chat in chats:
        if chat.user1_id == current_user.id:
            partner = db.query(UserModel).filter(UserModel.id == chat.user2_id).first()
            unread_count = chat.unread_count_user1
        else:
            partner = db.query(UserModel).filter(UserModel.id == chat.user1_id).first()
            unread_count = chat.unread_count_user2

        result.append({
            "id": chat.id,
            "user1_id": chat.user1_id,
            "user2_id": chat.user2_id,
            "last_message": chat.last_message,
            "last_message_time": chat.last_message_time,
            "unread_count": unread_count,
            "participant_id": partner.id if partner else None,
            "participant_name": partner.name if partner else None,
            "participant_avatar": partner.avatar_url if partner else None,
            "participant_is_active": partner.is_active if partner else False,
        })
    return result

@router.get("/{chat_id}/messages", response_model=List[MessageSchema])
async def get_messages(chat_id: int, db: SQLSession = Depends(get_db), current_user: UserModel = Depends(get_current_user_dep)):
    # Ensure current user is part of the chat
    chat = db.query(ChatModel).filter(ChatModel.id == chat_id).first()
    if not chat or (current_user.id not in (chat.user1_id, chat.user2_id)):
        raise HTTPException(status_code=404, detail="Chat not found")

    messages = db.query(MessageModel).filter(MessageModel.chat_id == chat_id).order_by(MessageModel.created_at).all()
    return messages

@router.post("/{chat_id}/messages", response_model=MessageSchema)
async def create_message(
    chat_id: int,
    message: MessageCreate,
    db: SQLSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user_dep),
):
    # Create message from authenticated user
    db_message = MessageModel(
        chat_id=chat_id,
        sender_id=current_user.id,
        content=message.content
    )
    db.add(db_message)
    
    # Update chat last message
    chat = db.query(ChatModel).filter(ChatModel.id == chat_id).first()
    if chat:
        chat.last_message = message.content
        chat.last_message_time = db_message.created_at
        # increment unread count on the recipient
        if chat.user1_id == current_user.id:
            chat.unread_count_user2 += 1
        else:
            chat.unread_count_user1 += 1
    
    db.commit()
    db.refresh(db_message)
    return db_message


@router.post("/", response_model=ChatSchema)
async def get_or_create_chat(payload: ChatCreate, db: SQLSession = Depends(get_db), current_user: UserModel = Depends(get_current_user_dep)):
    """Get an existing chat between current_user and payload.user_id or create one."""
    other_id = payload.user_id
    if other_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot create chat with yourself")

    chat = db.query(ChatModel).filter(
        ((ChatModel.user1_id == current_user.id) & (ChatModel.user2_id == other_id)) |
        ((ChatModel.user1_id == other_id) & (ChatModel.user2_id == current_user.id))
    ).first()

    if chat:
        partner = db.query(UserModel).filter(UserModel.id == (chat.user2_id if chat.user1_id == current_user.id else chat.user1_id)).first()
        return {
            "id": chat.id,
            "user1_id": chat.user1_id,
            "user2_id": chat.user2_id,
            "last_message": chat.last_message,
            "last_message_time": chat.last_message_time,
            "unread_count": chat.unread_count_user1 if chat.user1_id == current_user.id else chat.unread_count_user2,
            "participant_name": partner.name if partner else None,
            "participant_avatar": partner.avatar_url if partner else None,
        }

    # Create new chat
    new_chat = ChatModel(user1_id=current_user.id, user2_id=other_id)
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    partner = db.query(UserModel).filter(UserModel.id == other_id).first()
    return {
        "id": new_chat.id,
        "user1_id": new_chat.user1_id,
        "user2_id": new_chat.user2_id,
        "last_message": new_chat.last_message,
        "last_message_time": new_chat.last_message_time,
        "unread_count": 0,
        "participant_name": partner.name if partner else None,
        "participant_avatar": partner.avatar_url if partner else None,
    }




