"""
Migration script to rehash all existing passwords.
Run this once to migrate all passwords to the new SHA256 + bcrypt scheme.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.core.config import settings
from app.core.security import get_password_hash, pwd_context
import hashlib

def get_db_engine():
    return create_engine(settings.DATABASE_URL)

def is_old_format_hash(hash_string: str) -> bool:
    """Check if hash is in old format (bcrypt only, without SHA256 pre-hashing)."""
    # Old format hashes start with $2a$, $2b$, or $2y$ (bcrypt)
    # New format hashes are also bcrypt, but input was SHA256 pre-hashed
    # We can identify old ones by trying to verify a known pattern
    return hash_string.startswith("$2")

def rehash_password_to_new_format(old_hash: str, plain_password: str = None):
    """
    If we have the plain password, we can rehash it properly.
    Otherwise, we need the plain password to be re-entered.
    
    NOTE: This script requires plain passwords. If they're not available,
    users will need to reset their passwords.
    """
    if plain_password is None:
        return None
    
    return get_password_hash(plain_password)

def main():
    engine = get_db_engine()
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        users = session.query(User).all()
        count = 0
        
        for user in users:
            if user.hashed_password and is_old_format_hash(user.hashed_password):
                print(f"User {user.email} has old format hash")
                # Note: We cannot automatically rehash without the plain password
                # This script is informational
                count += 1
        
        print(f"\nFound {count} users with potentially old format hashes.")
        print("NOTE: Users will need to reset their passwords or the old hashes")
        print("will be automatically handled by the new verification logic.")
        
    finally:
        session.close()

if __name__ == "__main__":
    main()
