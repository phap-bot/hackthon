"""
Itinerary generation router using Ollama AI
"""
from fastapi import APIRouter, HTTPException
from app.core.agent import generate_itinerary
from app.core.geo_utils import get_nearby_places
from app.core.schema import GenerateItineraryReq, Itinerary
from typing import Dict, Any

router = APIRouter(prefix="/api/itinerary", tags=["Itinerary (AI)"])

DEFAULT_LOCATION = {"lat": 13.782, "lon": 109.219}  #(fallback)


@router.post("/generate", response_model=Dict[str, Any])
async def create_itinerary(payload: GenerateItineraryReq):
    """
    Generate itinerary using AI (Ollama) + Geoapify places
    """
    try:
        prefs = payload.preferences.dict()
        loc = payload.location.dict() if payload.location else DEFAULT_LOCATION

        # Get nearby places
        nearby_places = get_nearby_places(
            lat=loc["lat"],
            lon=loc["lon"],
            prefs=prefs,
            radius=8000,
            limit=20
        )

        # Generate itinerary
        plan = generate_itinerary(prefs, nearby_places)

        return {
            "success": True,
            "data": plan,
            "meta": {
                "nearby_count": len(nearby_places),
                "location": loc
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating itinerary: {str(e)}")


@router.get("/{itinerary_id}")
async def get_itinerary(itinerary_id: str):
    """
    Get itinerary by ID (placeholder for future implementation)
    """
    return {
        "id": itinerary_id,
        "message": "This endpoint will load itinerary from database",
        "note": "Implement database integration here"
    }

