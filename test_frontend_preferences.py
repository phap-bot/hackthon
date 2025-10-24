import requests
import json

def test_frontend_preferences():
    """Test frontend preferences API"""
    
    # Test frontend preferences endpoint
    frontend_url = "http://localhost:3000/api/preferences"
    
    # First, we need to get a token from frontend login
    login_url = "http://localhost:3000/api/auth/login"
    login_data = {
        "username": "testuser_new",
        "password": "123456"
    }
    
    try:
        print("1. Testing frontend login...")
        login_response = requests.post(login_url, json=login_data)
        
        print(f"Login Status Code: {login_response.status_code}")
        print(f"Login Response: {login_response.text}")
        
        if login_response.status_code != 200:
            print("❌ Frontend login failed!")
            return False
            
        login_result = login_response.json()
        token = login_result.get("access_token")
        
        if not token:
            print("❌ No token received from frontend login!")
            return False
            
        print("✅ Frontend login successful!")
        
        # Test preferences with frontend
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
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
        
        print("\n2. Testing frontend preferences save...")
        save_response = requests.post(frontend_url, json=preferences_data, headers=headers)
        
        print(f"Save Status Code: {save_response.status_code}")
        print(f"Save Response: {save_response.text}")
        
        if save_response.status_code == 200:
            print("✅ Frontend preferences saved successfully!")
            return True
        else:
            print("❌ Frontend preferences save failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing Frontend Preferences API")
    print("=" * 50)
    test_frontend_preferences()
