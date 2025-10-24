from fastapi import APIRouter, HTTPException, Depends, status
from typing import Dict, Any, List
from datetime import datetime

from app.models import ItineraryResponse
from app.database import get_database
from app.utils.auth import get_current_user_optional

router = APIRouter()

@router.get("/{trip_id}", response_model=ItineraryResponse)
async def get_itinerary(
    trip_id: str,
    current_user: dict = Depends(get_current_user_optional)
):
    """Get detailed itinerary for a trip"""
    try:
        db = get_database()
        
        # Get trip
        trip = await db.trips.find_one({"_id": trip_id})
        
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found"
            )
        
        # Check if user has access to this trip
        if current_user and trip["user_id"] != current_user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
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
        
        # Calculate summary
        total_attractions = len([a for day in days.values() for a in day if a["type"] == "attraction"])
        total_restaurants = len([a for day in days.values() for a in day if a["type"] == "restaurant"])
        total_hotels = len([a for day in days.values() for a in day if a["type"] == "hotel"])
        
        ratings = [a["rating"] for day in days.values() for a in day if a["rating"]]
        average_rating = sum(ratings) / len(ratings) if ratings else 0.0
        
        # Format days for response
        formatted_days = []
        for day_num in sorted(days.keys()):
            day_activities = days[day_num]
            day_cost = sum(activity["cost"] for activity in day_activities)
            
            formatted_days.append({
                "day": day_num,
                "date": (trip["start_date"] + datetime.timedelta(days=day_num-1)).strftime("%Y-%m-%d"),
                "estimatedCost": day_cost,
                "activities": day_activities
            })
        
        return ItineraryResponse(
            trip_id=trip_id,
            destination=trip["destination"],
            total_days=trip["total_days"],
            total_cost=trip["total_cost"],
            start_date=trip["start_date"],
            end_date=trip["end_date"],
            days=formatted_days,
            summary={
                "totalAttractions": total_attractions,
                "totalRestaurants": total_restaurants,
                "totalHotels": total_hotels,
                "averageRating": average_rating
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get itinerary: {str(e)}"
        )

@router.get("/{trip_id}/activities", response_model=List[Dict[str, Any]])
async def get_trip_activities(
    trip_id: str,
    day: int = None,
    current_user: dict = Depends(get_current_user_optional)
):
    """Get activities for a trip"""
    try:
        db = get_database()
        
        # Get trip
        trip = await db.trips.find_one({"_id": trip_id})
        
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found"
            )
        
        # Check if user has access to this trip
        if current_user and trip["user_id"] != current_user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Build query
        query = {"trip_id": trip_id}
        if day is not None:
            query["day"] = day
        
        # Get activities
        activities = await db.activities.find(query).sort("day", 1).to_list(length=None)
        
        # Format response
        formatted_activities = []
        for activity in activities:
            formatted_activities.append({
                "id": str(activity["_id"]),
                "trip_id": str(activity["trip_id"]),
                "day": activity["day"],
                "name": activity["name"],
                "type": activity["type"],
                "time": activity["time"],
                "duration": activity["duration"],
                "cost": activity["cost"],
                "description": activity.get("description"),
                "location": activity.get("location"),
                "rating": activity.get("rating"),
                "coordinates": activity.get("coordinates"),
                "created_at": activity["created_at"]
            })
        
        return formatted_activities
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get activities: {str(e)}"
        )
