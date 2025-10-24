#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quick Test for Backend Issues
Test nhanh các vấn đề chính của backend
"""
import requests
import json

def quick_test():
    """Quick test for main backend issues"""
    base_url = "http://localhost:8000"
    
    print("[INFO] Quick Backend Test")
    print("=" * 40)
    
    # Test 1: Health check
    print("\n1. Testing API Health...")
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print("[SUCCESS] API is healthy")
        else:
            print(f"[ERROR] API health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] Cannot connect to API: {e}")
        return False
    
    # Test 2: Preferences public endpoint
    print("\n2. Testing Public Preferences...")
    try:
        response = requests.post(
            f"{base_url}/api/preferences/public",
            json={"travel_types": ["adventure"]},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        if response.status_code == 200:
            print("[SUCCESS] Public preferences working")
        else:
            print(f"[ERROR] Public preferences failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] Public preferences error: {e}")
        return False
    
    # Test 3: Preferences with auth
    print("\n3. Testing Authenticated Preferences...")
    try:
        # Create preferences
        response = requests.post(
            f"{base_url}/api/preferences",
            json={"travel_types": ["adventure", "culture"]},
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer dummy_token_quick_test"
            },
            timeout=10
        )
        if response.status_code == 200:
            print("[SUCCESS] Create preferences working")
        else:
            print(f"[ERROR] Create preferences failed: {response.status_code}")
            return False
        
        # Get preferences
        response = requests.get(
            f"{base_url}/api/preferences",
            headers={"Authorization": "Bearer dummy_token_quick_test"},
            timeout=10
        )
        if response.status_code == 200:
            print("[SUCCESS] Get preferences working")
        else:
            print(f"[ERROR] Get preferences failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Authenticated preferences error: {e}")
        return False
    
    print("\n[SUCCESS] All quick tests passed!")
    return True

if __name__ == "__main__":
    quick_test()
