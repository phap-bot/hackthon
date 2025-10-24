#!/usr/bin/env python3
"""
Test Configuration và Utilities
Cấu hình chung cho tất cả test suites
"""
import os
import sys
from typing import Dict, Any

class TestConfig:
    """Cấu hình chung cho tests"""
    
    # URLs
    BACKEND_URL = "http://localhost:8000"
    FRONTEND_URL = "http://localhost:3000"
    
    # Test users
    TEST_USERS = {
        'auth': {
            'username': 'test_auth_user',
            'email': 'test_auth@example.com',
            'password': '123456',
            'full_name': 'Test Auth User'
        },
        'preferences': {
            'username': 'test_prefs_user',
            'email': 'test_prefs@example.com',
            'password': '123456',
            'full_name': 'Test Preferences User'
        },
        'maps': {
            'username': 'test_maps_user',
            'email': 'test_maps@example.com',
            'password': '123456',
            'full_name': 'Test Maps User'
        }
    }
    
    # Test data
    TEST_PREFERENCES = {
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
    
    TEST_PLANNER_DATA = {
        "destination": "Ho Chi Minh City",
        "duration": 7,
        "budget": 1000,
        "interests": ["culture", "food", "history"],
        "accommodation_type": "hotel"
    }
    
    # Test locations
    TEST_LOCATIONS = {
        'hcm': 'Ho Chi Minh City',
        'hanoi': 'Hanoi',
        'danang': 'Da Nang',
        'nhatrang': 'Nha Trang'
    }

class TestUtils:
    """Utilities cho tests"""
    
    @staticmethod
    def get_auth_headers(token: str) -> Dict[str, str]:
        """Tạo headers với authentication token"""
        return {'Authorization': f'Bearer {token}'}
    
    @staticmethod
    def print_test_header(test_name: str, description: str = ""):
        """In header cho test"""
        print(f"\n🔍 {test_name}")
        print("-" * 50)
        if description:
            print(f"📝 {description}")
            print("-" * 50)
    
    @staticmethod
    def print_test_result(test_name: str, success: bool, details: str = ""):
        """In kết quả test"""
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{test_name}: {status}")
        if details:
            print(f"   {details}")
    
    @staticmethod
    def check_server_health(base_url: str) -> bool:
        """Kiểm tra server có đang chạy không"""
        try:
            import requests
            response = requests.get(f"{base_url}/docs", timeout=5)
            return response.status_code == 200
        except:
            return False

# Export config
config = TestConfig()
utils = TestUtils()
