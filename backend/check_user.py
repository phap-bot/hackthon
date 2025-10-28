#!/usr/bin/env python3

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

async def check_user():
    # Connect to MongoDB
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.travel_explorer
    
    print("Checking users in database...")
    
    # List all users
    users = await db.users.find({}).to_list(length=None)
    print(f"Found {len(users)} users:")
    
    for user in users:
        print(f"\nUser: {user.get('username', 'N/A')}")
        print(f"   Email: {user.get('email', 'N/A')}")
        print(f"   Full Name: {user.get('full_name', 'N/A')}")
        print(f"   Active: {user.get('is_active', True)}")
        print(f"   Created: {user.get('created_at', 'N/A')}")
    
    # Check specific user
    print("\nChecking for nltp12@gmail.com...")
    user = await db.users.find_one({"email": "nltp12@gmail.com"})
    
    if user:
        print("User found!")
        print(f"   Username: {user.get('username')}")
        print(f"   Email: {user.get('email')}")
        print(f"   Has Password: {'hashed_password' in user}")
        print(f"   Active: {user.get('is_active', True)}")
        
        # Test password
        if 'hashed_password' in user:
            test_password = "phap1201"
            is_valid = pwd_context.verify(test_password, user['hashed_password'])
            print(f"   Password 'phap1201' valid: {is_valid}")
    else:
        print("User not found!")
        print("Creating test user...")
        
        # Create test user
        hashed_password = pwd_context.hash("phap1201")
        user_doc = {
            "username": "nltp12",
            "email": "nltp12@gmail.com",
            "full_name": "Test User",
            "hashed_password": hashed_password,
            "is_active": True,
            "created_at": "2025-01-26T00:00:00Z",
            "updated_at": "2025-01-26T00:00:00Z"
        }
        
        result = await db.users.insert_one(user_doc)
        print(f"Test user created with ID: {result.inserted_id}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_user())
