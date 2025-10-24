#!/usr/bin/env python3
"""
Create and test new user
"""
import requests
import json

def create_and_test_user():
    # Register a new test user
    register_data = {
        'username': 'testprefs',
        'email': 'testprefs@example.com',
        'password': '123456',
        'full_name': 'Test Preferences User'
    }

    try:
        response = requests.post('http://localhost:8000/api/auth/register', json=register_data)
        print(f'Register Status: {response.status_code}')
        if response.status_code == 200:
            print('✅ User registered successfully')
            
            # Try to login
            login_data = {
                'username': 'testprefs',
                'password': '123456'
            }
            
            login_response = requests.post('http://localhost:8000/api/auth/login', json=login_data)
            print(f'Login Status: {login_response.status_code}')
            if login_response.status_code == 200:
                print('✅ Login successful')
                token_data = login_response.json()
                token = token_data['access_token']
                print(f'Token: {token[:50]}...')
                
                # Test preferences submission
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
                
                pref_response = requests.post(
                    'http://localhost:8000/api/survey/submit',
                    json=preferences_data,
                    headers=headers
                )
                
                print(f'Preferences Status: {pref_response.status_code}')
                if pref_response.status_code == 200:
                    print('✅ Preferences submitted successfully')
                    result = pref_response.json()
                    print(f'Survey ID: {result.get("survey_id", "N/A")}')
                else:
                    print(f'❌ Preferences failed: {pref_response.text}')
                    
            else:
                print(f'❌ Login failed: {login_response.text}')
        else:
            print(f'❌ Registration failed: {response.text}')
    except Exception as e:
        print(f'❌ Error: {e}')

if __name__ == "__main__":
    create_and_test_user()
