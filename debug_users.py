import asyncio
import sys
import os
import hashlib

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.database import init_db, get_database, close_db

async def debug_user_data():
    """Debug user data in database"""
    try:
        print("Debugging user data...")
        
        # Initialize database
        await init_db()
        print("✅ Database connected!")
        
        # Get database instance
        db = get_database()
        
        # Find all users
        users = await db.users.find({}).to_list(length=None)
        print(f"Found {len(users)} users in database:")
        
        for user in users:
            print(f"\nUser ID: {user['_id']}")
            print(f"Username: {user['username']}")
            print(f"Email: {user['email']}")
            print(f"Full Name: {user['full_name']}")
            print(f"Hashed Password: {user['hashed_password']}")
            print(f"Password Length: {len(user['hashed_password'])}")
            
            # Test password hash
            test_password = "123456"
            test_hash = hashlib.sha256(test_password.encode()).hexdigest()
            print(f"Test Hash for '123456': {test_hash}")
            print(f"Hash Match: {user['hashed_password'] == test_hash}")
        
        return True
        
    except Exception as e:
        print(f"❌ Debug failed: {e}")
        return False
    finally:
        # Close connection
        await close_db()

if __name__ == "__main__":
    asyncio.run(debug_user_data())
