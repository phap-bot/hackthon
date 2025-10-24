import requests
import json

def test_login():
    url = "http://localhost:8000/api/auth/login"
    
    # Test with new user (SHA256 hash)
    login_data = {
        "username": "testuser_new",
        "password": "123456"
    }
    
    try:
        print("Testing login with testuser_new...")
        response = requests.post(url, json=login_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            return True
        else:
            print("❌ Login failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_login()
