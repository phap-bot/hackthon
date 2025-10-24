from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.database import get_database
from app.utils.auth import get_current_user
from app.services.feedback_analytics_service import FeedbackAnalyticsService
from app.services.auto_improvement_service import AutoImprovementService

router = APIRouter()

class DashboardStats(BaseModel):
    total_feedback: int
    pending_feedback: int
    resolved_feedback: int
    high_priority_feedback: int
    average_rating: float
    customer_satisfaction_score: float
    net_promoter_score: float
    response_time_avg: float
    improvement_suggestions_count: int

class FeedbackTrend(BaseModel):
    date: str
    count: int
    positive_count: int
    negative_count: int
    average_rating: float

@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    days: int = Query(30, ge=1, le=365),
    current_user: dict = Depends(get_current_user)
):
    """Lấy thống kê tổng quan cho dashboard"""
    try:
        db = get_database()
        
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Get feedback counts
        total_feedback = await db.feedback.count_documents({
            "created_at": {"$gte": start_date, "$lte": end_date}
        })
        
        pending_feedback = await db.feedback.count_documents({
            "status": "pending",
            "created_at": {"$gte": start_date, "$lte": end_date}
        })
        
        resolved_feedback = await db.feedback.count_documents({
            "status": "resolved",
            "created_at": {"$gte": start_date, "$lte": end_date}
        })
        
        high_priority_feedback = await db.feedback.count_documents({
            "priority": {"$in": ["high", "urgent"]},
            "created_at": {"$gte": start_date, "$lte": end_date}
        })
        
        # Calculate average rating
        pipeline = [
            {"$match": {
                "rating": {"$exists": True, "$ne": None},
                "created_at": {"$gte": start_date, "$lte": end_date}
            }},
            {"$group": {"_id": None, "avg_rating": {"$avg": "$rating"}}}
        ]
        rating_result = await db.feedback.aggregate(pipeline).to_list(length=1)
        average_rating = rating_result[0]["avg_rating"] if rating_result else 0.0
        
        # Get analytics for satisfaction and NPS
        analytics_service = FeedbackAnalyticsService()
        insights = await analytics_service.get_feedback_insights(start_date, end_date)
        
        # Calculate response time
        response_pipeline = [
            {"$match": {
                "resolved_at": {"$exists": True},
                "created_at": {"$gte": start_date, "$lte": end_date}
            }},
            {"$project": {
                "response_time": {
                    "$divide": [
                        {"$subtract": ["$resolved_at", "$created_at"]},
                        3600000  # Convert to hours
                    ]
                }
            }},
            {"$group": {"_id": None, "avg_response_time": {"$avg": "$response_time"}}}
        ]
        response_result = await db.feedback.aggregate(response_pipeline).to_list(length=1)
        response_time_avg = response_result[0]["avg_response_time"] if response_result else 0.0
        
        # Count improvement suggestions
        improvement_suggestions_count = await db.improvement_suggestions.count_documents({
            "status": "pending"
        })
        
        return DashboardStats(
            total_feedback=total_feedback,
            pending_feedback=pending_feedback,
            resolved_feedback=resolved_feedback,
            high_priority_feedback=high_priority_feedback,
            average_rating=average_rating,
            customer_satisfaction_score=insights.customer_satisfaction_score,
            net_promoter_score=insights.net_promoter_score,
            response_time_avg=response_time_avg,
            improvement_suggestions_count=improvement_suggestions_count
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể lấy thống kê dashboard: {str(e)}"
        )

@router.get("/dashboard/trends", response_model=List[FeedbackTrend])
async def get_feedback_trends(
    days: int = Query(30, ge=1, le=365),
    current_user: dict = Depends(get_current_user)
):
    """Lấy xu hướng feedback theo thời gian"""
    try:
        db = get_database()
        
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Get daily trends
        pipeline = [
            {"$match": {"created_at": {"$gte": start_date, "$lte": end_date}}},
            {"$group": {
                "_id": {
                    "year": {"$year": "$created_at"},
                    "month": {"$month": "$created_at"},
                    "day": {"$dayOfMonth": "$created_at"}
                },
                "count": {"$sum": 1},
                "positive_count": {
                    "$sum": {"$cond": [{"$gte": ["$rating", 4]}, 1, 0]}
                },
                "negative_count": {
                    "$sum": {"$cond": [{"$lte": ["$rating", 2]}, 1, 0]}
                },
                "total_rating": {"$sum": "$rating"},
                "rating_count": {
                    "$sum": {"$cond": [{"$ne": ["$rating", None]}, 1, 0]}
                }
            }},
            {"$sort": {"_id.year": 1, "_id.month": 1, "_id.day": 1}}
        ]
        
        trends = await db.feedback.aggregate(pipeline).to_list(length=None)
        
        result = []
        for trend in trends:
            date_str = f"{trend['_id']['year']}-{trend['_id']['month']:02d}-{trend['_id']['day']:02d}"
            avg_rating = trend["total_rating"] / trend["rating_count"] if trend["rating_count"] > 0 else 0
            
            result.append(FeedbackTrend(
                date=date_str,
                count=trend["count"],
                positive_count=trend["positive_count"],
                negative_count=trend["negative_count"],
                average_rating=avg_rating
            ))
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể lấy xu hướng feedback: {str(e)}"
        )

@router.get("/dashboard/feedback-summary", response_model=Dict[str, Any])
async def get_feedback_summary(
    current_user: dict = Depends(get_current_user)
):
    """Lấy tóm tắt feedback cho dashboard"""
    try:
        db = get_database()
        
        # Get recent feedback
        recent_feedback = await db.feedback.find().sort("created_at", -1).limit(10).to_list(length=None)
        
        # Get feedback by type
        type_pipeline = [
            {"$group": {"_id": "$feedback_type", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        feedback_by_type = await db.feedback.aggregate(type_pipeline).to_list(length=None)
        
        # Get feedback by status
        status_pipeline = [
            {"$group": {"_id": "$status", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        feedback_by_status = await db.feedback.aggregate(status_pipeline).to_list(length=None)
        
        # Get top issues
        issues_pipeline = [
            {"$unwind": "$tags"},
            {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        top_issues = await db.feedback.aggregate(issues_pipeline).to_list(length=None)
        
        # Get improvement suggestions
        suggestions = await db.improvement_suggestions.find({
            "status": "pending"
        }).sort("impact_score", -1).limit(5).to_list(length=None)
        
        return {
            "recent_feedback": recent_feedback,
            "feedback_by_type": feedback_by_type,
            "feedback_by_status": feedback_by_status,
            "top_issues": top_issues,
            "top_suggestions": suggestions,
            "generated_at": datetime.utcnow()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể lấy tóm tắt feedback: {str(e)}"
        )

@router.get("/dashboard/feedback-details/{feedback_id}", response_model=Dict[str, Any])
async def get_feedback_details(
    feedback_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Lấy chi tiết feedback cho dashboard"""
    try:
        db = get_database()
        
        # Get feedback
        feedback = await db.feedback.find_one({"_id": feedback_id})
        if not feedback:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy feedback"
            )
        
        # Get replies
        replies = await db.feedback_replies.find({"feedback_id": feedback_id}).sort("created_at", 1).to_list(length=None)
        
        # Get votes
        votes = await db.feedback_votes.find({"feedback_id": feedback_id}).to_list(length=None)
        
        # Get improvement suggestions
        suggestions = await db.improvement_suggestions.find({"feedback_id": feedback_id}).to_list(length=None)
        
        # Get user info if not anonymous
        user_info = None
        if feedback.get("user_id") and not feedback.get("is_anonymous"):
            user_info = await db.users.find_one(
                {"_id": feedback["user_id"]},
                {"username": 1, "email": 1, "full_name": 1}
            )
        
        # Get trip info if applicable
        trip_info = None
        if feedback.get("trip_id"):
            trip_info = await db.trips.find_one(
                {"_id": feedback["trip_id"]},
                {"destination": 1, "start_date": 1, "end_date": 1, "status": 1}
            )
        
        return {
            "feedback": feedback,
            "replies": replies,
            "votes": votes,
            "suggestions": suggestions,
            "user_info": user_info,
            "trip_info": trip_info
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể lấy chi tiết feedback: {str(e)}"
        )

@router.post("/dashboard/feedback/{feedback_id}/assign", response_model=Dict[str, str])
async def assign_feedback(
    feedback_id: str,
    assigned_to: str,
    current_user: dict = Depends(get_current_user)
):
    """Giao feedback cho người xử lý"""
    try:
        db = get_database()
        
        result = await db.feedback.update_one(
            {"_id": feedback_id},
            {
                "$set": {
                    "assigned_to": assigned_to,
                    "status": "in_review",
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy feedback"
            )
        
        return {
            "status": "success",
            "message": f"Feedback đã được giao cho {assigned_to}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể giao feedback: {str(e)}"
        )

@router.post("/dashboard/feedback/{feedback_id}/resolve", response_model=Dict[str, str])
async def resolve_feedback(
    feedback_id: str,
    resolution_notes: str,
    current_user: dict = Depends(get_current_user)
):
    """Đánh dấu feedback đã được giải quyết"""
    try:
        db = get_database()
        
        result = await db.feedback.update_one(
            {"_id": feedback_id},
            {
                "$set": {
                    "status": "resolved",
                    "resolution_notes": resolution_notes,
                    "resolved_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy feedback"
            )
        
        return {
            "status": "success",
            "message": "Feedback đã được đánh dấu là đã giải quyết"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể giải quyết feedback: {str(e)}"
        )

@router.get("/dashboard/export-feedback", response_model=Dict[str, str])
async def export_feedback(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    format: str = Query("json", regex="^(json|csv)$"),
    current_user: dict = Depends(get_current_user)
):
    """Xuất feedback ra file"""
    try:
        db = get_database()
        
        # Build query
        query = {}
        if start_date:
            query["created_at"] = {"$gte": start_date}
        if end_date:
            if "created_at" in query:
                query["created_at"]["$lte"] = end_date
            else:
                query["created_at"] = {"$lte": end_date}
        
        # Get feedback
        feedback_list = await db.feedback.find(query).sort("created_at", -1).to_list(length=None)
        
        if format == "json":
            # Return JSON data
            return {
                "status": "success",
                "message": f"Đã xuất {len(feedback_list)} feedback",
                "data": feedback_list,
                "exported_at": datetime.utcnow()
            }
        else:
            # For CSV, you would typically generate a CSV file
            # This is a simplified version
            return {
                "status": "success",
                "message": f"Đã xuất {len(feedback_list)} feedback ra CSV",
                "count": len(feedback_list),
                "exported_at": datetime.utcnow()
            }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể xuất feedback: {str(e)}"
        )
