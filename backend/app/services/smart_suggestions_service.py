import os
import httpx
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import json
from functools import lru_cache

from app.services.geoapify_service import GeoapifyService
from app.services.serpapi_service import SerpAPIService

class SmartSuggestionsService:
    def __init__(self):
        self.geoapify_service = GeoapifyService()
        self.serpapi_service = SerpAPIService()
        
        # Simple in-memory cache (can be replaced with Redis)
        self.cache = {}
        self.cache_ttl = 3600  # 1 hour

    async def get_smart_suggestions(
        self,
        lat: float,
        lng: float,
        category: str = "catering.restaurant",
        radius: int = 5000,
        limit: int = 10
    ) -> Dict[str, Any]:
        """
        Lấy gợi ý địa điểm thông minh kết hợp Geoapify + SerpAPI
        
        Args:
            lat: Latitude
            lng: Longitude
            category: Loại địa điểm
            radius: Bán kính tìm kiếm (m)
            limit: Số lượng kết quả
        
        Returns:
            Dict với suggestions và metadata
        """
        cache_key = f"suggestions_{lat}_{lng}_{category}_{radius}_{limit}"
        
        # Check cache
        if cache_key in self.cache:
            cached_data, timestamp = self.cache[cache_key]
            if datetime.now() - timestamp < timedelta(seconds=self.cache_ttl):
                print(f"📦 Using cached suggestions for {category}")
                return cached_data

        try:
            print(f"🔍 Getting smart suggestions for {category} at {lat},{lng}")
            
            # Step 1: Get places from Geoapify
            geoapify_places = await self.geoapify_service.get_nearby_places(
                lat=lat,
                lng=lng,
                categories=[category],
                radius=radius,
                limit=limit * 2  # Get more to filter later
            )
            
            if not geoapify_places:
                print("⚠️ No places found from Geoapify")
                return self._get_empty_result()

            print(f"📍 Found {len(geoapify_places)} places from Geoapify")

            # Step 2: Get detailed info from SerpAPI
            serpapi_places = await self.serpapi_service.get_multiple_places_details(
                geoapify_places
            )
            
            print(f"⭐ Got details for {len(serpapi_places)} places from SerpAPI")

            # Step 3: Filter and sort by rating
            filtered_places = self._filter_and_sort_places(serpapi_places, limit)
            
            # Step 4: Categorize by rating
            categorized = self._categorize_by_rating(filtered_places)
            
            result = {
                "suggestions": filtered_places,
                "high_rated": categorized["high_rated"],  # rating >= 4.5
                "good_rated": categorized["good_rated"],  # rating >= 4.0
                "total_found": len(filtered_places),
                "category": category,
                "location": {"lat": lat, "lng": lng},
                "radius": radius,
                "timestamp": datetime.now().isoformat()
            }
            
            # Cache result
            self.cache[cache_key] = (result, datetime.now())
            
            print(f"✅ Smart suggestions ready: {len(filtered_places)} places")
            return result
            
        except Exception as e:
            print(f"❌ Error getting smart suggestions: {e}")
            return self._get_empty_result()

    def _filter_and_sort_places(
        self,
        places: List[Dict[str, Any]],
        limit: int
    ) -> List[Dict[str, Any]]:
        """Lọc và sắp xếp địa điểm theo rating"""
        
        # Filter out places with very low ratings
        filtered = [p for p in places if p.get("rating", 0) >= 3.5]
        
        # Sort by rating (descending), then by reviews count
        sorted_places = sorted(
            filtered,
            key=lambda x: (x.get("rating", 0), x.get("reviews_count", 0)),
            reverse=True
        )
        
        return sorted_places[:limit]

    def _categorize_by_rating(self, places: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """Phân loại địa điểm theo rating"""
        high_rated = [p for p in places if p.get("rating", 0) >= 4.5]
        good_rated = [p for p in places if p.get("rating", 0) >= 4.0]
        
        return {
            "high_rated": high_rated,
            "good_rated": good_rated
        }

    def _get_empty_result(self) -> Dict[str, Any]:
        """Kết quả trống khi không tìm thấy địa điểm"""
        return {
            "suggestions": [],
            "high_rated": [],
            "good_rated": [],
            "total_found": 0,
            "category": "",
            "location": {"lat": 0, "lng": 0},
            "radius": 0,
            "timestamp": datetime.now().isoformat()
        }

    async def get_place_details_enhanced(
        self,
        place_id: str,
        lat: float,
        lng: float,
        name: str
    ) -> Optional[Dict[str, Any]]:
        """
        Lấy chi tiết địa điểm với SerpAPI enhancement
        
        Args:
            place_id: Place ID
            lat: Latitude
            lng: Longitude
            name: Place name
        
        Returns:
            Enhanced place details
        """
        try:
            # Get basic info from Geoapify
            geoapify_details = await self.geoapify_service.get_place_details(place_id)
            
            if not geoapify_details:
                return None
            
            # Enhance with SerpAPI
            serpapi_details = await self.serpapi_service.get_place_details(name, lat, lng, place_id)
            
            if serpapi_details:
                # Merge data (SerpAPI takes priority for rating/reviews)
                enhanced = {**geoapify_details, **serpapi_details}
                return enhanced
            else:
                return geoapify_details
                
        except Exception as e:
            print(f"Error getting enhanced place details: {e}")
            return None

    def clear_cache(self):
        """Xóa cache"""
        self.cache.clear()
        print("🗑️ Cache cleared")

    def get_cache_stats(self) -> Dict[str, Any]:
        """Thống kê cache"""
        return {
            "cache_size": len(self.cache),
            "cache_ttl": self.cache_ttl,
            "cached_keys": list(self.cache.keys())
        }
