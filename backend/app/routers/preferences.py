from fastapi import APIRouter, HTTPException, Depends, status, Request
from fastapi.responses import JSONResponse
from typing import Optional
from datetime import datetime
import os
import json

from pydantic import BaseModel
from typing import List, Optional
from app.database import get_database

def serialize_preferences(preferences):
    """Serialize preferences for JSON response"""
    if not preferences:
        return preferences
    
    # Convert ObjectId to string
    if "_id" in preferences:
        preferences["_id"] = str(preferences["_id"])
    
    # Convert datetime to ISO format
    if "created_at" in preferences and preferences["created_at"]:
        preferences["created_at"] = preferences["created_at"].isoformat()
    
    if "updated_at" in preferences and preferences["updated_at"]:
        preferences["updated_at"] = preferences["updated_at"].isoformat()
    
    return preferences

# Pydantic models
class UserPreferencesCreate(BaseModel):
    travel_types: Optional[List[str]] = []
    dream_destinations: Optional[List[str]] = []
    activities: Optional[List[str]] = []
    budget_level: Optional[str] = None
    trip_duration_preference: Optional[str] = None
    group_size_preference: Optional[str] = None
    accommodation_preference: Optional[str] = None
    transportation_preference: Optional[str] = None

class UserPreferencesUpdate(BaseModel):
    travel_types: Optional[List[str]] = None
    dream_destinations: Optional[List[str]] = None
    activities: Optional[List[str]] = None
    budget_level: Optional[str] = None
    trip_duration_preference: Optional[str] = None
    group_size_preference: Optional[str] = None
    accommodation_preference: Optional[str] = None
    transportation_preference: Optional[str] = None

router = APIRouter(tags=["preferences"])

def create_json_response(content, status_code=200, headers=None):
    """Create JSON response with proper UTF-8 encoding"""
    if headers is None:
        headers = {}
    
    # Ensure UTF-8 encoding
    headers["Content-Type"] = "application/json; charset=utf-8"
    
    return JSONResponse(
        content=content,
        status_code=status_code,
        headers=headers
    )

@router.options("/preferences")
async def options_preferences():
    """Handle preflight requests for CORS"""
    return create_json_response(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    )

@router.options("/preferences/public")
async def options_preferences_public():
    """Handle preflight requests for CORS - public endpoint"""
    return create_json_response(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    )

@router.post("/preferences/public", response_model=dict)
async def create_user_preferences_public(request: Request):
    """Create user preferences without authentication (for testing)"""
    try:
        # Get raw body and parse manually to handle UTF-8
        body = await request.body()
        try:
            body_str = body.decode('utf-8')
        except UnicodeDecodeError:
            # Fallback to latin-1 if UTF-8 fails
            body_str = body.decode('latin-1')
        preferences_data = json.loads(body_str)
        
        db = get_database()
        
        # Use a dummy user_id for testing
        user_id = "test_user_123"
        
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
        
       # Insert preferences
        result = await db.user_preferences.insert_one(preferences_doc)
        
        return {
            "status": "success",
            "message": "Preferences saved successfully",
            "preferences_id": str(result.inserted_id)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save preferences: {str(e)}"
        )

def get_user_id_from_token(request: Request) -> str:
    """Extract user ID from token (simplified for now)"""
    # For now, we'll use a simple approach
    # In production, you'd decode JWT token here
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.replace("Bearer ", "")
        return token.replace("dummy_token_", "")
    return "test_user_123"  # Default for testing

@router.post("/preferences", response_model=dict)
async def create_user_preferences(request: Request):
    """Create or update user preferences"""
    try:
        # Get raw body and parse manually to handle UTF-8
        body = await request.body()
        try:
            body_str = body.decode('utf-8')
        except UnicodeDecodeError:
            # Fallback to latin-1 if UTF-8 fails
            body_str = body.decode('latin-1')
        preferences_data = json.loads(body_str)
        
        # Extract user_id from token
        user_id = get_user_id_from_token(request)
        
        db = get_database()
        
        # Check if user exists, create if not
        user = await db.users.find_one({"_id": user_id})
        if not user:
            # Create user for testing
            await db.users.insert_one({
                "_id": user_id,
                "email": f"{user_id}@test.com",
                "username": user_id,
                "created_at": datetime.utcnow()
            })
        
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
        
        # Serialize preferences for response
        serialize_preferences(preferences_doc)
        
        return {
            "status": "success",
            "message": message,
            "preferences": preferences_doc
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save preferences: {str(e)}"
        )

@router.get("/preferences")
async def get_user_preferences(request: Request):
    """Get user preferences"""
    try:
        # Extract user_id from token
        user_id = get_user_id_from_token(request)
        
        db = get_database()
        
        preferences = await db.user_preferences.find_one({"user_id": user_id})
        
        if not preferences:
            return {
                "status": "success",
                "message": "No preferences found",
                "preferences": None
            }
        
        # Serialize preferences for JSON response
        serialize_preferences(preferences)
        
        return {
            "status": "success",
            "preferences": preferences
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get preferences: {str(e)}"
        )

@router.put("/preferences", response_model=dict)
async def update_user_preferences(
    preferences_data: UserPreferencesUpdate,
    request: Request
):
    """Update user preferences"""
    try:
        # Extract user_id from token
        user_id = get_user_id_from_token(request)
        
        db = get_database()
        
        # Prepare update data
        update_data = {"updated_at": datetime.utcnow()}
        
        if preferences_data.travel_types is not None:
            update_data["travel_types"] = preferences_data.travel_types
        if preferences_data.dream_destinations is not None:
            update_data["dream_destinations"] = preferences_data.dream_destinations
        if preferences_data.activities is not None:
            update_data["activities"] = preferences_data.activities
        if preferences_data.budget_level is not None:
            update_data["budget_level"] = preferences_data.budget_level
        if preferences_data.trip_duration_preference is not None:
            update_data["trip_duration_preference"] = preferences_data.trip_duration_preference
        if preferences_data.group_size_preference is not None:
            update_data["group_size_preference"] = preferences_data.group_size_preference
        if preferences_data.accommodation_preference is not None:
            update_data["accommodation_preference"] = preferences_data.accommodation_preference
        if preferences_data.transportation_preference is not None:
            update_data["transportation_preference"] = preferences_data.transportation_preference
        
        # Update preferences
        result = await db.user_preferences.update_one(
            {"user_id": user_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Preferences not found"
            )
        
        return {
            "status": "success",
            "message": "Preferences updated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update preferences: {str(e)}"
        )

@router.options("/preferences")
async def options_preferences():
    """Handle OPTIONS request for CORS"""
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
            "Access-Control-Max-Age": "86400",
        }
    )
