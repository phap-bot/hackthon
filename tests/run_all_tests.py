#!/usr/bin/env python3
"""
Main Test Runner - Chạy tất cả test suites
Tích hợp và tối ưu toàn bộ hệ thống test
"""
import sys
import os
import subprocess
from datetime import datetime

class TestRunner:
    """Main test runner cho toàn bộ dự án"""
    
    def __init__(self):
        self.test_suites = [
            {
                'name': 'Authentication',
                'file': 'test_auth_integration.py',
                'description': 'Test authentication system'
            },
            {
                'name': 'Preferences & Recommendations',
                'file': 'test_preferences_integration.py',
                'description': 'Test preferences và recommendations'
            },
            {
                'name': 'Maps & Travel Planner',
                'file': 'test_maps_integration.py',
                'description': 'Test maps và travel planner'
            }
        ]
        self.results = []
    
    def run_test_suite(self, suite):
        """Chạy một test suite"""
        print(f"\n🧪 Running {suite['name']} Tests")
        print("=" * 60)
        print(f"📝 {suite['description']}")
        print("-" * 60)
        
        try:
            # Chạy test suite
            result = subprocess.run(
                [sys.executable, suite['file']],
                capture_output=True,
                text=True,
                cwd=os.path.dirname(__file__)
            )
            
            # In output
            if result.stdout:
                print(result.stdout)
            if result.stderr:
                print(f"⚠️ Warnings/Errors: {result.stderr}")
            
            # Lưu kết quả
            success = result.returncode == 0
            self.results.append({
                'name': suite['name'],
                'success': success,
                'returncode': result.returncode
            })
            
            return success
            
        except Exception as e:
            print(f"❌ Error running {suite['name']}: {str(e)}")
            self.results.append({
                'name': suite['name'],
                'success': False,
                'returncode': -1
            })
            return False
    
    def run_all_tests(self):
        """Chạy tất cả test suites"""
        print("🚀 WANDERLUST PROJECT - INTEGRATED TEST SUITE")
        print("=" * 80)
        print(f"📅 Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)
        
        total_suites = len(self.test_suites)
        passed_suites = 0
        
        for suite in self.test_suites:
            if self.run_test_suite(suite):
                passed_suites += 1
        
        # Tổng kết kết quả
        print("\n" + "=" * 80)
        print("📊 FINAL TEST RESULTS")
        print("=" * 80)
        
        for result in self.results:
            status = "✅ PASSED" if result['success'] else "❌ FAILED"
            print(f"{result['name']:<30} {status}")
        
        print("-" * 80)
        print(f"Total Suites: {total_suites}")
        print(f"Passed: {passed_suites}")
        print(f"Failed: {total_suites - passed_suites}")
        print(f"Success Rate: {(passed_suites/total_suites)*100:.1f}%")
        
        if passed_suites == total_suites:
            print("\n🎉 ALL TESTS PASSED! Project is ready for deployment.")
        else:
            print(f"\n⚠️ {total_suites - passed_suites} test suite(s) failed. Please check the issues above.")
        
        print("=" * 80)
        
        return passed_suites == total_suites

def main():
    """Main function"""
    runner = TestRunner()
    success = runner.run_all_tests()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
