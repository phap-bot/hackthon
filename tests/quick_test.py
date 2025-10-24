#!/usr/bin/env python3
"""
Quick Test Runner - Chạy test nhanh
Script đơn giản để chạy test nhanh trong development
"""
import sys
import os

def main():
    """Main function"""
    print("🚀 Quick Test Runner")
    print("=" * 40)
    
    # Kiểm tra backend server
    print("🔍 Checking backend server...")
    try:
        import requests
        response = requests.get("http://localhost:8000/docs", timeout=5)
        if response.status_code == 200:
            print("✅ Backend server is running")
        else:
            print("❌ Backend server not responding properly")
            return 1
    except Exception as e:
        print(f"❌ Backend server not running: {str(e)}")
        print("💡 Please start backend server first:")
        print("   cd backend && python main.py")
        return 1
    
    # Chạy test suites
    test_files = [
        "test_auth_integration.py",
        "test_preferences_integration.py", 
        "test_maps_integration.py"
    ]
    
    passed = 0
    total = len(test_files)
    
    for test_file in test_files:
        if os.path.exists(test_file):
            print(f"\n🧪 Running {test_file}...")
            try:
                result = os.system(f"python {test_file}")
                if result == 0:
                    print(f"✅ {test_file} passed")
                    passed += 1
                else:
                    print(f"❌ {test_file} failed")
            except Exception as e:
                print(f"❌ Error running {test_file}: {str(e)}")
        else:
            print(f"❌ {test_file} not found")
    
    # Kết quả
    print(f"\n📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
