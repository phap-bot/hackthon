from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class TravelType(str, Enum):
    RELAXATION = "relaxation"
    EXPLORATION = "exploration" 
    ADVENTURE = "adventure"
    CULTURE = "culture"

class DreamDestination(str, Enum):
    BEACH = "beach"
    MOUNTAINS = "mountains"
    CITY = "city"
    COUNTRYSIDE = "countryside"

class Activity(str, Enum):
    FOOD = "food"
    SHOPPING = "shopping"
    TREKKING = "trekking"
    DIVING = "diving"
    PHOTOGRAPHY = "photography"

class BudgetLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    LUXURY = "luxury"

class UserPreferences(BaseModel):
    """User travel preferences"""
    user_id: str
    travel_types: List[TravelType] = []
    dream_destinations: List[DreamDestination] = []
    activities: List[Activity] = []
    budget_level: Optional[BudgetLevel] = None
    trip_duration_preference: Optional[str] = None  # "short", "medium", "long"
    group_size_preference: Optional[str] = None  # "solo", "couple", "family", "group"
    accommodation_preference: Optional[str] = None  # "hotel", "hostel", "airbnb", "resort"
    transportation_preference: Optional[str] = None  # "flight", "train", "bus", "car"
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class UserPreferencesCreate(BaseModel):
    """Create user preferences"""
    travel_types: List[TravelType] = []
    dream_destinations: List[DreamDestination] = []
    activities: List[Activity] = []
    budget_level: Optional[BudgetLevel] = None
    trip_duration_preference: Optional[str] = None
    group_size_preference: Optional[str] = None
    accommodation_preference: Optional[str] = None
    transportation_preference: Optional[str] = None

class UserPreferencesUpdate(BaseModel):
    """Update user preferences"""
    travel_types: Optional[List[TravelType]] = None
    dream_destinations: Optional[List[DreamDestination]] = None
    activities: Optional[List[Activity]] = None
    budget_level: Optional[BudgetLevel] = None
    trip_duration_preference: Optional[str] = None
    group_size_preference: Optional[str] = None
    accommodation_preference: Optional[str] = None
    transportation_preference: Optional[str] = None
