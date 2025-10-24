import requests
import json
import time

def test_frontend_preferences_fixed():
    """Test frontend preferences with correct port"""
    
    # Wait a bit for frontend to start
    print("Waiting for frontend to start...")
    time.sleep(5)
    
    # Try different ports
    ports = [3000, 3001, 3002, 3003, 3004]
    frontend_url = None
    
    for port in ports:
        try:
            response = requests.get(f"http://localhost:{port}", timeout=2)
            if response.status_code == 200:
                frontend_url = f"http://localhost:{port}"
                print(f"✅ Frontend found on port {port}")
                break
        except:
            continue
    
    if not frontend_url:
        print("❌ Frontend not found on any port")
        return False
    
    # Test frontend preferences endpoint
    preferences_url = f"{frontend_url}/api/preferences"
    
    try:
        print(f"\n1. Testing frontend preferences on {frontend_url}...")
        
        # Test with a simple request first
        test_response = requests.get(f"{frontend_url}/api/preferences")
        print(f"Test GET Status: {test_response.status_code}")
        
        # Test OPTIONS request
        options_response = requests.options(
            preferences_url,
            headers={
                "Origin": frontend_url,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type, Authorization"
            }
        )
        print(f"OPTIONS Status: {options_response.status_code}")
        
        if options_response.status_code == 200:
            print("✅ Frontend OPTIONS request successful!")
        else:
            print("❌ Frontend OPTIONS request failed!")
            
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing Frontend Preferences (Fixed)")
    print("=" * 50)
    test_frontend_preferences_fixed()
