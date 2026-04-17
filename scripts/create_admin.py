import hashlib
import os
import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# Import database components
from database.connection import SessionLocal
from database.models import Admin

def hash_password(password: str) -> str:
    """Hash a password using SHA-256 (matching api/auth.py)"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_admin(username, password, email, full_name):
    db = SessionLocal()
    try:
        # Check if already exists
        existing = db.query(Admin).filter(Admin.username == username).first()
        if existing:
            print(f"Admin '{username}' already exists. Updating password...")
            existing.password_hash = hash_password(password)
            existing.email = email
            existing.full_name = full_name
        else:
            print(f"Creating new admin: {username}")
            new_admin = Admin(
                username=username,
                email=email,
                password_hash=hash_password(password),
                full_name=full_name,
                role="admin"
            )
            db.add(new_admin)
        
        db.commit()
        print("Success!")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Credentials from user request
    create_admin(
        username="control",
        password="control01",
        email="admin@giawestllc.com",
        full_name="Giawest Admin Control"
    )
