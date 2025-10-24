import asyncio
import sys
import os
import hashlib

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.database import init_db, get_database, close_db

async def test_register_simple():
    """Test registration with simple password hashing"""
    try:
        print("Testing registration...")
        
        # Initialize database
        await init_db()
        print("✅ Database connected!")
        
        # Get database instance
        db = get_database()
        
        # Simple password hash (for testing only)
        password = "123456"
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        
        # Test user data
        user_data = {
            "username": "testuser2",
            "email": "test2@example.com", 
            "full_name": "Test User 2",
            "hashed_password": hashed_password,
            "is_active": True,
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
        
        # Check if user exists
        existing_user = await db.users.find_one({
            "$or": [
                {"email": user_data["email"]},
                {"username": user_data["username"]}
            ]
        })
        
        if existing_user:
            print("❌ User already exists!")
            return False
        
        # Insert user
        result = await db.users.insert_one(user_data)
        print(f"✅ User created with ID: {result.inserted_id}")
        
        # Verify user was created
        created_user = await db.users.find_one({"_id": result.inserted_id})
        if created_user:
            print("✅ User verification successful!")
            print(f"   Username: {created_user['username']}")
            print(f"   Email: {created_user['email']}")
            print(f"   Full Name: {created_user['full_name']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Registration test failed: {e}")
        return False
    finally:
        # Close connection
        await close_db()

if __name__ == "__main__":
    # Run the test
    result = asyncio.run(test_register_simple())
    if result:
        print("\n✅ Registration test completed successfully!")
    else:
        print("\n❌ Registration test failed!")
        sys.exit(1)
