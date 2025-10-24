#!/usr/bin/env python3
"""
Test frontend preferences submission
"""
import requests
import json

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def test_frontend_preferences():
    """Test frontend preferences submission"""
    print("🔍 Testing Frontend Preferences Submission...")
    
    # Step 1: Login to get token
    print("\n1. Logging in...")
    login_data = {
        "username": "testuser2",
        "password": "123456"
    }
    
    try:
        login_response = requests.post(f"{BACKEND_URL}/api/auth/login", json=login_data)
        if login_response.status_code == 200:
            token_data = login_response.json()
            token = token_data["access_token"]
            print("✅ Login successful")
        else:
            print(f"❌ Login failed: {login_response.status_code}")
            return
    except Exception as e:
        print(f"❌ Login failed: {e}")
        return
    
    # Step 2: Submit preferences via frontend API
    print("\n2. Submitting preferences via frontend API...")
    preferences_data = {
        "travel_type": "khám_phá",
        "dream_destination": "bãi_biển", 
        "activities": ["ẩm_thực", "lặn_biển", "chụp_ảnh"],
        "budget_range": "trung_bình",
        "travel_style": "thoải_mái",
        "accommodation_type": "resort",
        "group_size": 2,
        "duration_preference": "trung_hạn"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Test frontend API route
        frontend_response = requests.post(
            f"{FRONTEND_URL}/api/survey/submit",
            json=preferences_data,
            headers=headers
        )
        
        print(f"Frontend API Status: {frontend_response.status_code}")
        if frontend_response.status_code == 200:
            result = frontend_response.json()
            print("✅ Frontend API working")
            print(f"   Survey ID: {result.get('survey_id', 'N/A')}")
            print(f"   Message: {result.get('message', 'N/A')}")
        else:
            print(f"❌ Frontend API failed: {frontend_response.text}")
            
    except Exception as e:
        print(f"❌ Frontend API error: {e}")
    
    # Step 3: Test direct backend API
    print("\n3. Testing direct backend API...")
    try:
        backend_response = requests.post(
            f"{BACKEND_URL}/api/survey/submit",
            json=preferences_data,
            headers=headers
        )
        
        print(f"Backend API Status: {backend_response.status_code}")
        if backend_response.status_code == 200:
            result = backend_response.json()
            print("✅ Backend API working")
            print(f"   Survey ID: {result.get('survey_id', 'N/A')}")
            print(f"   Message: {result.get('message', 'N/A')}")
        else:
            print(f"❌ Backend API failed: {backend_response.text}")
            
    except Exception as e:
        print(f"❌ Backend API error: {e}")
    
    # Step 4: Check if preferences were saved
    print("\n4. Checking saved preferences...")
    try:
        check_response = requests.get(
            f"{BACKEND_URL}/api/survey/my-preferences",
            headers=headers
        )
        
        if check_response.status_code == 200:
            result = check_response.json()
            if result.get('preferences'):
                print("✅ Preferences found in database")
                prefs = result['preferences']['preferences']
                print(f"   Travel Type: {prefs.get('travel_type', 'N/A')}")
                print(f"   Dream Destination: {prefs.get('dream_destination', 'N/A')}")
                print(f"   Activities: {prefs.get('activities', [])}")
            else:
                print("❌ No preferences found")
        else:
            print(f"❌ Failed to check preferences: {check_response.text}")
            
    except Exception as e:
        print(f"❌ Check preferences error: {e}")

if __name__ == "__main__":
    test_frontend_preferences()
