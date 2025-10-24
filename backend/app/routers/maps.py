from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from app.services.maps_service import MapsService
from app.utils.auth import get_current_user_optional

router = APIRouter()

class SearchRequest(BaseModel):
    query: str
    location: Optional[Dict[str, float]] = None
    radius: int = 5000

class DirectionsRequest(BaseModel):
    origin: str
    destination: str
    mode: str = "driving"

@router.get("/search", response_model=List[Dict[str, Any]])
async def search_places(
    query: str = Query(..., description="Search query for places"),
    lat: Optional[float] = Query(None, description="Latitude for location-based search"),
    lng: Optional[float] = Query(None, description="Longitude for location-based search"),
    radius: int = Query(5000, description="Search radius in meters"),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Search for places using Google Maps API"""
    try:
        maps_service = MapsService()
        
        location = None
        if lat is not None and lng is not None:
            location = {"lat": lat, "lng": lng}
        
        places = await maps_service.search_places(query, location, radius)
        
        return places
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search places: {str(e)}"
        )

@router.get("/place/{place_id}", response_model=Dict[str, Any])
async def get_place_details(
    place_id: str,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Get detailed information about a place"""
    try:
        maps_service = MapsService()
        
        place_details = await maps_service.get_place_details(place_id)
        
        if not place_details:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Place not found"
            )
        
        return place_details
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get place details: {str(e)}"
        )

@router.post("/directions", response_model=Dict[str, Any])
async def get_directions(
    request: DirectionsRequest,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Get directions between two points"""
    try:
        maps_service = MapsService()
        
        directions = await maps_service.get_directions(
            request.origin,
            request.destination,
            request.mode
        )
        
        if not directions:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No directions found"
            )
        
        return directions
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get directions: {str(e)}"
        )

@router.get("/geocode", response_model=Dict[str, float])
async def geocode_address(
    address: str = Query(..., description="Address to geocode"),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Convert address to coordinates"""
    try:
        maps_service = MapsService()
        
        coordinates = await maps_service.geocode_address(address)
        
        if not coordinates:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Address not found"
            )
        
        return coordinates
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to geocode address: {str(e)}"
        )

@router.get("/nearby", response_model=List[Dict[str, Any]])
async def get_nearby_places(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    type: str = Query("restaurant", description="Type of place to search for"),
    radius: int = Query(1000, description="Search radius in meters"),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Get nearby places of a specific type"""
    try:
        maps_service = MapsService()
        
        location = {"lat": lat, "lng": lng}
        places = await maps_service.search_places(type, location, radius)
        
        return places
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get nearby places: {str(e)}"
        )

# ==================== SERPAPI ENDPOINTS ====================

@router.get("/coffee", response_model=List[Dict[str, Any]])
async def search_coffee_shops(
    lat: Optional[float] = Query(None, description="Latitude for location-based search"),
    lng: Optional[float] = Query(None, description="Longitude for location-based search"),
    radius: int = Query(5000, description="Search radius in meters"),
    min_rating: float = Query(4.0, description="Minimum rating to filter results"),
    limit: int = Query(20, description="Maximum number of results"),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Tìm kiếm các quán cà phê sử dụng SerpAPI"""
    try:
        maps_service = MapsService()
        
        location = None
        if lat is not None and lng is not None:
            location = {"lat": lat, "lng": lng}
        
        coffee_shops = await maps_service.search_coffee_shops(
            location=location,
            radius=radius,
            min_rating=min_rating,
            limit=limit
        )
        
        return coffee_shops
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search coffee shops: {str(e)}"
        )

@router.get("/restaurants", response_model=List[Dict[str, Any]])
async def search_restaurants(
    lat: Optional[float] = Query(None, description="Latitude for location-based search"),
    lng: Optional[float] = Query(None, description="Longitude for location-based search"),
    radius: int = Query(5000, description="Search radius in meters"),
    min_rating: float = Query(4.0, description="Minimum rating to filter results"),
    limit: int = Query(20, description="Maximum number of results"),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Tìm kiếm nhà hàng sử dụng SerpAPI"""
    try:
        maps_service = MapsService()
        
        location = None
        if lat is not None and lng is not None:
            location = {"lat": lat, "lng": lng}
        
        restaurants = await maps_service.search_restaurants(
            location=location,
            radius=radius,
            min_rating=min_rating,
            limit=limit
        )
        
        return restaurants
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search restaurants: {str(e)}"
        )

@router.get("/hotels", response_model=List[Dict[str, Any]])
async def search_hotels(
    lat: Optional[float] = Query(None, description="Latitude for location-based search"),
    lng: Optional[float] = Query(None, description="Longitude for location-based search"),
    radius: int = Query(10000, description="Search radius in meters"),
    min_rating: float = Query(4.0, description="Minimum rating to filter results"),
    limit: int = Query(20, description="Maximum number of results"),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Tìm kiếm khách sạn sử dụng SerpAPI"""
    try:
        maps_service = MapsService()
        
        location = None
        if lat is not None and lng is not None:
            location = {"lat": lat, "lng": lng}
        
        hotels = await maps_service.search_hotels(
            location=location,
            radius=radius,
            min_rating=min_rating,
            limit=limit
        )
        
        return hotels
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search hotels: {str(e)}"
        )

@router.get("/attractions", response_model=List[Dict[str, Any]])
async def search_attractions(
    lat: Optional[float] = Query(None, description="Latitude for location-based search"),
    lng: Optional[float] = Query(None, description="Longitude for location-based search"),
    radius: int = Query(10000, description="Search radius in meters"),
    min_rating: float = Query(4.0, description="Minimum rating to filter results"),
    limit: int = Query(20, description="Maximum number of results"),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Tìm kiếm điểm tham quan sử dụng SerpAPI"""
    try:
        maps_service = MapsService()
        
        location = None
        if lat is not None and lng is not None:
            location = {"lat": lat, "lng": lng}
        
        attractions = await maps_service.search_attractions(
            location=location,
            radius=radius,
            min_rating=min_rating,
            limit=limit
        )
        
        return attractions
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search attractions: {str(e)}"
        )

@router.get("/place/{place_id}/reviews", response_model=List[Dict[str, Any]])
async def get_place_reviews(
    place_id: str,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Lấy đánh giá của một địa điểm"""
    try:
        maps_service = MapsService()
        
        reviews = await maps_service.get_place_reviews(place_id)
        
        return reviews
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get place reviews: {str(e)}"
        )

@router.get("/categories", response_model=List[str])
async def get_place_categories():
    """Get available place categories"""
    return [
        "restaurant",
        "tourist_attraction",
        "lodging",
        "shopping_mall",
        "gas_station",
        "hospital",
        "bank",
        "atm",
        "pharmacy",
        "police",
        "fire_station",
        "post_office",
        "library",
        "museum",
        "park",
        "zoo",
        "aquarium",
        "amusement_park",
        "casino",
        "night_club",
        "bar",
        "cafe",
        "coffee_shop",
        "food",
        "store",
        "clothing_store",
        "electronics_store",
        "furniture_store",
        "home_goods_store",
        "jewelry_store",
        "shoe_store",
        "book_store",
        "bicycle_store",
        "car_dealer",
        "car_rental",
        "car_repair",
        "car_wash",
        "parking",
        "subway_station",
        "bus_station",
        "airport",
        "train_station",
        "taxi_stand"
    ]
