#!/usr/bin/env python3
"""
Test frontend recommendations API
"""
import requests
import json

def test_frontend_recommendations():
    # First get a valid token
    login_data = {
        'username': 'testprefs',
        'password': '123456'
    }

    try:
        # Login to backend to get token
        login_response = requests.post('http://localhost:8000/api/auth/login', json=login_data)
        if login_response.status_code == 200:
            token_data = login_response.json()
            token = token_data['access_token']
            print('✅ Backend login successful')
            
            # Test frontend API route
            headers = {'Authorization': f'Bearer {token}'}
            
            print('\nTesting frontend API route...')
            frontend_response = requests.get(
                'http://localhost:3000/api/survey/recommendations',
                headers=headers
            )
            
            print(f'Frontend API Status: {frontend_response.status_code}')
            if frontend_response.status_code == 200:
                result = frontend_response.json()
                print('✅ Frontend API working')
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
                print(f'❌ Frontend API failed: {frontend_response.text}')
                
        else:
            print(f'❌ Backend login failed: {login_response.text}')
    except Exception as e:
        print(f'❌ Error: {e}')

if __name__ == "__main__":
    test_frontend_recommendations()
