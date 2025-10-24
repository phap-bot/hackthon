import requests
import json

def test_simple_maps_request():
    """Test simple maps request"""
    
    print("Testing Simple Maps Request")
    print("=" * 40)
    
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
    
    # Step 2: Test simple coffee API request
    print("\n2. Testing simple coffee API request...")
    try:
        url = "http://localhost:8000/api/maps/coffee"
        
        # Simple parameters - just lat, lng, no complex options
        params = {
            "lat": 10.8231,  # Ho Chi Minh City
            "lng": 106.6297,
            "limit": 3  # Just get 3 results
        }
        
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        print(f"URL: {url}")
        print(f"Params: {params}")
        
        response = requests.get(url, headers=headers, params=params)
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Found {len(data)} coffee shops:")
            for i, place in enumerate(data, 1):
                print(f"   {i}. {place.get('name', 'N/A')} - {place.get('rating', 'N/A')} stars")
                print(f"      Address: {place.get('address', 'N/A')}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_simple_maps_request()
