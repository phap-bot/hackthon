#!/usr/bin/env python3
"""
Create multiple test users with different names
"""
import requests
import json

def create_test_users():
    users = [
        {
            'username': 'user_an',
            'email': 'an@example.com',
            'password': '123456',
            'full_name': 'Nguyễn Văn An'
        },
        {
            'username': 'user_linh',
            'email': 'linh@example.com',
            'password': '123456',
            'full_name': 'Trần Thị Linh'
        },
        {
            'username': 'user_phap',
            'email': 'phap@example.com',
            'password': '123456',
            'full_name': 'Lê Tấn Pháp'
        },
        {
            'username': 'user_hoa',
            'email': 'hoa@example.com',
            'password': '123456',
            'full_name': 'Phạm Thị Hoa'
        }
    ]

    for user_data in users:
        print(f'\n🔍 Creating user: {user_data["full_name"]} ({user_data["username"]})')
        try:
            response = requests.post('http://localhost:8000/api/auth/register', json=user_data)
            print(f'Register Status: {response.status_code}')
            
            if response.status_code == 200:
                print('✅ User registered successfully')
                
                # Test login
                login_data = {
                    'username': user_data['username'],
                    'password': user_data['password']
                }
                
                login_response = requests.post('http://localhost:8000/api/auth/login', json=login_data)
                print(f'Login Status: {login_response.status_code}')
                
                if login_response.status_code == 200:
                    result = login_response.json()
                    user_info = result['user']
                    print(f'✅ Login successful')
                    print(f'   Full name: {user_info["full_name"]}')
                    print(f'   Username: {user_info["username"]}')
                    print(f'   Email: {user_info["email"]}')
                else:
                    print(f'❌ Login failed: {login_response.text}')
                    
            else:
                print(f'❌ Registration failed: {response.text}')
                
        except Exception as e:
            print(f'❌ Error: {e}')

if __name__ == "__main__":
    create_test_users()
