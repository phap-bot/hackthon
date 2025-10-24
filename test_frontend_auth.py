import requests
import json

def test_frontend_auth():
    """Test frontend authentication"""
    
    print("Testing Frontend Authentication")
    print("=" * 50)
    
    # Get token from backend
    print("1. Getting token from backend...")
    login_url = "http://localhost:8000/api/auth/login"
    login_data = {
        "username": "testuser_new",
        "password": "123456"
    }
    
    try:
        login_response = requests.post(login_url, json=login_data)
        
        if login_response.status_code != 200:
            print(f"❌ Backend login failed: {login_response.text}")
            return False
            
        token = login_response.json()["access_token"]
        print("✅ Backend login successful!")
        
    except Exception as e:
        print(f"❌ Backend login error: {e}")
        return False
    
    # Test frontend /api/auth/me
    print("\n2. Testing frontend /api/auth/me...")
    try:
        me_response = requests.get(
            "http://localhost:3000/api/auth/me",
            headers={
                "Authorization": f"Bearer {token}"
            }
        )
        
        print(f"Frontend /me Status: {me_response.status_code}")
        print(f"Frontend /me Response: {me_response.text}")
        
        if me_response.status_code == 200:
            print("✅ Frontend authentication working!")
            return True
        else:
            print("❌ Frontend authentication failed!")
            return False
            
    except Exception as e:
        print(f"❌ Frontend auth error: {e}")
        return False

if __name__ == "__main__":
    test_frontend_auth()
