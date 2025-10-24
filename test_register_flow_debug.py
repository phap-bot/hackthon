#!/usr/bin/env python3
"""
Test register flow to check if user data is returned correctly
"""
import requests
import json

def test_register_flow():
    """Test register flow step by step"""
    
    print("🔍 Testing Register Flow")
    print("=" * 50)
    
    # Test user data
    user_data = {
        'username': 'register_test_user',
        'email': 'register_test@example.com',
        'password': '123456',
        'full_name': 'Register Test User'
    }
    
    try:
        # 1. Register user
        print(f"\n1. Registering user: {user_data['full_name']}")
        register_response = requests.post('http://localhost:8000/api/auth/register', json=user_data)
        
        print(f'Register Status: {register_response.status_code}')
        
        if register_response.status_code == 200:
            result = register_response.json()
            print('✅ Registration successful')
            print(f'Response structure: {list(result.keys())}')
            
            if 'user' in result:
                user_info = result['user']
                print(f'User data: {list(user_info.keys())}')
                print(f'Full name: {user_info["full_name"]}')
                print(f'Username: {user_info["username"]}')
                print(f'Email: {user_info["email"]}')
                print(f'ID: {user_info["id"]}')
                
                # Check if all required fields are present
                required_fields = ['id', 'username', 'email', 'full_name', 'is_active']
                missing_fields = [field for field in required_fields if field not in user_info]
                
                if missing_fields:
                    print(f'❌ Missing fields: {missing_fields}')
                else:
                    print('✅ All required fields present')
                
                # Check if name matches expected
                if user_info['full_name'] == user_data['full_name']:
                    print('✅ Name display CORRECT')
                else:
                    print('❌ Name display INCORRECT')
                    print(f'   Expected: {user_data["full_name"]}')
                    print(f'   Got: {user_info["full_name"]}')
                    
                # 2. Test login with registered user
                print(f'\n2. Testing login with registered user')
                login_data = {
                    'username': user_data['username'],
                    'password': user_data['password']
                }
                
                login_response = requests.post('http://localhost:8000/api/auth/login', json=login_data)
                print(f'Login Status: {login_response.status_code}')
                
                if login_response.status_code == 200:
                    login_result = login_response.json()
                    login_user = login_result['user']
                    print('✅ Login successful')
                    print(f'Login - Full name: {login_user["full_name"]}')
                    print(f'Login - Username: {login_user["username"]}')
                    
                    # Check consistency between register and login
                    if (login_user['full_name'] == user_info['full_name'] and 
                        login_user['username'] == user_info['username']):
                        print('✅ Register and Login data consistent')
                    else:
                        print('❌ Register and Login data inconsistent')
                        
                else:
                    print(f'❌ Login failed: {login_response.text}')
                    
            else:
                print('❌ No user data in response')
                print(f'Response: {result}')
                
        else:
            print(f'❌ Registration failed: {register_response.status_code}')
            print(f'Error: {register_response.text}')
            
    except Exception as e:
        print(f'❌ Error: {e}')
    
    print("\n" + "=" * 50)
    print("📊 Register Flow Test Summary:")
    print("✅ Backend register API should return full user data")
    print("✅ Frontend should auto-login after registration")
    print("✅ User should be redirected to dashboard")
    print("✅ Dashboard should display correct user name")

if __name__ == "__main__":
    test_register_flow()
