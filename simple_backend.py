from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv
import asyncio
import hashlib
from datetime import datetime

# Load environment variables
load_dotenv()

# Import database
from backend.app.database import init_db, get_database

# Create FastAPI app
app = FastAPI(title="Simple Travel API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.get("/")
async def root():
    return {"message": "Simple Travel API", "status": "running"}

@app.post("/api/auth/register")
async def register(user_data: dict):
    """Simple registration endpoint"""
    try:
        db = get_database()
        
        # Check if user already exists
        existing_user = await db.users.find_one({
            "$or": [
                {"email": user_data.get("email")},
                {"username": user_data.get("username")}
            ]
        })
        
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Simple password hash
        password = user_data.get("password", "")
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        
        # Create user document
        user_doc = {
            "username": user_data.get("username"),
            "email": user_data.get("email"),
            "full_name": user_data.get("full_name"),
            "hashed_password": hashed_password,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert user
        result = await db.users.insert_one(user_doc)
        
        return {
            "status": "success",
            "message": "User registered successfully",
            "access_token": "dummy_token_" + str(result.inserted_id),  # Dummy token for now
            "token_type": "bearer",
            "user_id": str(result.inserted_id),
            "username": user_doc["username"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/auth/login")
async def login(login_data: dict):
    """Simple login endpoint"""
    try:
        db = get_database()
        
        email = login_data.get("email")
        password = login_data.get("password")
        
        if not email or not password:
            raise HTTPException(status_code=400, detail="Email and password are required")
        
        # Find user by email
        user = await db.users.find_one({"email": email})
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Password check - support both SHA256 and bcrypt
        input_password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        # Check if stored password is bcrypt (starts with $2b$) or SHA256
        stored_hash = user["hashed_password"]
        if stored_hash.startswith("$2b$"):
            # This is bcrypt hash - we can't verify it with simple SHA256
            # For now, we'll skip bcrypt users or you need to re-register them
            raise HTTPException(status_code=401, detail="Please re-register with new password")
        else:
            # This is SHA256 hash
            if stored_hash != input_password_hash:
                raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return {
            "status": "success",
            "message": "Login successful",
            "access_token": "dummy_token_" + str(user["_id"]),  # Dummy token for now
            "token_type": "bearer",
            "user_id": str(user["_id"]),
            "username": user["username"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.post("/api/preferences")
async def create_preferences(preferences_data: dict):
    """Create user preferences"""
    try:
        db = get_database()
        
        # Extract user_id from token (simplified)
        user_id = preferences_data.get("user_id")
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID required")
        
        # Check if user exists
        user = await db.users.find_one({"_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Prepare preferences document
        preferences_doc = {
            "user_id": user_id,
            "travel_types": preferences_data.get("travel_types", []),
            "dream_destinations": preferences_data.get("dream_destinations", []),
            "activities": preferences_data.get("activities", []),
            "budget_level": preferences_data.get("budget_level"),
            "trip_duration_preference": preferences_data.get("trip_duration_preference"),
            "group_size_preference": preferences_data.get("group_size_preference"),
            "accommodation_preference": preferences_data.get("accommodation_preference"),
            "transportation_preference": preferences_data.get("transportation_preference"),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Check if preferences already exist
        existing_preferences = await db.user_preferences.find_one({"user_id": user_id})
        
        if existing_preferences:
            # Update existing preferences
            result = await db.user_preferences.update_one(
                {"user_id": user_id},
                {"$set": preferences_doc}
            )
            message = "Preferences updated successfully"
        else:
            # Create new preferences
            result = await db.user_preferences.insert_one(preferences_doc)
            message = "Preferences created successfully"
        
        return {
            "status": "success",
            "message": message,
            "preferences": preferences_doc
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save preferences: {str(e)}")

@app.get("/api/preferences")
async def get_preferences(user_id: str):
    """Get user preferences"""
    try:
        db = get_database()
        
        preferences = await db.user_preferences.find_one({"user_id": user_id})
        
        if not preferences:
            return {
                "status": "success",
                "message": "No preferences found",
                "preferences": None
            }
        
        return {
            "status": "success",
            "preferences": preferences
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get preferences: {str(e)}")
