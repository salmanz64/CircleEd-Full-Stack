from sqlalchemy import text
from app.core.database import engine

with engine.connect() as conn:
    try:
        # Try to add the column
        conn.execute(text("ALTER TABLE sessions ADD COLUMN review_submitted INT DEFAULT 0"))
        conn.commit()
        print("Column added successfully")
    except Exception as e:
        if "already exists" in str(e).lower():
            print("Column already exists")
        else:
            print(f"Error: {e}")  
