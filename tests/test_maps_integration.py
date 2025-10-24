#!/usr/bin/env python3
"""
Integrated Maps & Travel Planner Tests
Tích hợp test cho maps và travel planner functionality
"""
import requests
import json
import sys
import os

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class MapsTestSuite:
    """Test suite cho maps và travel planner"""
    
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.token = None
        self.test_user = {
            'username': 'test_maps_user',
            'email': 'test_maps@example.com',
            'password': '123456',
            'full_name': 'Test Maps User'
        }
    
    def setup_auth(self):
        """Setup authentication for tests"""
        try:
            # Try to login first
            login_data = {
                'username': self.test_user['username'],
                'password': self.test_user['password']
            }
            
            response = requests.post(
                f"{self.base_url}/api/auth/login",
                json=login_data
            )
            
            if response.status_code == 200:
                self.token = response.json().get('access_token')
                return True
            else:
                # If login fails, register new user
                response = requests.post(
                    f"{self.base_url}/api/auth/register",
                    json=self.test_user
                )
                
                if response.status_code == 201:
                    self.token = response.json().get('access_token')
                    return True
                    
        except Exception as e:
            print(f"❌ Auth setup error: {str(e)}")
            
        return False
    
    def test_maps_attractions(self):
        """Test maps attractions endpoint"""
        print("🔍 Testing Maps Attractions")
        print("-" * 40)
        
        try:
            params = {
                'location': 'Ho Chi Minh City',
                'radius': 5000
            }
            
            response = requests.get(
                f"{self.base_url}/api/maps/attractions",
                params=params
            )
            
            if response.status_code == 200:
                attractions = response.json()
                print("✅ Attractions retrieved successfully")
                print(f"   Found {len(attractions)} attractions")
                return True
            else:
                print(f"❌ Attractions failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Attractions error: {str(e)}")
            return False
    
    def test_maps_restaurants(self):
        """Test maps restaurants endpoint"""
        print("\n🔍 Testing Maps Restaurants")
        print("-" * 40)
        
        try:
            params = {
                'location': 'Ho Chi Minh City',
                'radius': 3000
            }
            
            response = requests.get(
                f"{self.base_url}/api/maps/restaurants",
                params=params
            )
            
            if response.status_code == 200:
                restaurants = response.json()
                print("✅ Restaurants retrieved successfully")
                print(f"   Found {len(restaurants)} restaurants")
                return True
            else:
                print(f"❌ Restaurants failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Restaurants error: {str(e)}")
            return False
    
    def test_maps_hotels(self):
        """Test maps hotels endpoint"""
        print("\n🔍 Testing Maps Hotels")
        print("-" * 40)
        
        try:
            params = {
                'location': 'Ho Chi Minh City',
                'radius': 5000
            }
            
            response = requests.get(
                f"{self.base_url}/api/maps/hotels",
                params=params
            )
            
            if response.status_code == 200:
                hotels = response.json()
                print("✅ Hotels retrieved successfully")
                print(f"   Found {len(hotels)} hotels")
                return True
            else:
                print(f"❌ Hotels failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Hotels error: {str(e)}")
            return False
    
    def test_travel_planner(self):
        """Test travel planner endpoint"""
        print("\n🔍 Testing Travel Planner")
        print("-" * 40)
        
        if not self.token:
            print("❌ No authentication token")
            return False
            
        try:
            planner_data = {
                "destination": "Ho Chi Minh City",
                "duration": 7,
                "budget": 1000,
                "interests": ["culture", "food", "history"],
                "accommodation_type": "hotel"
            }
            
            headers = {'Authorization': f'Bearer {self.token}'}
            response = requests.post(
                f"{self.base_url}/api/travel-planner",
                json=planner_data,
                headers=headers
            )
            
            if response.status_code == 200:
                itinerary = response.json()
                print("✅ Travel planner successful")
                print(f"   Generated itinerary with {len(itinerary)} items")
                return True
            else:
                print(f"❌ Travel planner failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Travel planner error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all maps and travel planner tests"""
        print("🚀 Running Maps & Travel Planner Test Suite")
        print("=" * 60)
        
        # Setup authentication first
        if not self.setup_auth():
            print("❌ Authentication setup failed")
            return False
        
        tests = [
            self.test_maps_attractions,
            self.test_maps_restaurants,
            self.test_maps_hotels,
            self.test_travel_planner
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        print(f"\n📊 Test Results: {passed}/{total} passed")
        
        if passed == total:
            print("🎉 All maps tests passed!")
        else:
            print("⚠️ Some tests failed")
        
        return passed == total

def main():
    """Main test runner"""
    test_suite = MapsTestSuite()
    success = test_suite.run_all_tests()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
