import requests
import json

# Test registration with frontend API route
def test_register_frontend():
    url = "http://localhost:3000/api/auth/register"
    
    user_data = {
        "username": "testuser3",
        "email": "test3@example.com",
        "full_name": "Test User 3",
        "password": "123456"
    }
    
    try:
        print("Testing registration with frontend API...")
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

# Test registration with backend API directly
def test_register_backend():
    url = "http://localhost:8000/api/auth/register"
    
    user_data = {
        "username": "testuser_new",
        "email": "test_new@example.com",
        "full_name": "Test User 5",
        "password": "123456"
    }
    
    try:
        print("Testing registration with backend API...")
        response = requests.post(url, json=user_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Backend registration successful!")
            return True
        else:
            print("❌ Backend registration failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("1. Testing Backend API:")
    test_register_backend()
    
    print("\n2. Testing Frontend API:")
    test_register_frontend()
