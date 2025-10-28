from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Dict, Any, Optional

from app.services.geoapify_service import GeoapifyService
from app.utils.auth import get_current_user_optional

router = APIRouter()

# ==================== GEOAPIFY ENDPOINTS ====================

@router.get("/geoapify/nearby", response_model=List[Dict[str, Any]])
async def get_nearby_places_geoapify(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    categories: str = Query("catering.restaurant,catering.cafe,tourism.sights", description="Comma-separated categories"),
    radius: int = Query(5000, description="Search radius in meters"),
    limit: int = Query(20, description="Maximum number of results"),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """🔍 Lấy danh sách địa điểm gần người dùng (Geoapify Places API v2)"""
    try:
        geoapify_service = GeoapifyService()
        category_list = [c.strip() for c in categories.split(",") if c.strip()]
        places = await geoapify_service.get_nearby_places(
            lat=lat,
            lng=lng,
            categories=category_list,
            radius=radius,
            limit=limit
        )
        return places
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Geoapify nearby error: {str(e)}"
        )


@router.get("/geoapify/reverse", response_model=Dict[str, Any])
async def reverse_geocode(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """📍 Lấy địa chỉ từ toạ độ (Reverse Geocode API)"""
    try:
        geoapify_service = GeoapifyService()
        address_data = await geoapify_service.reverse_geocode(lat, lng)

        if not address_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Address not found"
            )

        return address_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Geoapify reverse geocode failed: {str(e)}"
        )


@router.post("/geoapify/route", response_model=Dict[str, Any])
async def get_route_geoapify(
    request: Dict[str, Any],
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """🚗 Tính toán tuyến đường giữa các điểm (Geoapify Routing API)"""
    try:
        geoapify_service = GeoapifyService()
        waypoints = request.get("waypoints", [])
        mode = request.get("mode", "drive")

        if not waypoints or len(waypoints) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least 2 waypoints required"
            )

        route = await geoapify_service.get_route(waypoints, mode)

        if not route:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No route found"
            )

        return route
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Geoapify route failed: {str(e)}"
        )


@router.post("/geoapify/matrix", response_model=List[List[float]])
async def get_distance_matrix_geoapify(
    request: Dict[str, Any],
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """📊 Tính toán ma trận khoảng cách (Geoapify Route Matrix API)"""
    try:
        geoapify_service = GeoapifyService()
        origins = request.get("origins", [])
        destinations = request.get("destinations", [])
        mode = request.get("mode", "drive")

        if not origins or not destinations:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Origins and destinations required"
            )

        matrix = await geoapify_service.get_distance_matrix(origins, destinations, mode)

        if not matrix:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No matrix data found"
            )

        return matrix
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Geoapify matrix failed: {str(e)}"
        )
