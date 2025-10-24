#!/usr/bin/env python3
"""
Integrated Preferences & Recommendations Tests
Tích hợp test cho preferences và recommendations system
"""
import requests
import json
import sys
import os

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class PreferencesTestSuite:
    """Test suite cho preferences và recommendations"""
    
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.token = None
        self.test_user = {
            'username': 'test_prefs_user',
            'email': 'test_prefs@example.com',
            'password': '123456',
            'full_name': 'Test Preferences User'
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
    
    def test_preferences_submission(self):
        """Test preferences submission"""
        print("🔍 Testing Preferences Submission")
        print("-" * 40)
        
        if not self.token:
            print("❌ No authentication token")
            return False
            
        try:
            preferences_data = {
                "travel_style": ["adventure", "cultural"],
                "budget_range": "medium",
                "accommodation_type": ["hotel", "hostel"],
                "transportation": ["flight", "train"],
                "interests": ["nature", "history", "food"],
                "destination_preferences": ["vietnam", "thailand", "japan"],
                "travel_duration": "7-14 days",
                "group_size": "solo",
                "season_preference": "spring"
            }
            
            headers = {'Authorization': f'Bearer {self.token}'}
            response = requests.post(
                f"{self.base_url}/api/preferences",
                json=preferences_data,
                headers=headers
            )
            
            if response.status_code == 200:
                print("✅ Preferences submitted successfully")
                return True
            else:
                print(f"❌ Preferences submission failed: {response.status_code}")
                print(response.text)
                return False
                
        except Exception as e:
            print(f"❌ Preferences submission error: {str(e)}")
            return False
    
    def test_recommendations_generation(self):
        """Test recommendations generation"""
        print("\n🔍 Testing Recommendations Generation")
        print("-" * 40)
        
        if not self.token:
            print("❌ No authentication token")
            return False
            
        try:
            headers = {'Authorization': f'Bearer {self.token}'}
            response = requests.get(
                f"{self.base_url}/api/survey/recommendations",
                headers=headers
            )
            
            if response.status_code == 200:
                recommendations = response.json()
                print("✅ Recommendations generated successfully")
                print(f"   Found {len(recommendations)} recommendations")
                return True
            else:
                print(f"❌ Recommendations generation failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Recommendations generation error: {str(e)}")
            return False
    
    def test_survey_options(self):
        """Test survey options endpoint"""
        print("\n🔍 Testing Survey Options")
        print("-" * 40)
        
        try:
            response = requests.get(f"{self.base_url}/api/survey/options")
            
            if response.status_code == 200:
                options = response.json()
                print("✅ Survey options retrieved successfully")
                print(f"   Available options: {list(options.keys())}")
                return True
            else:
                print(f"❌ Survey options failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Survey options error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all preferences and recommendations tests"""
        print("🚀 Running Preferences & Recommendations Test Suite")
        print("=" * 60)
        
        # Setup authentication first
        if not self.setup_auth():
            print("❌ Authentication setup failed")
            return False
        
        tests = [
            self.test_survey_options,
            self.test_preferences_submission,
            self.test_recommendations_generation
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        print(f"\n📊 Test Results: {passed}/{total} passed")
        
        if passed == total:
            print("🎉 All preferences tests passed!")
        else:
            print("⚠️ Some tests failed")
        
        return passed == total

def main():
    """Main test runner"""
    test_suite = PreferencesTestSuite()
    success = test_suite.run_all_tests()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
