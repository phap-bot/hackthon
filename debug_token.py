import requests
import json
import base64

def debug_token():
    """Debug JWT token"""
    
    print("Debugging JWT Token")
    print("=" * 50)
    
    # Get token
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
        print(f"✅ Token: {token[:50]}...")
        
        # Decode JWT token (without verification)
        try:
            # Split token
            parts = token.split('.')
            if len(parts) != 3:
                print("❌ Invalid JWT format")
                return False
                
            # Decode payload (add padding if needed)
            payload = parts[1]
            # Add padding if needed
            payload += '=' * (4 - len(payload) % 4)
            
            decoded = base64.b64decode(payload)
            payload_data = json.loads(decoded)
            
            print(f"✅ Token payload: {payload_data}")
            
            user_id = payload_data.get("sub")
            username = payload_data.get("username")
            
            print(f"✅ User ID: {user_id}")
            print(f"✅ Username: {username}")
            
            return True
            
        except Exception as e:
            print(f"❌ Token decode error: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False

if __name__ == "__main__":
    debug_token()
