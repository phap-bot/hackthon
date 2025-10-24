import requests
import json

def test_complete_flow():
    """Test complete flow: login -> preferences -> dashboard"""
    
    print("Testing Complete Flow")
    print("=" * 50)
    
    # Step 1: Login
    print("1. Testing login...")
    login_url = "http://localhost:8000/api/auth/login"
    login_data = {
        "username": "testuser_new",
        "password": "123456"
    }
    
    try:
        login_response = requests.post(login_url, json=login_data)
        print(f"Login Status: {login_response.status_code}")
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.text}")
            return False
            
        login_result = login_response.json()
        token = login_result["access_token"]
        print("✅ Login successful!")
        
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False
    
    # Step 2: Test preferences save
    print("\n2. Testing preferences save...")
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
    
    try:
        save_response = requests.post(
            preferences_url,
            json=preferences_data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            }
        )
        
        print(f"Save Status: {save_response.status_code}")
        print(f"Save Response: {save_response.text}")
        
        if save_response.status_code == 200:
            print("✅ Preferences saved successfully!")
        else:
            print("❌ Preferences save failed!")
            return False
            
    except Exception as e:
        print(f"❌ Save error: {e}")
        return False
    
    # Step 3: Test get preferences
    print("\n3. Testing get preferences...")
    try:
        get_response = requests.get(
            preferences_url,
            headers={
                "Authorization": f"Bearer {token}"
            }
        )
        
        print(f"Get Status: {get_response.status_code}")
        print(f"Get Response: {get_response.text}")
        
        if get_response.status_code == 200:
            print("✅ Preferences retrieved successfully!")
            return True
        else:
            print("❌ Get preferences failed!")
            return False
            
    except Exception as e:
        print(f"❌ Get error: {e}")
        return False

if __name__ == "__main__":
    test_complete_flow()
