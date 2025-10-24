#!/usr/bin/env python3
"""
Test secure register flow - no auto-login
"""
import requests
import json

def test_secure_register_flow():
    """Test secure register flow without auto-login"""
    
    print("🔐 Testing Secure Register Flow")
    print("=" * 50)
    
    # Test user data
    user_data = {
        'username': 'secure_test_user',
        'email': 'secure_test@example.com',
        'password': '123456',
        'full_name': 'Secure Test User'
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
            
            # Check response content
            print(f'Message: {result.get("message", "N/A")}')
            print(f'User ID: {result.get("user_id", "N/A")}')
            print(f'Email: {result.get("email", "N/A")}')
            print(f'Requires verification: {result.get("requires_email_verification", "N/A")}')
            
            # Check that NO access token is returned
            if 'access_token' in result:
                print('❌ SECURITY ISSUE: access_token should NOT be returned on registration')
            else:
                print('✅ SECURITY OK: No access_token returned on registration')
            
            # Check that NO user data is returned
            if 'user' in result:
                print('❌ SECURITY ISSUE: user data should NOT be returned on registration')
            else:
                print('✅ SECURITY OK: No user data returned on registration')
                
            # 2. Test login with registered user (should work)
            print(f'\n2. Testing login with registered user')
            login_data = {
                'username': user_data['username'],
                'password': user_data['password']
            }
            
            login_response = requests.post('http://localhost:8000/api/auth/login', json=login_data)
            print(f'Login Status: {login_response.status_code}')
            
            if login_response.status_code == 200:
                login_result = login_response.json()
                print('✅ Login successful')
                print(f'Login - Full name: {login_result["user"]["full_name"]}')
                print(f'Login - Username: {login_result["user"]["username"]}')
                
                # Check that login DOES return access token
                if 'access_token' in login_result:
                    print('✅ SECURITY OK: access_token returned on login')
                else:
                    print('❌ SECURITY ISSUE: access_token should be returned on login')
                    
            else:
                print(f'❌ Login failed: {login_response.text}')
                
        else:
            print(f'❌ Registration failed: {register_response.status_code}')
            print(f'Error: {register_response.text}')
            
    except Exception as e:
        print(f'❌ Error: {e}')
    
    print("\n" + "=" * 50)
    print("📊 Secure Register Flow Test Summary:")
    print("✅ Registration should NOT return access_token")
    print("✅ Registration should NOT return user data")
    print("✅ Registration should require email verification")
    print("✅ Login should work after registration")
    print("✅ Login should return access_token")
    print("\n🔐 Security Flow:")
    print("   1. Register → No auto-login")
    print("   2. Verify email → Required")
    print("   3. Login → Get access_token")
    print("   4. Access protected routes → With token")

if __name__ == "__main__":
    test_secure_register_flow()
