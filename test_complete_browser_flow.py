import requests
import json

def test_complete_browser_flow():
    """Test complete browser flow"""
    
    print("Testing Complete Browser Flow")
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
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.text}")
            return False
            
        login_result = login_response.json()
        token = login_result["access_token"]
        print("✅ Login successful!")
        
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False
    
    # Step 2: Test frontend auth
    print("\n2. Testing frontend auth...")
    try:
        me_response = requests.get(
            "http://localhost:3000/api/auth/me",
            headers={
                "Authorization": f"Bearer {token}"
            }
        )
        
        if me_response.status_code == 200:
            print("✅ Frontend auth working!")
        else:
            print(f"❌ Frontend auth failed: {me_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Frontend auth error: {e}")
        return False
    
    # Step 3: Test preferences save
    print("\n3. Testing preferences save...")
    try:
        preferences_response = requests.post(
            "http://localhost:3000/api/preferences",
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
                "Authorization": f"Bearer {token}"
            }
        )
        
        print(f"Preferences Status: {preferences_response.status_code}")
        print(f"Preferences Response: {preferences_response.text}")
        
        if preferences_response.status_code == 200:
            print("✅ Preferences saved successfully!")
        else:
            print("❌ Preferences save failed!")
            return False
            
    except Exception as e:
        print(f"❌ Preferences error: {e}")
        return False
    
    # Step 4: Test dashboard access
    print("\n4. Testing dashboard access...")
    try:
        dashboard_response = requests.get(
            "http://localhost:3000/dashboard",
            headers={
                "Authorization": f"Bearer {token}"
            }
        )
        
        print(f"Dashboard Status: {dashboard_response.status_code}")
        
        if dashboard_response.status_code == 200:
            print("✅ Dashboard accessible!")
            return True
        else:
            print("❌ Dashboard not accessible!")
            return False
            
    except Exception as e:
        print(f"❌ Dashboard error: {e}")
        return False

if __name__ == "__main__":
    test_complete_browser_flow()
