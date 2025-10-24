import requests
import json

def test_frontend_api_direct():
    """Test frontend API directly"""
    
    print("Testing Frontend API Direct")
    print("=" * 50)
    
    # Test frontend preferences endpoint
    frontend_url = "http://localhost:3000/api/preferences"
    
    # First login to get token
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
    
    # Test frontend preferences
    print("\n2. Testing frontend preferences...")
    preferences_data = {
        "travel_types": ["adventure", "culture"],
        "dream_destinations": ["beach", "mountains"],
        "activities": ["food", "trekking"],
        "budget_level": "medium",
        "trip_duration_preference": "medium",
        "group_size_preference": "couple",
        "accommodation_preference": "hotel",
        "transportation_preference": "flight"
    }
    
    try:
        response = requests.post(
            frontend_url,
            json=preferences_data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            }
        )
        
        print(f"Frontend Status: {response.status_code}")
        print(f"Frontend Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Frontend preferences successful!")
            return True
        else:
            print("❌ Frontend preferences failed!")
            return False
            
    except Exception as e:
        print(f"❌ Frontend error: {e}")
        return False

if __name__ == "__main__":
    test_frontend_api_direct()
