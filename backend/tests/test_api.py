import pytest
import asyncio
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorClient
from unittest.mock import AsyncMock, patch
import os

# Set test environment
os.environ["MONGODB_URL"] = "mongodb://localhost:27017"
os.environ["DATABASE_NAME"] = "travel_planner_test"
os.environ["SECRET_KEY"] = "test-secret-key"

from main import app
from app.database import get_database

client = TestClient(app)

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
async def test_db():
    """Create test database connection"""
    client = AsyncIOMotorClient(os.environ["MONGODB_URL"])
    db = client[os.environ["DATABASE_NAME"]]
    yield db
    # Cleanup after test
    await client.drop_database(os.environ["DATABASE_NAME"])
    client.close()

class TestAuth:
    def test_register_success(self):
        """Test successful user registration"""
        response = client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "access_token" in data

    def test_register_duplicate_email(self):
        """Test registration with duplicate email"""
        # First registration
        client.post("/api/auth/register", json={
            "username": "testuser1",
            "email": "test@example.com",
            "full_name": "Test User 1",
            "password": "password123"
        })
        
        # Second registration with same email
        response = client.post("/api/auth/register", json={
            "username": "testuser2",
            "email": "test@example.com",
            "full_name": "Test User 2",
            "password": "password123"
        })
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"]

    def test_login_success(self):
        """Test successful login"""
        # Register user first
        client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123"
        })
        
        # Login
        response = client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "password123"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "access_token" in data

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = client.post("/api/auth/login", json={
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]

class TestTravelPlanner:
    def test_create_travel_plan_success(self):
        """Test successful travel plan creation"""
        # Register and login user first
        register_response = client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123"
        })
        token = register_response.json()["access_token"]
        
        # Create travel plan
        response = client.post("/api/travel-planner", 
            json={
                "destination": "Tokyo, Japan",
                "start_date": "2024-03-15",
                "end_date": "2024-03-19",
                "people": 2,
                "budget": "medium",
                "travel_style": "comfort",
                "interests": ["food", "culture"]
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "trip_id" in data

    def test_create_travel_plan_invalid_dates(self):
        """Test travel plan creation with invalid dates"""
        # Register and login user first
        register_response = client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123"
        })
        token = register_response.json()["access_token"]
        
        # Create travel plan with invalid dates
        response = client.post("/api/travel-planner", 
            json={
                "destination": "Tokyo, Japan",
                "start_date": "2024-03-19",
                "end_date": "2024-03-15",  # End date before start date
                "people": 2,
                "budget": "medium",
                "travel_style": "comfort",
                "interests": ["food", "culture"]
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 400
        assert "End date must be after start date" in response.json()["detail"]

    def test_get_user_trips(self):
        """Test getting user trips"""
        # Register and login user first
        register_response = client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123"
        })
        token = register_response.json()["access_token"]
        
        # Get trips
        response = client.get("/api/trips", 
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)

class TestMaps:
    def test_search_places(self):
        """Test place search"""
        response = client.get("/api/maps/search?query=restaurant")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_get_place_categories(self):
        """Test getting place categories"""
        response = client.get("/api/maps/categories")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        assert "restaurant" in response.json()

class TestAdmin:
    def test_get_admin_stats(self):
        """Test getting admin statistics"""
        # Register and login user first
        register_response = client.post("/api/auth/register", json={
            "username": "adminuser",
            "email": "admin@example.com",
            "full_name": "Admin User",
            "password": "password123"
        })
        token = register_response.json()["access_token"]
        
        # Get admin stats
        response = client.get("/api/admin/stats", 
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_trips" in data
        assert "completed_trips" in data
        assert "total_revenue" in data
        assert "average_rating" in data
        assert "active_users" in data

if __name__ == "__main__":
    pytest.main([__file__])
