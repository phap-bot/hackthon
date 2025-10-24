from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any
from datetime import datetime

from app.models import FeedbackCreate, Feedback, FeedbackResponse
from app.database import get_database
from app.utils.auth import get_current_user

router = APIRouter()

@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(
    feedback_data: FeedbackCreate,
    current_user: dict = Depends(get_current_user)
):
    """Submit feedback for a trip"""
    try:
        db = get_database()
        
        # Check if trip exists and belongs to user
        trip = await db.trips.find_one({
            "_id": feedback_data.trip_id,
            "user_id": current_user["user_id"]
        })
        
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found"
            )
        
        # Check if feedback already exists
        existing_feedback = await db.feedback.find_one({
            "trip_id": feedback_data.trip_id,
            "user_id": current_user["user_id"]
        })
        
        if existing_feedback:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Feedback already submitted for this trip"
            )
        
        # Create feedback document
        feedback_doc = {
            "trip_id": feedback_data.trip_id,
            "user_id": current_user["user_id"],
            "overall_rating": feedback_data.overall_rating,
            "value_for_money": feedback_data.value_for_money,
            "itinerary_quality": feedback_data.itinerary_quality,
            "accommodation_rating": feedback_data.accommodation_rating,
            "food_rating": feedback_data.food_rating,
            "transportation_rating": feedback_data.transportation_rating,
            "attractions_rating": feedback_data.attractions_rating,
            "would_recommend": feedback_data.would_recommend,
            "favorite_activity": feedback_data.favorite_activity,
            "least_favorite_activity": feedback_data.least_favorite_activity,
            "suggestions": feedback_data.suggestions,
            "additional_comments": feedback_data.additional_comments,
            "created_at": datetime.utcnow()
        }
        
        # Insert feedback
        result = await db.feedback.insert_one(feedback_doc)
        feedback_id = str(result.inserted_id)
        
        return FeedbackResponse(
            status="success",
            message="Feedback submitted successfully",
            feedback_id=feedback_id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit feedback: {str(e)}"
        )

@router.get("/feedback/{trip_id}", response_model=Dict[str, Any])
async def get_trip_feedback(
    trip_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get feedback for a specific trip"""
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
        
        # Get feedback
        feedback = await db.feedback.find_one({
            "trip_id": trip_id,
            "user_id": current_user["user_id"]
        })
        
        if not feedback:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found"
            )
        
        # Format response
        feedback_data = {
            "id": str(feedback["_id"]),
            "trip_id": str(feedback["trip_id"]),
            "overall_rating": feedback["overall_rating"],
            "value_for_money": feedback["value_for_money"],
            "itinerary_quality": feedback["itinerary_quality"],
            "accommodation_rating": feedback["accommodation_rating"],
            "food_rating": feedback["food_rating"],
            "transportation_rating": feedback["transportation_rating"],
            "attractions_rating": feedback["attractions_rating"],
            "would_recommend": feedback["would_recommend"],
            "favorite_activity": feedback.get("favorite_activity"),
            "least_favorite_activity": feedback.get("least_favorite_activity"),
            "suggestions": feedback.get("suggestions"),
            "additional_comments": feedback.get("additional_comments"),
            "created_at": feedback["created_at"]
        }
        
        return feedback_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get feedback: {str(e)}"
        )

@router.put("/feedback/{feedback_id}", response_model=Dict[str, str])
async def update_feedback(
    feedback_id: str,
    feedback_update: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    """Update feedback"""
    try:
        db = get_database()
        
        # Check if feedback exists and belongs to user
        feedback = await db.feedback.find_one({
            "_id": feedback_id,
            "user_id": current_user["user_id"]
        })
        
        if not feedback:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found"
            )
        
        # Update feedback
        update_data = {
            **feedback_update,
            "updated_at": datetime.utcnow()
        }
        
        result = await db.feedback.update_one(
            {"_id": feedback_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found"
            )
        
        return {
            "status": "success",
            "message": "Feedback updated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update feedback: {str(e)}"
        )

@router.delete("/feedback/{feedback_id}", response_model=Dict[str, str])
async def delete_feedback(
    feedback_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete feedback"""
    try:
        db = get_database()
        
        # Check if feedback exists and belongs to user
        feedback = await db.feedback.find_one({
            "_id": feedback_id,
            "user_id": current_user["user_id"]
        })
        
        if not feedback:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found"
            )
        
        # Delete feedback
        await db.feedback.delete_one({"_id": feedback_id})
        
        return {
            "status": "success",
            "message": "Feedback deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete feedback: {str(e)}"
        )
