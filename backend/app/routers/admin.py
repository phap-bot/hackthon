from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any
from datetime import datetime, timedelta

from app.models import AdminStatsResponse
from app.database import get_database
from app.utils.auth import get_current_user

router = APIRouter()

@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_stats(current_user: dict = Depends(get_current_user)):
    """Get admin statistics"""
    try:
        db = get_database()
        
        # Get total trips
        total_trips = await db.trips.count_documents({})
        
        # Get completed trips
        completed_trips = await db.trips.count_documents({"status": "completed"})
        
        # Get total revenue
        revenue_pipeline = [
            {"$group": {"_id": None, "total": {"$sum": "$total_cost"}}}
        ]
        revenue_result = await db.trips.aggregate(revenue_pipeline).to_list(length=1)
        total_revenue = revenue_result[0]["total"] if revenue_result else 0.0
        
        # Get average rating
        rating_pipeline = [
            {"$group": {"_id": None, "average": {"$avg": "$overall_rating"}}}
        ]
        rating_result = await db.feedback.aggregate(rating_pipeline).to_list(length=1)
        average_rating = rating_result[0]["average"] if rating_result else 0.0
        
        # Get active users (users with trips in last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        active_users = await db.trips.distinct("user_id", {
            "created_at": {"$gte": thirty_days_ago}
        })
        active_users_count = len(active_users)
        
        return AdminStatsResponse(
            total_trips=total_trips,
            completed_trips=completed_trips,
            total_revenue=total_revenue,
            average_rating=average_rating,
            active_users=active_users_count
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get admin stats: {str(e)}"
        )

@router.get("/trips", response_model=List[Dict[str, Any]])
async def get_all_trips(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all trips for admin"""
    try:
        db = get_database()
        
        # Build query
        query = {}
        if status:
            query["status"] = status
        
        # Get trips
        trips = await db.trips.find(
            query,
            {"_id": 1, "destination": 1, "start_date": 1, "end_date": 1,
             "total_days": 1, "total_cost": 1, "people": 1, "status": 1,
             "created_at": 1, "user_id": 1}
        ).skip(skip).limit(limit).sort("created_at", -1).to_list(length=None)
        
        # Convert ObjectId to string and add user info
        for trip in trips:
            trip["id"] = str(trip["_id"])
            del trip["_id"]
            
            # Get user info
            user = await db.users.find_one(
                {"_id": trip["user_id"]},
                {"username": 1, "email": 1, "full_name": 1}
            )
            if user:
                trip["user"] = {
                    "username": user["username"],
                    "email": user["email"],
                    "full_name": user["full_name"]
                }
        
        return trips
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get trips: {str(e)}"
        )

@router.get("/users", response_model=List[Dict[str, Any]])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    """Get all users for admin"""
    try:
        db = get_database()
        
        # Get users
        users = await db.users.find(
            {},
            {"_id": 1, "username": 1, "email": 1, "full_name": 1,
             "is_active": 1, "created_at": 1}
        ).skip(skip).limit(limit).sort("created_at", -1).to_list(length=None)
        
        # Convert ObjectId to string and add trip count
        for user in users:
            user["id"] = str(user["_id"])
            del user["_id"]
            
            # Get trip count
            trip_count = await db.trips.count_documents({"user_id": user["id"]})
            user["trip_count"] = trip_count
        
        return users
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get users: {str(e)}"
        )

@router.get("/feedback", response_model=List[Dict[str, Any]])
async def get_all_feedback(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    """Get all feedback for admin"""
    try:
        db = get_database()
        
        # Get feedback
        feedback_list = await db.feedback.find(
            {},
            {"_id": 1, "trip_id": 1, "user_id": 1, "overall_rating": 1,
             "would_recommend": 1, "created_at": 1}
        ).skip(skip).limit(limit).sort("created_at", -1).to_list(length=None)
        
        # Convert ObjectId to string and add trip/user info
        for feedback in feedback_list:
            feedback["id"] = str(feedback["_id"])
            del feedback["_id"]
            
            # Get trip info
            trip = await db.trips.find_one(
                {"_id": feedback["trip_id"]},
                {"destination": 1, "start_date": 1, "end_date": 1}
            )
            if trip:
                feedback["trip"] = {
                    "destination": trip["destination"],
                    "start_date": trip["start_date"],
                    "end_date": trip["end_date"]
                }
            
            # Get user info
            user = await db.users.find_one(
                {"_id": feedback["user_id"]},
                {"username": 1, "email": 1, "full_name": 1}
            )
            if user:
                feedback["user"] = {
                    "username": user["username"],
                    "email": user["email"],
                    "full_name": user["full_name"]
                }
        
        return feedback_list
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get feedback: {str(e)}"
        )

@router.put("/users/{user_id}/status", response_model=Dict[str, str])
async def update_user_status(
    user_id: str,
    is_active: bool,
    current_user: dict = Depends(get_current_user)
):
    """Update user active status"""
    try:
        db = get_database()
        
        # Update user status
        result = await db.users.update_one(
            {"_id": user_id},
            {"$set": {"is_active": is_active, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {
            "status": "success",
            "message": f"User status updated to {'active' if is_active else 'inactive'}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user status: {str(e)}"
        )

@router.delete("/trips/{trip_id}", response_model=Dict[str, str])
async def delete_trip_admin(
    trip_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete trip (admin only)"""
    try:
        db = get_database()
        
        # Delete trip and related data
        await db.trips.delete_one({"_id": trip_id})
        await db.activities.delete_many({"trip_id": trip_id})
        await db.feedback.delete_many({"trip_id": trip_id})
        
        return {
            "status": "success",
            "message": "Trip deleted successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete trip: {str(e)}"
        )
