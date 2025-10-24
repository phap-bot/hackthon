#!/usr/bin/env python3
"""
Test recommendations API
"""
import requests
import json

def test_recommendations():
    # Login with testprefs user
    login_data = {
        'username': 'testprefs',
        'password': '123456'
    }

    try:
        login_response = requests.post('http://localhost:8000/api/auth/login', json=login_data)
        if login_response.status_code == 200:
            token_data = login_response.json()
            token = token_data['access_token']
            print('✅ Login successful')
            
            # Test recommendations API
            headers = {'Authorization': f'Bearer {token}'}
            
            rec_response = requests.get(
                'http://localhost:8000/api/survey/recommendations',
                headers=headers
            )
            
            print(f'Recommendations Status: {rec_response.status_code}')
            if rec_response.status_code == 200:
                result = rec_response.json()
                print('✅ Recommendations retrieved successfully')
                print(f'Status: {result.get("status", "N/A")}')
                
                recommendations = result.get('recommendations', {})
                if recommendations:
                    destinations = recommendations.get('destination_suggestions', [])
                    print(f'Destinations: {len(destinations)} found')
                    for i, dest in enumerate(destinations[:3], 1):
                        print(f'  {i}. {dest.get("name", "N/A")} - {dest.get("country", "N/A")}')
                else:
                    print('❌ No recommendations data')
            else:
                print(f'❌ Recommendations failed: {rec_response.text}')
        else:
            print(f'❌ Login failed: {login_response.text}')
    except Exception as e:
        print(f'❌ Error: {e}')

if __name__ == "__main__":
    test_recommendations()
