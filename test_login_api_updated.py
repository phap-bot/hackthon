#!/usr/bin/env python3
"""
Test updated login API
"""
import requests
import json

def test_login_api():
    # Test login with different users
    users = [
        {'username': 'testprefs', 'password': '123456'},
        {'username': 'admin', 'password': '123456'},
        {'username': 'traveler01', 'password': '123456'}
    ]

    for user in users:
        print(f'\n🔍 Testing login for: {user["username"]}')
        try:
            response = requests.post('http://localhost:8000/api/auth/login', json=user)
            print(f'Status: {response.status_code}')
            
            if response.status_code == 200:
                result = response.json()
                print('✅ Login successful')
                print(f'Response structure: {list(result.keys())}')
                
                if 'user' in result:
                    user_data = result['user']
                    print(f'User data: {list(user_data.keys())}')
                    print(f'Full name: {user_data.get("full_name", "N/A")}')
                    print(f'Username: {user_data.get("username", "N/A")}')
                    print(f'Email: {user_data.get("email", "N/A")}')
                else:
                    print('❌ No user data in response')
                    
                # Test /api/auth/me with this token
                token = result['access_token']
                headers = {'Authorization': f'Bearer {token}'}
                
                me_response = requests.get('http://localhost:8000/api/auth/me', headers=headers)
                print(f'Me API Status: {me_response.status_code}')
                if me_response.status_code == 200:
                    me_result = me_response.json()
                    if 'user' in me_result:
                        me_user = me_result['user']
                        print(f'Me API - Full name: {me_user.get("full_name", "N/A")}')
                        print(f'Me API - Username: {me_user.get("username", "N/A")}')
                else:
                    print(f'❌ Me API failed: {me_response.text}')
                    
            else:
                print(f'❌ Login failed: {response.text}')
                
        except Exception as e:
            print(f'❌ Error: {e}')

if __name__ == "__main__":
    test_login_api()
