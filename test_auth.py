import requests
import json

# Test registration
def test_register():
    url = "http://localhost:8000/api/auth/register"
    
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "full_name": "Test User",
        "password": "123456"
    }
    
    try:
        response = requests.post(url, json=user_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Registration successful!")
            return response.json()
        else:
            print("❌ Registration failed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")

# Test login
def test_login():
    url = "http://localhost:8000/api/auth/login"
    
    login_data = {
        "email": "test@example.com",
        "password": "123456"
    }
    
    try:
        response = requests.post(url, json=login_data)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            return response.json()
        else:
            print("❌ Login failed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("Testing Registration and Login...")
    print("=" * 50)
    
    # Test registration
    print("1. Testing Registration:")
    register_result = test_register()
    
    # Test login
    print("\n2. Testing Login:")
    login_result = test_login()
    
    print("\n" + "=" * 50)
    print("Test completed!")
