from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
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
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")
        return field_schema

class BudgetType(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    LUXURY = "luxury"

class TravelStyle(str, Enum):
    ADVENTURE = "adventure"
    RELAXATION = "relaxation"
    CULTURE = "culture"
    FOOD = "food"
    NATURE = "nature"
    COMFORT = "comfort"

class TripStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class ActivityType(str, Enum):
    ATTRACTION = "attraction"
    RESTAURANT = "restaurant"
    HOTEL = "hotel"
    TRANSPORT = "transport"
    SHOPPING = "shopping"
    ENTERTAINMENT = "entertainment"

# User Models
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    avatar_url: Optional[str] = None

class User(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    avatar_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Trip Models
class TripBase(BaseModel):
    destination: str = Field(..., min_length=2, max_length=200)
    start_date: date
    end_date: date
    people: int = Field(..., ge=1, le=20)
    budget: BudgetType
    travel_style: TravelStyle
    interests: List[str] = []
    language: str = Field("vi", description="Ngôn ngữ cho AI response")  # Mặc định tiếng Việt

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    destination: Optional[str] = Field(None, min_length=2, max_length=200)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    people: Optional[int] = Field(None, ge=1, le=20)
    budget: Optional[BudgetType] = None
    travel_style: Optional[TravelStyle] = None
    interests: Optional[List[str]] = None
    status: Optional[TripStatus] = None

class Trip(TripBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    total_days: int
    total_cost: float = 0.0
    status: TripStatus = TripStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Activity Models
class ActivityBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    type: ActivityType
    time: str = Field(..., pattern=r'^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')
    duration: str = Field(..., min_length=1, max_length=50)
    cost: float = Field(0.0, ge=0)
    description: Optional[str] = None
    location: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    coordinates: Optional[Dict[str, float]] = None

class ActivityCreate(ActivityBase):
    trip_id: PyObjectId
    day: int = Field(..., ge=1)

class ActivityUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    type: Optional[ActivityType] = None
    time: Optional[str] = Field(None, pattern=r'^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')
    duration: Optional[str] = Field(None, min_length=1, max_length=50)
    cost: Optional[float] = Field(None, ge=0)
    description: Optional[str] = None
    location: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    coordinates: Optional[Dict[str, float]] = None

class Activity(ActivityBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    trip_id: PyObjectId
    day: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Feedback Models
class FeedbackBase(BaseModel):
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

class FeedbackCreate(FeedbackBase):
    trip_id: PyObjectId

class Feedback(FeedbackBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    trip_id: PyObjectId
    user_id: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Map Models
class MapLocationBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    category: str = Field(..., min_length=2, max_length=50)
    coordinates: Dict[str, float] = Field(..., min_items=2, max_items=2)
    address: Optional[str] = None
    description: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    price_level: Optional[int] = Field(None, ge=1, le=4)

class MapLocationCreate(MapLocationBase):
    pass

class MapLocation(MapLocationBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Response Models
class TripResponse(BaseModel):
    trip_id: str
    status: str
    message: str

class ItineraryResponse(BaseModel):
    trip_id: str
    destination: str
    total_days: int
    total_cost: float
    start_date: date
    end_date: date
    days: List[Dict[str, Any]]
    summary: Dict[str, Any]

class FeedbackResponse(BaseModel):
    status: str
    message: str
    feedback_id: str

class AdminStatsResponse(BaseModel):
    total_trips: int
    completed_trips: int
    total_revenue: float
    average_rating: float
    active_users: int

# WebSocket Models
class WebSocketMessage(BaseModel):
    type: str
    data: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class LocationUpdate(BaseModel):
    user_id: str
    trip_id: str
    coordinates: Dict[str, float]
    timestamp: datetime = Field(default_factory=datetime.utcnow)
