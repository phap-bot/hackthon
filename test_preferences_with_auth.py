import requests
import json

def test_preferences_with_auth():
    """Test preferences with authentication"""
    
    # First login to get token
    login_url = "http://localhost:8000/api/auth/login"
    login_data = {
        "username": "testuser_new",
        "password": "123456"
    }
    
    try:
        print("1. Logging in...")
        login_response = requests.post(login_url, json=login_data)
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.text}")
            return False
            
        login_result = login_response.json()
        token = login_result["access_token"]
        print("✅ Login successful!")
        
        # Test preferences with token
        preferences_url = "http://localhost:8000/api/preferences"
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
        
        print("\n2. Testing preferences save...")
        save_response = requests.post(preferences_url, json=preferences_data, headers=headers)
        
        print(f"Status Code: {save_response.status_code}")
        print(f"Response: {save_response.text}")
        
        if save_response.status_code == 200:
            print("✅ Preferences saved successfully!")
            
            # Test get preferences
            print("\n3. Testing get preferences...")
            get_response = requests.get(preferences_url, headers=headers)
            
            print(f"Status Code: {get_response.status_code}")
            print(f"Response: {get_response.text}")
            
            if get_response.status_code == 200:
                print("✅ Preferences retrieved successfully!")
                return True
            else:
                print("❌ Get preferences failed!")
                return False
        else:
            print("❌ Save preferences failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing Preferences with Authentication")
    print("=" * 50)
    test_preferences_with_auth()
