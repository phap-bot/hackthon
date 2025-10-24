import requests
import json

def test_frontend_login():
    url = "http://localhost:3000/api/auth/login"
    
    login_data = {
        "email": "phap@gmail.com",
        "password": "123456"
    }
    
    try:
        print("Testing frontend login API...")
        response = requests.post(url, json=login_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Frontend login successful!")
            return True
        else:
            print("❌ Frontend login failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_frontend_login()
