from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime, date
from typing import List, Dict, Any
import uuid

from app.models import TripCreate, Trip, TripResponse, ItineraryResponse
from app.database import get_database
from app.utils.auth import get_current_user
from app.services.ai_service import AITravelPlannerService
from app.services.maps_service import MapsService

router = APIRouter()

@router.post("/travel-planner", response_model=TripResponse)
async def create_travel_plan(
    trip_data: TripCreate,
    language: str = "vi",  # Mặc định tiếng Việt
    current_user: dict = Depends(get_current_user)
):
    """Create a new travel plan using AI"""
    try:
        db = get_database()
        
        # Validate dates
        if trip_data.start_date >= trip_data.end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="End date must be after start date"
            )
        
        # Calculate total days
        total_days = (trip_data.end_date - trip_data.start_date).days + 1
        
        # Create trip document
        trip_doc = {
            "user_id": current_user["user_id"],
            "destination": trip_data.destination,
            "start_date": trip_data.start_date,
            "end_date": trip_data.end_date,
            "total_days": total_days,
            "people": trip_data.people,
            "budget": trip_data.budget,
            "travel_style": trip_data.travel_style,
            "interests": trip_data.interests,
            "total_cost": 0.0,
            "status": "pending",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert trip
        result = await db.trips.insert_one(trip_doc)
        trip_id = str(result.inserted_id)
        
        # Generate itinerary using AI service
        ai_service = AITravelPlannerService()
        itinerary = await ai_service.generate_itinerary(trip_data, trip_id, language)
        
        # Save activities to database
        activities = []
        for day_data in itinerary.get("days", []):
            day_number = day_data["day"]
            for activity_data in day_data["activities"]:
                activity_doc = {
                    "trip_id": result.inserted_id,
                    "day": day_number,
                    "name": activity_data["name"],
                    "type": activity_data["type"],
                    "time": activity_data["time"],
                    "duration": activity_data["duration"],
                    "cost": activity_data.get("cost", 0.0),
                    "description": activity_data.get("description"),
                    "location": activity_data.get("location"),
                    "rating": activity_data.get("rating"),
                    "coordinates": activity_data.get("coordinates"),
                    "created_at": datetime.utcnow()
                }
                activities.append(activity_doc)
        
        if activities:
            await db.activities.insert_many(activities)
        
        # Update trip with total cost
        total_cost = sum(activity["cost"] for activity in activities)
        await db.trips.update_one(
            {"_id": result.inserted_id},
            {"$set": {"total_cost": total_cost, "status": "confirmed"}}
        )
        
        return TripResponse(
            trip_id=trip_id,
            status="success",
            message="Travel plan created successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create travel plan: {str(e)}"
        )

@router.get("/trips", response_model=List[Dict[str, Any]])
async def get_user_trips(current_user: dict = Depends(get_current_user)):
    """Get all trips for current user"""
    try:
        db = get_database()
        
        trips = await db.trips.find(
            {"user_id": current_user["user_id"]},
            {"_id": 1, "destination": 1, "start_date": 1, "end_date": 1, 
             "total_days": 1, "total_cost": 1, "status": 1, "created_at": 1}
        ).sort("created_at", -1).to_list(length=None)
        
        # Convert ObjectId to string
        for trip in trips:
            trip["id"] = str(trip["_id"])
            del trip["_id"]
        
        return trips
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get trips: {str(e)}"
        )

@router.get("/trips/{trip_id}", response_model=Dict[str, Any])
async def get_trip_details(
    trip_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get detailed information about a specific trip"""
    try:
        db = get_database()
        
        # Get trip
        trip = await db.trips.find_one({
            "_id": trip_id,
            "user_id": current_user["user_id"]
        })
        
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found"
            )
        
        # Get activities
        activities = await db.activities.find(
            {"trip_id": trip_id}
        ).sort("day", 1).to_list(length=None)
        
        # Group activities by day
        days = {}
        for activity in activities:
            day = activity["day"]
            if day not in days:
                days[day] = []
            
            activity_data = {
                "id": str(activity["_id"]),
                "name": activity["name"],
                "type": activity["type"],
                "time": activity["time"],
                "duration": activity["duration"],
                "cost": activity["cost"],
                "description": activity.get("description"),
                "location": activity.get("location"),
                "rating": activity.get("rating"),
                "coordinates": activity.get("coordinates")
            }
            days[day].append(activity_data)
        
        # Format response
        trip_data = {
            "id": str(trip["_id"]),
            "destination": trip["destination"],
            "start_date": trip["start_date"],
            "end_date": trip["end_date"],
            "total_days": trip["total_days"],
            "total_cost": trip["total_cost"],
            "people": trip["people"],
            "budget": trip["budget"],
            "travel_style": trip["travel_style"],
            "interests": trip["interests"],
            "status": trip["status"],
            "created_at": trip["created_at"],
            "days": days
        }
        
        return trip_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get trip details: {str(e)}"
        )

@router.put("/trips/{trip_id}", response_model=Dict[str, str])
async def update_trip(
    trip_id: str,
    trip_update: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    """Update a trip"""
    try:
        db = get_database()
        
        # Check if trip exists and belongs to user
        trip = await db.trips.find_one({
            "_id": trip_id,
            "user_id": current_user["user_id"]
        })
        
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found"
            )
        
        # Update trip
        update_data = {
            **trip_update,
            "updated_at": datetime.utcnow()
        }
        
        result = await db.trips.update_one(
            {"_id": trip_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found"
            )
        
        return {
            "status": "success",
            "message": "Trip updated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update trip: {str(e)}"
        )

@router.delete("/trips/{trip_id}", response_model=Dict[str, str])
async def delete_trip(
    trip_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a trip"""
    try:
        db = get_database()
        
        # Check if trip exists and belongs to user
        trip = await db.trips.find_one({
            "_id": trip_id,
            "user_id": current_user["user_id"]
        })
        
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found"
            )
        
        # Delete trip and related activities
        await db.trips.delete_one({"_id": trip_id})
        await db.activities.delete_many({"trip_id": trip_id})
        await db.feedback.delete_many({"trip_id": trip_id})
        
        return {
            "status": "success",
            "message": "Trip deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete trip: {str(e)}"
        )
