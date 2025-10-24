import asyncio
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.database import init_db, get_database, close_db

async def check_recent_users():
    """Check recent users in database"""
    try:
        print("Checking recent users in database...")
        
        # Initialize database
        await init_db()
        print("✅ Database connected!")
        
        # Get database instance
        db = get_database()
        
        # Find recent users (last 10)
        users = await db.users.find({}).sort("_id", -1).limit(10).to_list(length=None)
        print(f"Found {len(users)} recent users:")
        
        for i, user in enumerate(users, 1):
            print(f"\n{i}. User ID: {user['_id']}")
            print(f"   Username: {user['username']}")
            print(f"   Email: {user['email']}")
            print(f"   Full Name: {user['full_name']}")
            print(f"   Created: {user.get('created_at', 'N/A')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Check failed: {e}")
        return False
    finally:
        # Close connection
        await close_db()

if __name__ == "__main__":
    asyncio.run(check_recent_users())
