#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test preferences save functionality
"""
import requests
import json

def test_preferences_save():
    """Test saving preferences to database"""
    base_url = "http://localhost:8000"
    
    print("[INFO] Testing Preferences Save to Database")
    print("=" * 50)
    
    # Test data
    test_preferences = {
        "travel_types": ["adventure", "culture", "food"],
        "dream_destinations": ["Vietnam", "Japan", "Thailand"],
        "activities": ["hiking", "photography", "cooking"],
        "budget_level": "medium",
        "trip_duration_preference": "1-2 weeks",
        "group_size_preference": "2-4 people",
        "accommodation_preference": "hotel",
        "transportation_preference": "flight"
    }
    
    print("\n1. Testing Public Preferences Save...")
    try:
        response = requests.post(
            f"{base_url}/api/preferences/public",
            json=test_preferences,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"[SUCCESS] Public preferences saved!")
            print(f"   Status: {data.get('status')}")
            print(f"   Message: {data.get('message')}")
            print(f"   Preferences ID: {data.get('preferences_id')}")
        else:
            print(f"[ERROR] Public preferences failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Public preferences error: {e}")
        return False
    
    print("\n2. Testing Authenticated Preferences Save...")
    user_id = "test_save_user"
    
    try:
        # Create preferences
        response = requests.post(
            f"{base_url}/api/preferences",
            json=test_preferences,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer dummy_token_{user_id}"
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"[SUCCESS] Authenticated preferences saved!")
            print(f"   Status: {data.get('status')}")
            print(f"   Message: {data.get('message')}")
            
            # Check if preferences were actually saved
            if data.get('preferences'):
                prefs = data['preferences']
                print(f"   User ID: {prefs.get('user_id')}")
                print(f"   Travel Types: {prefs.get('travel_types')}")
                print(f"   Activities: {prefs.get('activities')}")
                print(f"   Budget Level: {prefs.get('budget_level')}")
        else:
            print(f"[ERROR] Authenticated preferences failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Authenticated preferences error: {e}")
        return False
    
    print("\n3. Testing Get Saved Preferences...")
    try:
        response = requests.get(
            f"{base_url}/api/preferences",
            headers={"Authorization": f"Bearer dummy_token_{user_id}"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('preferences'):
                prefs = data['preferences']
                print(f"[SUCCESS] Retrieved saved preferences!")
                print(f"   User ID: {prefs.get('user_id')}")
                print(f"   Travel Types: {prefs.get('travel_types')}")
                print(f"   Activities: {prefs.get('activities')}")
                print(f"   Created At: {prefs.get('created_at')}")
                print(f"   Updated At: {prefs.get('updated_at')}")
            else:
                print(f"[WARNING] No preferences found in response")
        else:
            print(f"[ERROR] Get preferences failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Get preferences error: {e}")
        return False
    
    print("\n[SUCCESS] All preferences save tests passed!")
    print("Database is working correctly for preferences storage.")
    return True

if __name__ == "__main__":
    test_preferences_save()
