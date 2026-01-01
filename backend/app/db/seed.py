from app.core.database import SessionLocal
from app.models.user import User
from app.models.skill import Skill, SkillReview
from app.models.session import Session
from app.models.transaction import Transaction
from app.models.chat import Chat, Message
from app.core.security import get_password_hash
from datetime import datetime, timedelta

def seed_db():
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(Message).delete()
        db.query(Chat).delete()
        db.query(Transaction).delete()
        db.query(Session).delete()
        db.query(SkillReview).delete()
        db.query(Skill).delete()
        db.query(User).delete()
        db.commit()
        
        # Create users
        users = [
            User(
                email="alex@example.com",
                name="Alex Chen",
                hashed_password=get_password_hash("password123"),
                bio="Passionate JavaScript developer and teacher",
                skills_to_teach=["JavaScript", "React", "Node.js"],
                skills_to_learn=["Spanish"],
                token_balance=250,
                streak=0
            ),
            User(
                email="maria@example.com",
                name="Maria Garcia",
                hashed_password=get_password_hash("password123"),
                bio="Native Spanish speaker teaching conversational Spanish",
                skills_to_teach=["Spanish"],
                skills_to_learn=["English"],
                token_balance=180,
                streak=0
            ),
            User(
                email="james@example.com",
                name="James Wilson",
                hashed_password=get_password_hash("password123"),
                bio="Professional guitarist with 10+ years of experience",
                skills_to_teach=["Guitar"],
                skills_to_learn=["Piano"],
                token_balance=320,
                streak=0
            ),
            User(
                email="sarah@example.com",
                name="Sarah Kim",
                hashed_password=get_password_hash("password123"),
                bio="Data scientist and machine learning enthusiast",
                skills_to_teach=["Data Science", "Python", "Machine Learning"],
                skills_to_learn=["Design"],
                token_balance=200,
                streak=0
            ),
            User(
                email="john@example.com",
                name="John Doe",
                hashed_password=get_password_hash("password123"),
                bio="Passionate learner and teacher. Love sharing knowledge!",
                skills_to_teach=["JavaScript", "React"],
                skills_to_learn=["Spanish", "Guitar"],
                token_balance=150,
                streak=0
            ),
        ]
        
        for user in users:
            db.add(user)
        db.commit()
        
        # Refresh to get IDs
        for user in users:
            db.refresh(user)
        
        # Create skills
        skills = [
            Skill(
                title="JavaScript Fundamentals",
                description="Learn the core concepts of JavaScript including variables, functions, and ES6+ features.",
                teacher_id=users[0].id,
                category="Programming",
                level="Beginner",
                language="English",
                tokens_per_session=50,
                rating=4.8,
                review_count=127,
                badges=["Popular", "Verified Teacher"],
                availability=[
                    {"day": "Monday", "timeSlots": ["10:00 AM", "2:00 PM", "6:00 PM"]},
                    {"day": "Wednesday", "timeSlots": ["10:00 AM", "2:00 PM"]}
                ]
            ),
            Skill(
                title="Spanish Conversation",
                description="Practice conversational Spanish with native speakers.",
                teacher_id=users[1].id,
                category="Language",
                level="Intermediate",
                language="Spanish",
                tokens_per_session=40,
                rating=4.9,
                review_count=203,
                badges=["Native Speaker", "Popular"],
                availability=[
                    {"day": "Tuesday", "timeSlots": ["9:00 AM", "1:00 PM", "5:00 PM"]},
                    {"day": "Thursday", "timeSlots": ["9:00 AM", "1:00 PM"]}
                ]
            ),
            Skill(
                title="Guitar Basics",
                description="Master the fundamentals of guitar playing.",
                teacher_id=users[2].id,
                category="Music",
                level="Beginner",
                language="English",
                tokens_per_session=60,
                rating=4.7,
                review_count=89,
                badges=["Expert"],
                availability=[
                    {"day": "Saturday", "timeSlots": ["11:00 AM", "3:00 PM"]},
                    {"day": "Sunday", "timeSlots": ["11:00 AM", "3:00 PM"]}
                ]
            ),
            Skill(
                title="Data Science with Python",
                description="Dive into data analysis, visualization, and machine learning.",
                teacher_id=users[3].id,
                category="Programming",
                level="Advanced",
                language="English",
                tokens_per_session=75,
                rating=4.9,
                review_count=156,
                badges=["Expert", "Verified Teacher"],
                availability=[
                    {"day": "Monday", "timeSlots": ["7:00 PM"]},
                    {"day": "Wednesday", "timeSlots": ["7:00 PM"]},
                    {"day": "Friday", "timeSlots": ["7:00 PM"]}
                ]
            ),
        ]
        
        for skill in skills:
            db.add(skill)
        db.commit()
        
        for skill in skills:
            db.refresh(skill)
        
        # Create reviews
        reviews = [
            SkillReview(
                skill_id=skills[0].id,
                reviewer_id=users[4].id,
                rating=5,
                comment="Excellent teacher! Made JavaScript so easy to understand."
            ),
            SkillReview(
                skill_id=skills[1].id,
                reviewer_id=users[4].id,
                rating=5,
                comment="Maria is an amazing teacher! My Spanish improved so much."
            ),
        ]
        
        for review in reviews:
            db.add(review)
        db.commit()
        
        # Create transactions
        transactions = [
            Transaction(
                user_id=users[4].id,
                type="earn",
                amount=50,
                description="Completed teaching session: JavaScript Fundamentals",
                created_at=datetime.utcnow() - timedelta(days=1)
            ),
            Transaction(
                user_id=users[4].id,
                type="spend",
                amount=-40,
                description="Booked session: Spanish Conversation",
                created_at=datetime.utcnow() - timedelta(days=2)
            ),
            Transaction(
                user_id=users[4].id,
                type="earn",
                amount=60,
                description="Completed teaching session: Guitar Basics",
                created_at=datetime.utcnow() - timedelta(days=3)
            ),
        ]
        
        for transaction in transactions:
            db.add(transaction)
        db.commit()
        
        # Create chats
        chats = [
            Chat(
                user1_id=users[0].id,
                user2_id=users[4].id,
                last_message="Thanks for the session!",
                last_message_time=datetime.utcnow() - timedelta(hours=2),
                unread_count_user1=0,
                unread_count_user2=0
            ),
            Chat(
                user1_id=users[1].id,
                user2_id=users[4].id,
                last_message="See you tomorrow at 2 PM",
                last_message_time=datetime.utcnow() - timedelta(hours=5),
                unread_count_user1=2,
                unread_count_user2=0
            ),
        ]
        
        for chat in chats:
            db.add(chat)
        db.commit()
        
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()




