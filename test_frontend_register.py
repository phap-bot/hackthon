import requests
import json

def test_frontend_register():
    url = "http://localhost:3000/api/auth/register"
    
    user_data = {
        "username": "testuser999",
        "email": "testuser999@example.com",
        "full_name": "Test User 999",
        "password": "123456"
    }
    
    try:
        print("Testing frontend register API...")
        response = requests.post(url, json=user_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Frontend registration successful!")
            return True
        else:
            print("❌ Frontend registration failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_frontend_register()
