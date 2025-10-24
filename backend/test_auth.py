#!/usr/bin/env python3
"""
Test script for authentication functionality
Run this script to test user registration and login
"""

import asyncio
import os
import sys
import requests
import json
from datetime import datetime

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_auth_endpoints():
    """Test authentication endpoints"""
    print("🔐 Testing Authentication Endpoints...")
    print("=" * 50)
    
    base_url = "http://localhost:8000"
    
    # Test data
    test_user = {
        "username": "testuser_" + str(int(datetime.now().timestamp())),
        "email": f"test_{int(datetime.now().timestamp())}@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }
    
    try:
        # Test 1: Health check
        print("1. Testing health check...")
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
        
        # Test 2: User registration
        print("\n2. Testing user registration...")
        response = requests.post(
            f"{base_url}/api/auth/register",
            json=test_user,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ User registration successful")
            data = response.json()
            access_token = data.get("access_token")
            user_id = data.get("user_id")
            print(f"   User ID: {user_id}")
            print(f"   Token: {access_token[:20]}...")
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
        
        # Test 3: User login
        print("\n3. Testing user login...")
        login_data = {
            "email": test_user["email"],
            "password": test_user["password"]
        }
        
        response = requests.post(
            f"{base_url}/api/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ User login successful")
            data = response.json()
            login_token = data.get("access_token")
            print(f"   Login Token: {login_token[:20]}...")
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
        
        # Test 4: Get user info (protected endpoint)
        print("\n4. Testing protected endpoint...")
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"{base_url}/api/auth/me", headers=headers)
        
        if response.status_code == 200:
            print("✅ Protected endpoint access successful")
            data = response.json()
            user_info = data.get("user", {})
            print(f"   Username: {user_info.get('username')}")
            print(f"   Email: {user_info.get('email')}")
            print(f"   Full Name: {user_info.get('full_name')}")
        else:
            print(f"❌ Protected endpoint failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
        
        # Test 5: Survey options (public endpoint)
        print("\n5. Testing survey options endpoint...")
        response = requests.get(f"{base_url}/api/survey/options")
        
        if response.status_code == 200:
            print("✅ Survey options endpoint successful")
            data = response.json()
            options = data.get("options", {})
            print(f"   Travel types: {len(options.get('travel_types', []))}")
            print(f"   Destinations: {len(options.get('dream_destinations', []))}")
            print(f"   Activities: {len(options.get('activities', []))}")
        else:
            print(f"❌ Survey options failed: {response.status_code}")
            return False
        
        print("\n🎉 All authentication tests passed!")
        print("\n📋 Your backend is ready for frontend integration!")
        print("\n🔗 API Endpoints available:")
        print(f"   - API Docs: {base_url}/docs")
        print(f"   - Health Check: {base_url}/health")
        print(f"   - Auth Register: {base_url}/api/auth/register")
        print(f"   - Auth Login: {base_url}/api/auth/login")
        print(f"   - Survey Options: {base_url}/api/survey/options")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed. Make sure the backend server is running:")
        print("   Windows: start_local.bat")
        print("   Linux/Mac: ./start_local.sh")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 AI Travel Planner - Authentication Test Script")
    print("=" * 50)
    
    success = test_auth_endpoints()
    
    if success:
        print("\n🎊 Authentication system is working perfectly!")
        print("You can now integrate this with your frontend survey!")
    else:
        print("\n💥 Authentication tests failed. Please check the issues above.")

if __name__ == "__main__":
    main()
