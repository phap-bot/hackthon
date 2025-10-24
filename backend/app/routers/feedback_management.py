from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.models import (
    FeedbackCreate, FeedbackUpdate, FeedbackResponse, 
    FeedbackAnalytics, FeedbackInsights, FeedbackReply,
    FeedbackType, FeedbackStatus, FeedbackPriority
)
from app.database import get_database
from app.utils.auth import get_current_user, get_current_user_optional
from app.services.feedback_analytics_service import FeedbackAnalyticsService
from app.services.auto_improvement_service import AutoImprovementService

router = APIRouter()

class FeedbackCreateRequest(BaseModel):
    feedback_type: FeedbackType
    category: str
    priority: FeedbackPriority = FeedbackPriority.MEDIUM
    title: str
    description: str
    rating: Optional[int] = None
    tags: List[str] = []
    language: str = "vi"
    is_anonymous: bool = False
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    trip_id: Optional[str] = None
    feedback_data: Dict[str, Any] = {}

@router.post("/feedback", response_model=Dict[str, str])
async def create_feedback(
    feedback_request: FeedbackCreateRequest,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Tạo feedback mới"""
    try:
        db = get_database()
        
        # Prepare feedback document
        feedback_doc = {
            "user_id": current_user["user_id"] if current_user else None,
            "trip_id": feedback_request.trip_id,
            "feedback_type": feedback_request.feedback_type,
            "category": feedback_request.category,
            "priority": feedback_request.priority,
            "status": FeedbackStatus.PENDING,
            "title": feedback_request.title,
            "description": feedback_request.description,
            "rating": feedback_request.rating,
            "tags": feedback_request.tags,
            "language": feedback_request.language,
            "is_anonymous": feedback_request.is_anonymous,
            "contact_email": feedback_request.contact_email,
            "contact_phone": feedback_request.contact_phone,
            "feedback_data": feedback_request.feedback_data,
            "assigned_to": None,
            "admin_notes": None,
            "resolution_notes": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "resolved_at": None,
            "view_count": 0,
            "like_count": 0,
            "reply_count": 0
        }
        
        # Insert feedback
        result = await db.feedback.insert_one(feedback_doc)
        feedback_id = str(result.inserted_id)
        
        # Generate auto improvement suggestions
        auto_improvement_service = AutoImprovementService()
        await auto_improvement_service.analyze_feedback_for_improvements(feedback_id)
        
        return {
            "status": "success",
            "message": "Feedback đã được gửi thành công",
            "feedback_id": feedback_id
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể tạo feedback: {str(e)}"
        )

@router.get("/feedback", response_model=List[FeedbackResponse])
async def get_feedback_list(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    feedback_type: Optional[FeedbackType] = None,
    status: Optional[FeedbackStatus] = None,
    priority: Optional[FeedbackPriority] = None,
    language: str = "vi",
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Lấy danh sách feedback"""
    try:
        db = get_database()
        
        # Build query
        query = {}
        if feedback_type:
            query["feedback_type"] = feedback_type
        if status:
            query["status"] = status
        if priority:
            query["priority"] = priority
        if language:
            query["language"] = language
        
        # Get feedback list
        feedback_list = await db.feedback.find(query).skip(skip).limit(limit).sort("created_at", -1).to_list(length=None)
        
        # Convert to response format
        response_list = []
        for fb in feedback_list:
            response_list.append(FeedbackResponse(**fb))
        
        return response_list
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể lấy danh sách feedback: {str(e)}"
        )

@router.get("/feedback/{feedback_id}", response_model=FeedbackResponse)
async def get_feedback_detail(
    feedback_id: str,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Lấy chi tiết feedback"""
    try:
        db = get_database()
        
        # Get feedback
        feedback = await db.feedback.find_one({"_id": feedback_id})
        
        if not feedback:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy feedback"
            )
        
        # Increment view count
        await db.feedback.update_one(
            {"_id": feedback_id},
            {"$inc": {"view_count": 1}}
        )
        
        return FeedbackResponse(**feedback)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể lấy chi tiết feedback: {str(e)}"
        )

@router.put("/feedback/{feedback_id}", response_model=Dict[str, str])
async def update_feedback(
    feedback_id: str,
    feedback_update: FeedbackUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Cập nhật feedback (chỉ admin)"""
    try:
        db = get_database()
        
        # Check if feedback exists
        feedback = await db.feedback.find_one({"_id": feedback_id})
        if not feedback:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy feedback"
            )
        
        # Update feedback
        update_data = {
            **feedback_update.dict(exclude_unset=True),
            "updated_at": datetime.utcnow()
        }
        
        if feedback_update.status == FeedbackStatus.RESOLVED:
            update_data["resolved_at"] = datetime.utcnow()
        
        result = await db.feedback.update_one(
            {"_id": feedback_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy feedback"
            )
        
        return {
            "status": "success",
            "message": "Feedback đã được cập nhật thành công"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể cập nhật feedback: {str(e)}"
        )

@router.delete("/feedback/{feedback_id}", response_model=Dict[str, str])
async def delete_feedback(
    feedback_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Xóa feedback (chỉ admin)"""
    try:
        db = get_database()
        
        # Delete feedback
        result = await db.feedback.delete_one({"_id": feedback_id})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy feedback"
            )
        
        # Delete related data
        await db.feedback_replies.delete_many({"feedback_id": feedback_id})
        await db.feedback_votes.delete_many({"feedback_id": feedback_id})
        await db.improvement_suggestions.delete_many({"feedback_id": feedback_id})
        
        return {
            "status": "success",
            "message": "Feedback đã được xóa thành công"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể xóa feedback: {str(e)}"
        )

@router.post("/feedback/{feedback_id}/vote", response_model=Dict[str, str])
async def vote_feedback(
    feedback_id: str,
    vote_type: str = Query(..., regex="^(up|down)$"),
    current_user: dict = Depends(get_current_user)
):
    """Vote cho feedback"""
    try:
        db = get_database()
        
        # Check if user already voted
        existing_vote = await db.feedback_votes.find_one({
            "feedback_id": feedback_id,
            "user_id": current_user["user_id"]
        })
        
        if existing_vote:
            if existing_vote["vote_type"] == vote_type:
                # Remove vote
                await db.feedback_votes.delete_one({"_id": existing_vote["_id"]})
                await db.feedback.update_one(
                    {"_id": feedback_id},
                    {"$inc": {"like_count": -1 if vote_type == "up" else 0}}
                )
                return {
                    "status": "success",
                    "message": "Vote đã được hủy"
                }
            else:
                # Update vote
                await db.feedback_votes.update_one(
                    {"_id": existing_vote["_id"]},
                    {"$set": {"vote_type": vote_type}}
                )
        else:
            # Create new vote
            await db.feedback_votes.insert_one({
                "feedback_id": feedback_id,
                "user_id": current_user["user_id"],
                "vote_type": vote_type,
                "created_at": datetime.utcnow()
            })
        
        # Update feedback like count
        await db.feedback.update_one(
            {"_id": feedback_id},
            {"$inc": {"like_count": 1 if vote_type == "up" else 0}}
        )
        
        return {
            "status": "success",
            "message": f"Vote {vote_type} đã được ghi nhận"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể vote feedback: {str(e)}"
        )

@router.post("/feedback/{feedback_id}/reply", response_model=Dict[str, str])
async def reply_to_feedback(
    feedback_id: str,
    content: str,
    current_user: dict = Depends(get_current_user)
):
    """Trả lời feedback"""
    try:
        db = get_database()
        
        # Check if feedback exists
        feedback = await db.feedback.find_one({"_id": feedback_id})
        if not feedback:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy feedback"
            )
        
        # Create reply
        reply_doc = {
            "feedback_id": feedback_id,
            "user_id": current_user["user_id"],
            "content": content,
            "is_admin_reply": False,  # Can be determined by user role
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        await db.feedback_replies.insert_one(reply_doc)
        
        # Update feedback reply count
        await db.feedback.update_one(
            {"_id": feedback_id},
            {"$inc": {"reply_count": 1}}
        )
        
        return {
            "status": "success",
            "message": "Phản hồi đã được gửi thành công"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể gửi phản hồi: {str(e)}"
        )

@router.get("/feedback/{feedback_id}/replies", response_model=List[FeedbackReply])
async def get_feedback_replies(
    feedback_id: str,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Lấy danh sách phản hồi cho feedback"""
    try:
        db = get_database()
        
        replies = await db.feedback_replies.find({"feedback_id": feedback_id}).sort("created_at", 1).to_list(length=None)
        
        return [FeedbackReply(**reply) for reply in replies]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể lấy danh sách phản hồi: {str(e)}"
        )

@router.get("/feedback/analytics", response_model=FeedbackAnalytics)
async def get_feedback_analytics(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: dict = Depends(get_current_user)
):
    """Lấy analytics về feedback"""
    try:
        analytics_service = FeedbackAnalyticsService()
        analytics = await analytics_service.get_feedback_analytics(start_date, end_date)
        
        return analytics
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể lấy analytics: {str(e)}"
        )

@router.get("/feedback/insights", response_model=FeedbackInsights)
async def get_feedback_insights(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: dict = Depends(get_current_user)
):
    """Lấy insights từ feedback"""
    try:
        analytics_service = FeedbackAnalyticsService()
        insights = await analytics_service.get_feedback_insights(start_date, end_date)
        
        return insights
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể lấy insights: {str(e)}"
        )

@router.get("/feedback/improvement-roadmap", response_model=Dict[str, Any])
async def get_improvement_roadmap(
    current_user: dict = Depends(get_current_user)
):
    """Lấy roadmap cải thiện dựa trên feedback"""
    try:
        auto_improvement_service = AutoImprovementService()
        roadmap = await auto_improvement_service.get_improvement_roadmap()
        
        return roadmap
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể lấy roadmap cải thiện: {str(e)}"
        )

@router.post("/feedback/improvement/{suggestion_id}/implement", response_model=Dict[str, str])
async def implement_improvement(
    suggestion_id: str,
    implementation_notes: str,
    current_user: dict = Depends(get_current_user)
):
    """Đánh dấu gợi ý cải thiện đã được thực hiện"""
    try:
        auto_improvement_service = AutoImprovementService()
        success = await auto_improvement_service.implement_improvement(suggestion_id, implementation_notes)
        
        if success:
            return {
                "status": "success",
                "message": "Gợi ý cải thiện đã được đánh dấu là đã thực hiện"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy gợi ý cải thiện"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể cập nhật gợi ý cải thiện: {str(e)}"
        )
