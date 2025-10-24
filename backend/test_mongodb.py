#!/usr/bin/env python3
"""
Test script for MongoDB connection and basic functionality
Run this script to verify your MongoDB setup is working correctly
"""

import asyncio
import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import init_db, get_database

async def test_mongodb_connection():
    """Test MongoDB connection and basic operations"""
    print("🔍 Testing MongoDB Connection...")
    print("=" * 50)
    
    try:
        # Load environment variables
        load_dotenv()
        
        # Initialize database
        await init_db()
        print("✅ Database connection successful!")
        
        # Get database instance
        db = get_database()
        print(f"✅ Database name: {db.name}")
        
        # Test basic operations
        print("\n🧪 Testing basic operations...")
        
        # Test users collection
        users_count = await db.users.count_documents({})
        print(f"✅ Users collection: {users_count} documents")
        
        # Test trips collection
        trips_count = await db.trips.count_documents({})
        print(f"✅ Trips collection: {trips_count} documents")
        
        # Test activities collection
        activities_count = await db.activities.count_documents({})
        print(f"✅ Activities collection: {activities_count} documents")
        
        # Test feedback collection
        feedback_count = await db.feedback.count_documents({})
        print(f"✅ Feedback collection: {feedback_count} documents")
        
        # Test thuthap_khaosat collection (existing survey data)
        survey_count = await db.thuthap_khaosat.count_documents({})
        print(f"✅ Survey collection (thuthap_khaosat): {survey_count} documents")
        
        # Test user_preferences collection (new survey system)
        preferences_count = await db.user_preferences.count_documents({})
        print(f"✅ User preferences collection: {preferences_count} documents")
        
        print("\n🎉 All tests passed! MongoDB is ready to use.")
        print("\n📋 Next steps:")
        print("1. Make sure your MongoDB Compass is running")
        print("2. Start the backend server: python start_local.py")
        print("3. Visit http://localhost:8000/docs for API documentation")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure MongoDB is running on localhost:27017")
        print("2. Check if MongoDB Compass is connected")
        print("3. Verify your .env file configuration")
        print("4. Make sure all required packages are installed")
        return False

async def test_survey_functionality():
    """Test survey functionality"""
    print("\n📊 Testing Survey Functionality...")
    print("=" * 50)
    
    try:
        db = get_database()
        
        # Test survey data insertion
        test_survey = {
            "user_id": "test_user_123",
            "preferences": {
                "travel_type": "khám_phá",
                "dream_destination": "thành_phố",
                "activities": ["ẩm_thực", "mua_sắm"],
                "budget_range": "trung_bình",
                "travel_style": "thoải_mái"
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert test survey
        result = await db.user_preferences.insert_one(test_survey)
        print(f"✅ Test survey inserted: {result.inserted_id}")
        
        # Retrieve test survey
        retrieved = await db.user_preferences.find_one({"_id": result.inserted_id})
        if retrieved:
            print("✅ Test survey retrieved successfully")
            print(f"   Travel type: {retrieved['preferences']['travel_type']}")
            print(f"   Destination: {retrieved['preferences']['dream_destination']}")
            print(f"   Activities: {retrieved['preferences']['activities']}")
        
        # Clean up test data
        await db.user_preferences.delete_one({"_id": result.inserted_id})
        print("✅ Test data cleaned up")
        
        return True
        
    except Exception as e:
        print(f"❌ Survey test error: {e}")
        return False

async def main():
    """Main test function"""
    print("🚀 AI Travel Planner - MongoDB Test Script")
    print("=" * 50)
    
    # Test MongoDB connection
    connection_ok = await test_mongodb_connection()
    
    if connection_ok:
        # Test survey functionality
        survey_ok = await test_survey_functionality()
        
        if survey_ok:
            print("\n🎊 All tests completed successfully!")
            print("Your backend is ready to integrate with the frontend survey!")
        else:
            print("\n⚠️  Survey functionality needs attention")
    else:
        print("\n💥 MongoDB connection failed. Please fix the issues above.")

if __name__ == "__main__":
    asyncio.run(main())
