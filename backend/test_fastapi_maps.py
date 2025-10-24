import requests
import json

def test_fastapi_maps():
    """Test FastAPI maps endpoint"""
    
    print("Testing FastAPI Maps Endpoint")
    print("=" * 50)
    
    # Step 1: Login to get token
    print("1. Getting authentication token...")
    login_url = "http://localhost:8000/api/auth/login"
    login_data = {
        "username": "testuser_new",
        "password": "123456"
    }
    
    try:
        login_response = requests.post(login_url, json=login_data)
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.text}")
            return False
            
        token = login_response.json()["access_token"]
        print("✅ Login successful!")
        
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False
    
    # Step 2: Test coffee API endpoint
    print("\n2. Testing coffee API endpoint...")
    try:
        url = "http://localhost:8000/api/maps/coffee"
        params = {
            "lat": 10.8231,  # Ho Chi Minh City
            "lng": 106.6297,
            "min_rating": 4.0,
            "radius": 5000,
            "limit": 5
        }
        
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        print(f"URL: {url}")
        print(f"Params: {params}")
        print(f"Headers: {headers}")
        
        response = requests.get(url, headers=headers, params=params)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:500]}...")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Found {len(data)} coffee shops")
            if data:
                for i, place in enumerate(data[:2], 1):
                    print(f"   {i}. {place.get('name', 'N/A')} - {place.get('rating', 'N/A')} stars")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_fastapi_maps()
