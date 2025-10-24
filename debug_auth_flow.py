import requests
import json
import base64

def debug_auth_flow():
    """Debug authentication flow"""
    
    print("Debugging Authentication Flow")
    print("=" * 50)
    
    # Get token
    login_url = "http://localhost:8000/api/auth/login"
    login_data = {
        "username": "testuser_new",
        "password": "123456"
    }
    
    try:
        login_response = requests.post(login_url, json=login_data)
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.text}")
            return False
            
        token = login_response.json()["access_token"]
        print(f"✅ Token: {token[:50]}...")
        
        # Decode token to get user_id
        parts = token.split('.')
        payload = parts[1]
        payload += '=' * (4 - len(payload) % 4)
        decoded = base64.b64decode(payload)
        payload_data = json.loads(decoded)
        
        user_id_from_token = payload_data.get("sub")
        print(f"✅ User ID from token: {user_id_from_token}")
        
        # Test direct database query
        from pymongo import MongoClient
        client = MongoClient("mongodb://localhost:27017")
        db = client.hackthon
        
        # Try to find user with ObjectId
        from bson import ObjectId
        try:
            user = db.users.find_one({"_id": ObjectId(user_id_from_token)})
            if user:
                print(f"✅ User found with ObjectId: {user['username']}")
            else:
                print("❌ User not found with ObjectId")
        except Exception as e:
            print(f"❌ ObjectId error: {e}")
            
        # Try to find user with string
        try:
            user = db.users.find_one({"_id": user_id_from_token})
            if user:
                print(f"✅ User found with string: {user['username']}")
            else:
                print("❌ User not found with string")
        except Exception as e:
            print(f"❌ String error: {e}")
            
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    debug_auth_flow()
