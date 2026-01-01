import psycopg2
from urllib.parse import urlparse

# Parse DATABASE_URL with correct credentials
database_url = "postgresql://postgres:salman%401205@localhost:5432/circleed"

# Parse the URL
parsed = urlparse(database_url)
# Decode the password since it's URL-encoded
from urllib.parse import unquote
password = unquote(parsed.password) if parsed.password else 'password'

try:
    # Connect to the database
    conn = psycopg2.connect(
        host=parsed.hostname or 'localhost',
        port=parsed.port or 5432,
        database=parsed.path.lstrip('/'),
        user=parsed.username or 'postgres',
        password=password
    )
    
    cursor = conn.cursor()
    
    # Check if created_at column already exists
    cursor.execute("""
        SELECT column_name FROM information_schema.columns 
        WHERE table_name='skill_reviews' AND column_name='created_at'
    """)
    
    if cursor.fetchone():
        print("created_at column already exists in skill_reviews table")
    else:
        # Add created_at column with default value
        cursor.execute("""
            ALTER TABLE skill_reviews
            ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        """)
        conn.commit()
        print("Successfully added created_at column to skill_reviews table")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"Error: {e}")
    exit(1)
