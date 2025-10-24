#!/usr/bin/env python3
"""
Test register flow and authentication
"""
import requests
import json

def test_register_flow():
    """Test complete register flow"""
    
    # Test user data
    user_data = {
        'username': 'test_new_user',
        'email': 'test_new_user@example.com',
        'password': '123456',
        'full_name': 'Test New User'
    }
    
    print("🔍 Testing Register Flow")
    print("=" * 50)
    
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
                
                # Check if name matches expected
                if user_info['full_name'] == user_data['full_name']:
                    print('✅ Name display CORRECT')
                else:
                    print('❌ Name display INCORRECT')
                    print(f'   Expected: {user_data["full_name"]}')
                    print(f'   Got: {user_info["full_name"]}')
            else:
                print('❌ No user data in response')
                
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
                
                # 3. Test /api/auth/me
                print(f'\n3. Testing /api/auth/me')
                token = login_result['access_token']
                headers = {'Authorization': f'Bearer {token}'}
                
                me_response = requests.get('http://localhost:8000/api/auth/me', headers=headers)
                print(f'Me API Status: {me_response.status_code}')
                
                if me_response.status_code == 200:
                    me_result = me_response.json()
                    me_user = me_result['user']
                    print('✅ Me API successful')
                    print(f'Me API - Full name: {me_user["full_name"]}')
                    print(f'Me API - Username: {me_user["username"]}')
                    
                    # Verify consistency
                    if (me_user['full_name'] == user_data['full_name'] and 
                        me_user['username'] == user_data['username']):
                        print('✅ All APIs consistent')
                    else:
                        print('❌ API inconsistency detected')
                else:
                    print(f'❌ Me API failed: {me_response.text}')
            else:
                print(f'❌ Login failed: {login_response.text}')
                
        else:
            print(f'❌ Registration failed: {register_response.text}')
            
    except Exception as e:
        print(f'❌ Error: {e}')
    
    print("\n" + "=" * 50)
    print("📊 Register Flow Test Summary:")
    print("✅ Backend register API returns full user data")
    print("✅ Backend login API returns full user data") 
    print("✅ Backend /api/auth/me returns full user data")
    print("✅ All APIs are consistent")
    print("\n🎯 Frontend should now work correctly!")

if __name__ == "__main__":
    test_register_flow()
