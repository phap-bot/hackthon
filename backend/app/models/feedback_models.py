from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any, Union
from datetime import datetime, date
from enum import Enum
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# Feedback Types
class FeedbackType(str, Enum):
    TRIP_FEEDBACK = "trip_feedback"  # Feedback về chuyến đi
    SERVICE_FEEDBACK = "service_feedback"  # Feedback về dịch vụ
    FEATURE_REQUEST = "feature_request"  # Yêu cầu tính năng mới
    BUG_REPORT = "bug_report"  # Báo cáo lỗi
    GENERAL_FEEDBACK = "general_feedback"  # Feedback chung
    COMPLAINT = "complaint"  # Khiếu nại
    COMPLIMENT = "compliment"  # Khen ngợi

class FeedbackPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class FeedbackStatus(str, Enum):
    PENDING = "pending"
    IN_REVIEW = "in_review"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"
    REJECTED = "rejected"

class FeedbackCategory(str, Enum):
    USER_EXPERIENCE = "user_experience"
    PERFORMANCE = "performance"
    DESIGN = "design"
    FUNCTIONALITY = "functionality"
    CONTENT = "content"
    SUPPORT = "support"
    PRICING = "pricing"
    OTHER = "other"

# Enhanced Feedback Models
class FeedbackBase(BaseModel):
    feedback_type: FeedbackType
    category: FeedbackCategory
    priority: FeedbackPriority = FeedbackPriority.MEDIUM
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10, max_length=2000)
    rating: Optional[int] = Field(None, ge=1, le=5)
    tags: List[str] = []
    language: str = Field("vi", description="Ngôn ngữ của feedback")
    is_anonymous: bool = False
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None

class TripFeedbackCreate(FeedbackBase):
    trip_id: PyObjectId
    overall_rating: int = Field(..., ge=1, le=5)
    value_for_money: int = Field(..., ge=1, le=5)
    itinerary_quality: int = Field(..., ge=1, le=5)
    accommodation_rating: int = Field(..., ge=1, le=5)
    food_rating: int = Field(..., ge=1, le=5)
    transportation_rating: int = Field(..., ge=1, le=5)
    attractions_rating: int = Field(..., ge=1, le=5)
    would_recommend: bool
    favorite_activity: Optional[str] = None
    least_favorite_activity: Optional[str] = None
    suggestions: Optional[str] = None
    additional_comments: Optional[str] = None

class ServiceFeedbackCreate(FeedbackBase):
    service_name: str = Field(..., min_length=2, max_length=100)
    service_rating: int = Field(..., ge=1, le=5)
    response_time: Optional[int] = None  # Thời gian phản hồi (phút)
    helpfulness: Optional[int] = Field(None, ge=1, le=5)
    professionalism: Optional[int] = Field(None, ge=1, le=5)

class FeatureRequestCreate(FeedbackBase):
    feature_name: str = Field(..., min_length=5, max_length=100)
    use_case: str = Field(..., min_length=10, max_length=500)
    expected_benefit: str = Field(..., min_length=10, max_length=500)
    urgency: FeedbackPriority = FeedbackPriority.MEDIUM

class BugReportCreate(FeedbackBase):
    bug_description: str = Field(..., min_length=10, max_length=1000)
    steps_to_reproduce: str = Field(..., min_length=10, max_length=1000)
    expected_behavior: str = Field(..., min_length=10, max_length=500)
    actual_behavior: str = Field(..., min_length=10, max_length=500)
    browser_info: Optional[str] = None
    device_info: Optional[str] = None
    screenshot_urls: List[str] = []

class GeneralFeedbackCreate(FeedbackBase):
    pass

class FeedbackCreate(BaseModel):
    feedback_type: FeedbackType
    data: Union[TripFeedbackCreate, ServiceFeedbackCreate, FeatureRequestCreate, BugReportCreate, GeneralFeedbackCreate]

class FeedbackUpdate(BaseModel):
    status: Optional[FeedbackStatus] = None
    priority: Optional[FeedbackPriority] = None
    assigned_to: Optional[str] = None
    admin_notes: Optional[str] = None
    resolution_notes: Optional[str] = None
    tags: Optional[List[str]] = None

class FeedbackResponse(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: Optional[PyObjectId] = None
    trip_id: Optional[PyObjectId] = None
    feedback_type: FeedbackType
    category: FeedbackCategory
    priority: FeedbackPriority
    status: FeedbackStatus
    title: str
    description: str
    rating: Optional[int] = None
    tags: List[str] = []
    language: str
    is_anonymous: bool
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    
    # Specific feedback data
    feedback_data: Dict[str, Any] = {}
    
    # Admin fields
    assigned_to: Optional[str] = None
    admin_notes: Optional[str] = None
    resolution_notes: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None
    
    # Analytics
    view_count: int = 0
    like_count: int = 0
    reply_count: int = 0

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Feedback Analytics Models
class FeedbackAnalytics(BaseModel):
    total_feedback: int
    feedback_by_type: Dict[str, int]
    feedback_by_status: Dict[str, int]
    feedback_by_priority: Dict[str, int]
    feedback_by_category: Dict[str, int]
    average_rating: float
    rating_distribution: Dict[str, int]
    monthly_trend: List[Dict[str, Any]]
    top_tags: List[Dict[str, Any]]
    response_time_stats: Dict[str, float]

class FeedbackInsights(BaseModel):
    sentiment_analysis: Dict[str, Any]
    common_issues: List[Dict[str, Any]]
    feature_requests: List[Dict[str, Any]]
    improvement_suggestions: List[str]
    customer_satisfaction_score: float
    net_promoter_score: float

# Feedback Reply Models
class FeedbackReply(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    feedback_id: PyObjectId
    user_id: PyObjectId
    content: str = Field(..., min_length=1, max_length=1000)
    is_admin_reply: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Feedback Vote Models
class FeedbackVote(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    feedback_id: PyObjectId
    user_id: PyObjectId
    vote_type: str = Field(..., regex="^(up|down)$")  # up or down
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Auto Improvement Models
class ImprovementSuggestion(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    feedback_id: PyObjectId
    suggestion_type: str  # feature, bug_fix, ui_improvement, etc.
    title: str
    description: str
    priority: FeedbackPriority
    estimated_effort: str  # low, medium, high
    impact_score: float = Field(..., ge=0, le=10)
    feasibility_score: float = Field(..., ge=0, le=10)
    status: str = "pending"  # pending, approved, rejected, implemented
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
