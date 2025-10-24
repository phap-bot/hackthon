import requests
import json

def test_cors_preferences():
    """Test CORS with preferences on port 3003"""
    
    # Test OPTIONS request first
    print("1. Testing OPTIONS request...")
    try:
        options_response = requests.options(
            "http://localhost:8000/api/preferences",
            headers={
                "Origin": "http://localhost:3003",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type, Authorization"
            }
        )
        print(f"OPTIONS Status: {options_response.status_code}")
        print(f"OPTIONS Headers: {dict(options_response.headers)}")
        
        if options_response.status_code == 200:
            print("✅ OPTIONS request successful!")
        else:
            print("❌ OPTIONS request failed!")
            
    except Exception as e:
        print(f"❌ OPTIONS Error: {e}")
    
    # Test actual POST request
    print("\n2. Testing POST request...")
    try:
        # First login to get token
        login_response = requests.post(
            "http://localhost:8000/api/auth/login",
            json={
                "username": "testuser_new",
                "password": "123456"
            }
        )
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.text}")
            return False
            
        token = login_response.json()["access_token"]
        print("✅ Login successful!")
        
        # Test preferences POST
        post_response = requests.post(
            "http://localhost:8000/api/preferences",
            json={
                "travel_types": ["adventure", "culture"],
                "dream_destinations": ["beach", "mountains"],
                "activities": ["food", "trekking"],
                "budget_level": "medium",
                "trip_duration_preference": "medium",
                "group_size_preference": "couple",
                "accommodation_preference": "hotel",
                "transportation_preference": "flight"
            },
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}",
                "Origin": "http://localhost:3003"
            }
        )
        
        print(f"POST Status: {post_response.status_code}")
        print(f"POST Response: {post_response.text}")
        
        if post_response.status_code == 200:
            print("✅ POST request successful!")
            return True
        else:
            print("❌ POST request failed!")
            return False
            
    except Exception as e:
        print(f"❌ POST Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing CORS with Preferences")
    print("=" * 50)
    test_cors_preferences()
