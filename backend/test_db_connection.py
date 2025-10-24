#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simple database connection test
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

async def test_db_connection():
    """Test database connection"""
    try:
        # MongoDB connection string
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        database_name = os.getenv("DATABASE_NAME", "hackthon")
        
        print(f"[INFO] Connecting to MongoDB: {mongodb_url}")
        print(f"[INFO] Database: {database_name}")
        
        # Create async client
        client = AsyncIOMotorClient(mongodb_url)
        db = client[database_name]
        
        # Test connection
        await client.admin.command('ping')
        print("[SUCCESS] MongoDB connection successful!")
        
        # List collections
        collections = await db.list_collection_names()
        print(f"[INFO] Collections: {collections}")
        
        # Test user_preferences collection
        if 'user_preferences' in collections:
            count = await db.user_preferences.count_documents({})
            print(f"[INFO] user_preferences documents: {count}")
        else:
            print("[WARNING] user_preferences collection does not exist")
        
        # Test users collection
        if 'users' in collections:
            count = await db.users.count_documents({})
            print(f"[INFO] users documents: {count}")
        else:
            print("[WARNING] users collection does not exist")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"[ERROR] MongoDB connection failed: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_db_connection())
    if success:
        print("\n[SUCCESS] Database test completed successfully!")
    else:
        print("\n[ERROR] Database test failed!")
