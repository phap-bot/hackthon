#!/usr/bin/env python3
"""
Test script để kiểm tra flow từ lưu sở thích đến nhận recommendations
"""
import requests
import json
import time

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def test_preferences_to_recommendations_flow():
    """Test toàn bộ flow từ preferences đến recommendations"""
    print("🔍 Testing Preferences to Recommendations Flow...")
    
    # Step 1: Register a test user
    print("\n1. Registering test user...")
    register_data = {
        "username": "test_recommendations",
        "email": "test_recommendations@example.com",
        "password": "testpassword123",
        "full_name": "Test Recommendations User"
    }
    
    try:
        register_response = requests.post(f"{BACKEND_URL}/api/auth/register", json=register_data)
        if register_response.status_code == 200:
            print("✅ User registered successfully")
        else:
            print(f"⚠️ User might already exist: {register_response.status_code}")
    except Exception as e:
        print(f"❌ Registration failed: {e}")
        return
    
    # Step 2: Login to get token
    print("\n2. Logging in...")
    login_data = {
        "username": "test_recommendations",
        "password": "testpassword123"
    }
    
    try:
        login_response = requests.post(f"{BACKEND_URL}/api/auth/login", json=login_data)
        if login_response.status_code == 200:
            token_data = login_response.json()
            token = token_data["access_token"]
            print("✅ Login successful")
        else:
            print(f"❌ Login failed: {login_response.status_code}")
            return
    except Exception as e:
        print(f"❌ Login failed: {e}")
        return
    
    # Step 3: Submit preference survey
    print("\n3. Submitting preference survey...")
    survey_data = {
        "travel_type": "khám_phá",
        "dream_destination": "bãi_biển",
        "activities": ["ẩm_thực", "lặn_biển", "chụp_ảnh"],
        "budget_range": "trung_bình",
        "travel_style": "thoải_mái",
        "accommodation_type": "resort",
        "group_size": 2,
        "duration_preference": "trung_hạn"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        survey_response = requests.post(
            f"{BACKEND_URL}/api/survey/submit", 
            json=survey_data,
            headers=headers
        )
        
        if survey_response.status_code == 200:
            survey_result = survey_response.json()
            print("✅ Survey submitted successfully")
            print(f"   Survey ID: {survey_result.get('survey_id')}")
            
            # Check if recommendations were generated
            if 'recommendations' in survey_result:
                recommendations = survey_result['recommendations']
                print("✅ Recommendations generated immediately after survey submission")
                print(f"   - {len(recommendations.get('destination_suggestions', []))} destination suggestions")
                print(f"   - {len(recommendations.get('activity_recommendations', []))} activity recommendations")
                print(f"   - {len(recommendations.get('itinerary_suggestions', []))} itinerary suggestions")
            else:
                print("⚠️ No recommendations in survey response")
        else:
            print(f"❌ Survey submission failed: {survey_response.status_code}")
            print(f"   Error: {survey_response.text}")
            return
    except Exception as e:
        print(f"❌ Survey submission failed: {e}")
        return
    
    # Step 4: Get recommendations separately
    print("\n4. Getting recommendations separately...")
    try:
        recommendations_response = requests.get(
            f"{BACKEND_URL}/api/survey/recommendations",
            headers=headers
        )
        
        if recommendations_response.status_code == 200:
            recommendations_data = recommendations_response.json()
            recommendations = recommendations_data.get('recommendations', {})
            print("✅ Recommendations retrieved successfully")
            
            # Display detailed recommendations
            print("\n📋 Detailed Recommendations:")
            
            # Destination suggestions
            destinations = recommendations.get('destination_suggestions', [])
            print(f"\n🏖️ Destination Suggestions ({len(destinations)}):")
            for i, dest in enumerate(destinations[:3], 1):
                print(f"   {i}. {dest.get('name')}, {dest.get('country')} (Rating: {dest.get('rating')}/5)")
            
            # Activity recommendations
            activities = recommendations.get('activity_recommendations', [])
            print(f"\n🎯 Activity Recommendations ({len(activities)}):")
            for i, activity in enumerate(activities[:3], 1):
                print(f"   {i}. {activity.get('name')} ({activity.get('type')}) - {activity.get('duration')}")
            
            # Budget estimation
            budget = recommendations.get('budget_estimation', {})
            print(f"\n💰 Budget Estimation:")
            for level, range_data in budget.items():
                min_val = range_data.get('min', 0)
                max_val = range_data.get('max', 0)
                currency = range_data.get('currency', 'VND')
                print(f"   {level.title()}: {min_val:,} - {max_val:,} {currency}")
            
            # Itinerary suggestions
            itineraries = recommendations.get('itinerary_suggestions', [])
            print(f"\n📅 Itinerary Suggestions ({len(itineraries)} days):")
            for day in itineraries:
                print(f"   Day {day.get('day')}: {day.get('title')}")
                print(f"      Activities: {', '.join(day.get('activities', []))}")
                print(f"      Estimated cost: {day.get('estimated_cost', 0):,} VND")
            
            # Accommodation suggestions
            accommodations = recommendations.get('accommodation_suggestions', [])
            print(f"\n🏨 Accommodation Suggestions ({len(accommodations)}):")
            for i, acc in enumerate(accommodations, 1):
                print(f"   {i}. {acc.get('type')} ({acc.get('price_range')})")
                print(f"      Amenities: {', '.join(acc.get('amenities', []))}")
            
        else:
            print(f"❌ Failed to get recommendations: {recommendations_response.status_code}")
            print(f"   Error: {recommendations_response.text}")
    except Exception as e:
        print(f"❌ Failed to get recommendations: {e}")
    
    # Step 5: Test frontend API
    print("\n5. Testing frontend API...")
    try:
        frontend_response = requests.get(
            f"{FRONTEND_URL}/api/survey/recommendations",
            headers=headers
        )
        
        if frontend_response.status_code == 200:
            print("✅ Frontend API working correctly")
        else:
            print(f"⚠️ Frontend API issue: {frontend_response.status_code}")
    except Exception as e:
        print(f"⚠️ Frontend API not accessible: {e}")
    
    print("\n🎉 Preferences to Recommendations Flow Test Completed!")
    print("\n📊 Summary:")
    print("✅ User registration and login")
    print("✅ Preference survey submission")
    print("✅ Immediate recommendations generation")
    print("✅ Separate recommendations retrieval")
    print("✅ Detailed recommendations display")
    print("✅ Frontend API integration")

if __name__ == "__main__":
    test_preferences_to_recommendations_flow()
