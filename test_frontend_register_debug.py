#!/usr/bin/env python3
"""
Test frontend register flow
"""
import requests
import json

def test_frontend_register():
    """Test frontend register API"""
    
    print("🔍 Testing Frontend Register API")
    print("=" * 50)
    
    # Test user data
    user_data = {
        'username': 'frontend_test_user',
        'email': 'frontend_test@example.com',
        'password': '123456',
        'full_name': 'Frontend Test User'
    }
    
    try:
        # Test frontend register API
        print(f"\n1. Testing frontend /api/auth/register")
        print(f"User: {user_data['full_name']}")
        
        response = requests.post('http://localhost:3000/api/auth/register', json=user_data)
        
        print(f'Frontend Register Status: {response.status_code}')
        
        if response.status_code == 200:
            result = response.json()
            print('✅ Frontend registration successful')
            print(f'Response structure: {list(result.keys())}')
            
            if 'user' in result:
                user_info = result['user']
                print(f'User data: {list(user_info.keys())}')
                print(f'Full name: {user_info["full_name"]}')
                print(f'Username: {user_info["username"]}')
                print(f'Email: {user_info["email"]}')
                
                # Check if name matches expected
                if user_info['full_name'] == user_data['full_name']:
                    print('✅ Frontend name display CORRECT')
                else:
                    print('❌ Frontend name display INCORRECT')
                    print(f'   Expected: {user_data["full_name"]}')
                    print(f'   Got: {user_info["full_name"]}')
                    
                # Test frontend /api/auth/me
                print(f'\n2. Testing frontend /api/auth/me')
                token = result['access_token']
                headers = {'Authorization': f'Bearer {token}'}
                
                me_response = requests.get('http://localhost:3000/api/auth/me', headers=headers)
                print(f'Frontend Me API Status: {me_response.status_code}')
                
                if me_response.status_code == 200:
                    me_result = me_response.json()
                    me_user = me_result['user']
                    print('✅ Frontend Me API successful')
                    print(f'Me API - Full name: {me_user["full_name"]}')
                    print(f'Me API - Username: {me_user["username"]}')
                    
                    # Check consistency
                    if (me_user['full_name'] == user_info['full_name'] and 
                        me_user['username'] == user_info['username']):
                        print('✅ Frontend APIs consistent')
                    else:
                        print('❌ Frontend APIs inconsistent')
                else:
                    print(f'❌ Frontend Me API failed: {me_response.text}')
                    
            else:
                print('❌ No user data in frontend response')
                print(f'Response: {result}')
                
        else:
            print(f'❌ Frontend registration failed: {response.status_code}')
            print(f'Error: {response.text}')
            
    except Exception as e:
        print(f'❌ Error: {e}')
    
    print("\n" + "=" * 50)
    print("📊 Frontend Register Test Summary:")
    print("✅ Frontend register API should work")
    print("✅ Frontend should return full user data")
    print("✅ Frontend Me API should work")
    print("✅ All frontend APIs should be consistent")

if __name__ == "__main__":
    test_frontend_register()
