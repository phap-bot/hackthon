#!/usr/bin/env python3
"""
Integrated Authentication Tests
Tích hợp tất cả test liên quan đến authentication
"""
import requests
import json
import sys
import os

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class AuthTestSuite:
    """Test suite cho authentication system"""
    
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.test_user = {
            'username': 'test_auth_user',
            'email': 'test_auth@example.com',
            'password': '123456',
            'full_name': 'Test Auth User'
        }
        self.token = None
    
    def test_register_flow(self):
        """Test complete registration flow"""
        print("🔍 Testing Registration Flow")
        print("-" * 40)
        
        try:
            # Register new user
            response = requests.post(
                f"{self.base_url}/api/auth/register",
                json=self.test_user
            )
            
            if response.status_code == 201:
                print("✅ Registration successful")
                data = response.json()
                self.token = data.get('access_token')
                return True
            else:
                print(f"❌ Registration failed: {response.status_code}")
                print(response.text)
                return False
                
        except Exception as e:
            print(f"❌ Registration error: {str(e)}")
            return False
    
    def test_login_flow(self):
        """Test login flow"""
        print("\n🔍 Testing Login Flow")
        print("-" * 40)
        
        try:
            login_data = {
                'username': self.test_user['username'],
                'password': self.test_user['password']
            }
            
            response = requests.post(
                f"{self.base_url}/api/auth/login",
                json=login_data
            )
            
            if response.status_code == 200:
                print("✅ Login successful")
                data = response.json()
                self.token = data.get('access_token')
                return True
            else:
                print(f"❌ Login failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Login error: {str(e)}")
            return False
    
    def test_me_endpoint(self):
        """Test /me endpoint"""
        print("\n🔍 Testing /me Endpoint")
        print("-" * 40)
        
        if not self.token:
            print("❌ No token available")
            return False
            
        try:
            headers = {'Authorization': f'Bearer {self.token}'}
            response = requests.get(
                f"{self.base_url}/api/auth/me",
                headers=headers
            )
            
            if response.status_code == 200:
                print("✅ /me endpoint successful")
                user_data = response.json()
                print(f"   User: {user_data.get('username')}")
                return True
            else:
                print(f"❌ /me endpoint failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ /me endpoint error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all authentication tests"""
        print("🚀 Running Authentication Test Suite")
        print("=" * 60)
        
        tests = [
            self.test_register_flow,
            self.test_login_flow,
            self.test_me_endpoint
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        print(f"\n📊 Test Results: {passed}/{total} passed")
        
        if passed == total:
            print("🎉 All authentication tests passed!")
        else:
            print("⚠️ Some tests failed")
        
        return passed == total

def main():
    """Main test runner"""
    test_suite = AuthTestSuite()
    success = test_suite.run_all_tests()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
