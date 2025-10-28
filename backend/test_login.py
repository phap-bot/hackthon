!/usr/bin/env python3
"""
Test script to check login API functionality
"""
import asyncio
import httpx
import json

async def test_login_api():
    """Test the login API endpoint"""
    base_url = "http://localhost:8000"
    
    # Test data
    test_user = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            print("🔍 Testing login API...")
            
            # Test login endpoint
            response = await client.post(
                f"{base_url}/api/auth/login",
                json=test_user,
                timeout=10.0
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Login successful!")
                print(f"Response: {json.dumps(data, indent=2)}")
            else:
                print("❌ Login failed!")
                try:
                    error_data = response.json()
                    print(f"Error: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"Error text: {response.text}")
                    
        except httpx.ConnectError:
            print("❌ Cannot connect to backend server!")
            print("Make sure the backend is running on http://localhost:8000")
        except Exception as e:
            print(f"❌ Error: {e}")

async def test_health_check():
    """Test if the backend is running"""
    base_url = "http://localhost:8000"
    
    async with httpx.AsyncClient() as client:
        try:
            print("🔍 Testing health check...")
            response = await client.get(f"{base_url}/health", timeout=5.0)
            print(f"Health check status: {response.status_code}")
            if response.status_code == 200:
                print("✅ Backend is running!")
                return True
            else:
                print("❌ Backend health check failed!")
                return False
        except Exception as e:
            print(f"❌ Backend is not running: {e}")
            return False

if __name__ == "__main__":
    print("🚀 Starting backend API tests...")
    asyncio.run(test_health_check())
    asyncio.run(test_login_api())
