"""
Schema definitions for itinerary generation
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class Location(BaseModel):
    lat: float
    lon: float


class Preferences(BaseModel):
    budget: str = Field(..., description="Tiết kiệm | Trung bình | Cao cấp")
    days: int
    region: str
    theme: str
    transport: str
    people: int


class GenerateItineraryReq(BaseModel):
    preferences: Preferences
    location: Optional[Location] = None  # Nếu thiếu sẽ dùng default/fallback


class Activity(BaseModel):
    time: str
    place: str
    desc: str
    cost: Optional[float] = None
    cost_note: Optional[str] = None


class DayPlan(BaseModel):
    day: int
    title: str
    activities: List[Activity]


class Itinerary(BaseModel):
    overview: str
    schedule: List[DayPlan]
    total_cost_estimate: str
    nearby_count: Optional[int] = 0
    location: Optional[Location] = None

