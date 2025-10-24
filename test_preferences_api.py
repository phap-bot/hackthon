import requests
import json

def test_preferences_api():
    # First get a user_id from recent users
    user_id = "68f87c4c905bcbac446bfdec"  # namowi user
    
    preferences_data = {
        "user_id": user_id,
        "travel_types": ["exploration", "culture"],
        "dream_destinations": ["city", "mountains"],
        "activities": ["food", "photography"],
        "budget_level": "medium",
        "trip_duration_preference": "medium",
        "group_size_preference": "couple",
        "accommodation_preference": "hotel",
        "transportation_preference": "flight"
    }
    
    try:
        print("Testing preferences API...")
        response = requests.post("http://localhost:8001/api/preferences", json=preferences_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Preferences API successful!")
            return True
        else:
            print("❌ Preferences API failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_preferences_api()
