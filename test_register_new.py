import requests
import json

def test_register_new_user():
    url = "http://localhost:8001/api/auth/register"
    
    user_data = {
        "username": "newuser123",
        "email": "newuser123@example.com",
        "full_name": "New User 123",
        "password": "123456"
    }
    
    try:
        print("Testing registration with new user...")
        response = requests.post(url, json=user_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Registration successful!")
            return True
        else:
            print("❌ Registration failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_register_new_user()
