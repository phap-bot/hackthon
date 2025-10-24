#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Unified Test Suite for AI Travel Planner Backend
Tập hợp tất cả các test case trong một file duy nhất
"""
import requests
import json
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

class TravelPlannerTester:
    """Unified test class for all backend functionality"""
    
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.test_results = []
    
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if response_data:
            print(f"   Response: {response_data}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response": response_data
        })
    
    def test_database_connection(self):
        """Test MongoDB database connection"""
        print("\n🔍 Testing Database Connection...")
        try:
            mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
            database_name = os.getenv("DATABASE_NAME", "hackthon")
            
            client = AsyncIOMotorClient(mongodb_url)
            db = client[database_name]
            
            # Test connection
            asyncio.run(client.admin.command('ping'))
            
            # Check collections
            collections = asyncio.run(db.list_collection_names())
            
            client.close()
            
            self.log_test(
                "Database Connection", 
                True, 
                f"Connected to {database_name}, Collections: {len(collections)}"
            )
            return True
            
        except Exception as e:
            self.log_test("Database Connection", False, str(e))
            return False
    
    def test_api_health(self):
        """Test API health endpoint"""
        print("\n🏥 Testing API Health...")
        try:
            response = requests.get(f"{self.base_url}/health", timeout=5)
            if response.status_code == 200:
                self.log_test("API Health", True, "API is healthy")
                return True
            else:
                self.log_test("API Health", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("API Health", False, str(e))
            return False
    
    def test_preferences_public(self):
        """Test public preferences endpoint"""
        print("\n📝 Testing Public Preferences...")
        try:
            test_data = {
                "travel_types": ["adventure", "culture"],
                "activities": ["hiking", "photography"],
                "budget_level": "medium"
            }
            
            response = requests.post(
                f"{self.base_url}/api/preferences/public",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Public Preferences", True, "Preferences saved successfully")
                return True
            else:
                self.log_test("Public Preferences", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Public Preferences", False, str(e))
            return False
    
    def test_preferences_auth(self):
        """Test authenticated preferences endpoints"""
        print("\n🔐 Testing Authenticated Preferences...")
        user_id = "test_user_unified"
        
        try:
            # Test 1: Create preferences
            test_data = {
                "travel_types": ["adventure", "culture", "food"],
                "dream_destinations": ["Vietnam", "Japan", "Thailand"],
                "activities": ["hiking", "photography", "cooking"],
                "budget_level": "medium",
                "trip_duration_preference": "1-2 weeks",
                "group_size_preference": "2-4 people",
                "accommodation_preference": "hotel",
                "transportation_preference": "flight"
            }
            
            response = requests.post(
                f"{self.base_url}/api/preferences",
                json=test_data,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer dummy_token_{user_id}"
                },
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_test("Create Preferences", True, "Preferences created successfully")
            else:
                self.log_test("Create Preferences", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
            
            # Test 2: Get preferences
            response = requests.get(
                f"{self.base_url}/api/preferences",
                headers={"Authorization": f"Bearer dummy_token_{user_id}"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("preferences"):
                    self.log_test("Get Preferences", True, "Preferences retrieved successfully")
                else:
                    self.log_test("Get Preferences", False, "No preferences found")
                    return False
            else:
                self.log_test("Get Preferences", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
            
            # Test 3: Update preferences
            update_data = {
                "travel_types": ["adventure", "culture", "food", "nature"],
                "activities": ["hiking", "photography", "cooking", "diving"]
            }
            
            response = requests.put(
                f"{self.base_url}/api/preferences",
                json=update_data,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer dummy_token_{user_id}"
                },
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_test("Update Preferences", True, "Preferences updated successfully")
                return True
            else:
                self.log_test("Update Preferences", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Authenticated Preferences", False, str(e))
            return False
    
    def test_travel_planner(self):
        """Test travel planner functionality"""
        print("\n✈️ Testing Travel Planner...")
        try:
            # Test travel planner endpoint
            test_data = {
                "destination": "Hà Nội, Việt Nam",
                "start_date": "2024-02-01",
                "end_date": "2024-02-05",
                "people": 2,
                "budget": "medium",
                "travel_style": "cultural",
                "interests": ["历史", "美食", "文化"]
            }
            
            response = requests.post(
                f"{self.base_url}/api/travel-planner",
                json=test_data,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": "Bearer dummy_token_test_user"
                },
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Travel Planner", True, f"Trip created: {data.get('trip_id', 'N/A')}")
                return True
            else:
                self.log_test("Travel Planner", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Travel Planner", False, str(e))
            return False
    
    def test_maps_api(self):
        """Test maps API functionality"""
        print("\n🗺️ Testing Maps API...")
        try:
            # Test maps search
            response = requests.get(
                f"{self.base_url}/api/maps/search?query=Hồ Gươm, Hà Nội",
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_test("Maps Search", True, "Maps search working")
                return True
            else:
                self.log_test("Maps Search", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Maps API", False, str(e))
            return False
    
    def run_all_tests(self):
        """Run all tests and generate report"""
        print("🚀 Starting AI Travel Planner Backend Test Suite")
        print("=" * 60)
        
        # Run all tests
        tests = [
            self.test_database_connection,
            self.test_api_health,
            self.test_preferences_public,
            self.test_preferences_auth,
            self.test_travel_planner,
            self.test_maps_api
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test():
                    passed += 1
            except Exception as e:
                print(f"❌ Test {test.__name__} failed with exception: {e}")
        
        # Generate report
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if passed == total:
            print("\n🎉 All tests passed! Backend is working correctly.")
        else:
            print(f"\n⚠️  {total - passed} test(s) failed. Please check the issues above.")
        
        return passed == total

def main():
    """Main test runner"""
    tester = TravelPlannerTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())
