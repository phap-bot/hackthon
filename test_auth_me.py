#!/usr/bin/env python3
"""
Test auth/me API to check user data format
"""
import requests
import json

def test_auth_me():
    # Login first
    login_data = {
        'username': 'testprefs',
        'password': '123456'
    }

    try:
        # Login to backend
        login_response = requests.post('http://localhost:8000/api/auth/login', json=login_data)
        if login_response.status_code == 200:
            token_data = login_response.json()
            token = token_data['access_token']
            print('✅ Backend login successful')
            
            # Test backend /api/auth/me
            headers = {'Authorization': f'Bearer {token}'}
            
            print('\n1. Testing backend /api/auth/me...')
            backend_response = requests.get(
                'http://localhost:8000/api/auth/me',
                headers=headers
            )
            
            print(f'Backend Status: {backend_response.status_code}')
            if backend_response.status_code == 200:
                result = backend_response.json()
                print('✅ Backend /api/auth/me working')
                print(f'Response structure: {list(result.keys())}')
                
                if 'user' in result:
                    user = result['user']
                    print(f'User data: {list(user.keys())}')
                    print(f'Full name: {user.get("full_name", "N/A")}')
                    print(f'Username: {user.get("username", "N/A")}')
                    print(f'Email: {user.get("email", "N/A")}')
                else:
                    print('❌ No user data in response')
            else:
                print(f'❌ Backend /api/auth/me failed: {backend_response.text}')
            
            # Test frontend /api/auth/me
            print('\n2. Testing frontend /api/auth/me...')
            frontend_response = requests.get(
                'http://localhost:3000/api/auth/me',
                headers=headers
            )
            
            print(f'Frontend Status: {frontend_response.status_code}')
            if frontend_response.status_code == 200:
                result = frontend_response.json()
                print('✅ Frontend /api/auth/me working')
                print(f'Response structure: {list(result.keys())}')
                
                if 'user' in result:
                    user = result['user']
                    print(f'User data: {list(user.keys())}')
                    print(f'Full name: {user.get("full_name", "N/A")}')
                    print(f'Username: {user.get("username", "N/A")}')
                    print(f'Email: {user.get("email", "N/A")}')
                else:
                    print('❌ No user data in response')
            else:
                print(f'❌ Frontend /api/auth/me failed: {frontend_response.text}')
                
        else:
            print(f'❌ Backend login failed: {login_response.text}')
    except Exception as e:
        print(f'❌ Error: {e}')

if __name__ == "__main__":
    test_auth_me()