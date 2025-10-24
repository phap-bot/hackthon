#!/usr/bin/env python3
"""
Test login with different users
"""
import requests
import json

def test_login():
    # Test login with different users
    users = [
        {'username': 'testuser2', 'password': '123456'},
        {'username': 'testuser3', 'password': '123456'},
        {'username': 'phap', 'password': '123456'},
        {'username': 'nltp12', 'password': '123456'}
    ]

    for user in users:
        try:
            response = requests.post('http://localhost:8000/api/auth/login', json=user)
            print(f'User: {user["username"]} - Status: {response.status_code}')
            if response.status_code == 200:
                print(f'✅ Login successful for {user["username"]}')
                return user["username"]
            else:
                print(f'❌ Login failed: {response.text}')
        except Exception as e:
            print(f'❌ Error: {e}')
        print()
    
    return None

if __name__ == "__main__":
    test_login()
