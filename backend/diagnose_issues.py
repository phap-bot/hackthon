#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Diagnose common backend issues
"""
import requests
import json
import subprocess
import time

def check_backend_service():
    """Check if backend service is running"""
    print("[INFO] Checking Backend Service...")
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("[SUCCESS] Backend service is running")
            return True
        else:
            print(f"[ERROR] Backend service returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] Backend service is not running: {e}")
        return False

def check_database_connection():
    """Check database connection"""
    print("\n[INFO] Checking Database Connection...")
    try:
        import asyncio
        from motor.motor_asyncio import AsyncIOMotorClient
        import os
        
        async def test_db():
            mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
            database_name = os.getenv("DATABASE_NAME", "hackthon")
            
            client = AsyncIOMotorClient(mongodb_url)
            db = client[database_name]
            
            await client.admin.command('ping')
            collections = await db.list_collection_names()
            
            client.close()
            return len(collections)
        
        collections_count = asyncio.run(test_db())
        print(f"[SUCCESS] Database connected, {collections_count} collections found")
        return True
        
    except Exception as e:
        print(f"[ERROR] Database connection failed: {e}")
        return False

def test_preferences_endpoints():
    """Test preferences endpoints"""
    print("\n[INFO] Testing Preferences Endpoints...")
    
    # Test public endpoint
    try:
        response = requests.post(
            "http://localhost:8000/api/preferences/public",
            json={"travel_types": ["test"]},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        if response.status_code == 200:
            print("[SUCCESS] Public preferences endpoint working")
        else:
            print(f"[ERROR] Public preferences failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] Public preferences error: {e}")
        return False
    
    # Test authenticated endpoint
    try:
        response = requests.post(
            "http://localhost:8000/api/preferences",
            json={"travel_types": ["test"]},
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer dummy_token_diagnose"
            },
            timeout=10
        )
        if response.status_code == 200:
            print("[SUCCESS] Authenticated preferences endpoint working")
        else:
            print(f"[ERROR] Authenticated preferences failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] Authenticated preferences error: {e}")
        return False
    
    return True

def restart_backend_service():
    """Restart backend service"""
    print("\n[INFO] Restarting Backend Service...")
    try:
        # Kill existing Python processes
        subprocess.run(["taskkill", "/F", "/IM", "python.exe"], capture_output=True)
        time.sleep(2)
        
        # Start backend service
        print("[INFO] Starting backend service...")
        subprocess.Popen(["python", "main.py"], cwd=".")
        time.sleep(5)
        
        # Check if service is running
        if check_backend_service():
            print("[SUCCESS] Backend service restarted successfully")
            return True
        else:
            print("[ERROR] Failed to restart backend service")
            return False
            
    except Exception as e:
        print(f"[ERROR] Failed to restart backend service: {e}")
        return False

def main():
    """Main diagnosis function"""
    print("[INFO] Backend Issues Diagnosis")
    print("=" * 50)
    
    # Check all components
    backend_ok = check_backend_service()
    database_ok = check_database_connection()
    preferences_ok = test_preferences_endpoints()
    
    print("\n" + "=" * 50)
    print("📊 DIAGNOSIS RESULTS")
    print("=" * 50)
    
    if backend_ok and database_ok and preferences_ok:
        print("✅ All systems are working correctly!")
        print("   - Backend service: OK")
        print("   - Database connection: OK") 
        print("   - Preferences endpoints: OK")
        print("\n🎉 No issues found. Your backend is healthy!")
    else:
        print("❌ Issues detected:")
        if not backend_ok:
            print("   - Backend service: NOT RUNNING")
        if not database_ok:
            print("   - Database connection: FAILED")
        if not preferences_ok:
            print("   - Preferences endpoints: FAILED")
        
        print("\n🔧 RECOMMENDED ACTIONS:")
        print("1. Restart backend service:")
        print("   python main.py")
        print("2. Check MongoDB is running")
        print("3. Check environment variables in .env file")
        print("4. Run: python test_quick.py")

if __name__ == "__main__":
    main()
