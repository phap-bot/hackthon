import requests
import json
from pymongo import MongoClient

def debug_database():
    """Debug database user"""
    
    print("Debugging Database User")
    print("=" * 50)
    
    # Connect to MongoDB
    try:
        client = MongoClient("mongodb://localhost:27017")
        db = client.hackthon
        users_collection = db.users
        
        # Find user by username
        user = users_collection.find_one({"username": "testuser_new"})
        
        if user:
            print(f"✅ User found in database:")
            print(f"   ID: {user['_id']}")
            print(f"   Username: {user['username']}")
            print(f"   Email: {user['email']}")
            print(f"   Full Name: {user['full_name']}")
        else:
            print("❌ User not found in database")
            return False
            
        # Test /me endpoint with correct user_id
        print("\n2. Testing /me with correct user_id...")
        
        # Get token
        login_url = "http://localhost:8000/api/auth/login"
        login_data = {
            "username": "testuser_new",
            "password": "123456"
        }
        
        login_response = requests.post(login_url, json=login_data)
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.text}")
            return False
            
        token = login_response.json()["access_token"]
        
        # Test /me
        me_response = requests.get(
            "http://localhost:8000/api/auth/me",
            headers={
                "Authorization": f"Bearer {token}"
            }
        )
        
        print(f"Status: {me_response.status_code}")
        print(f"Response: {me_response.text}")
        
        if me_response.status_code == 200:
            print("✅ /me endpoint working!")
            return True
        else:
            print("❌ /me endpoint failed!")
            return False
            
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False

if __name__ == "__main__":
    debug_database()
