import googlemaps
import os
from typing import Dict, List, Any, Optional
import asyncio
from datetime import datetime
from .serpapi_service import SerpAPIService

class MapsService:
    def __init__(self):
        self.gmaps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
        if self.gmaps_api_key:
            self.gmaps = googlemaps.Client(key=self.gmaps_api_key)
        else:
            self.gmaps = None
            print("Warning: No Google Maps API key found. Using SerpAPI as fallback.")
        
        # Khởi tạo SerpAPI service
        self.serpapi_service = SerpAPIService()
    
    async def search_places(self, query: str, location: Optional[Dict[str, float]] = None, radius: int = 5000) -> List[Dict[str, Any]]:
        """Search for places using Google Maps API"""
        try:
            if not self.gmaps:
                return self._get_mock_places(query)
            
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            places_result = await loop.run_in_executor(
                None,
                self._search_places_sync,
                query,
                location,
                radius
            )
            
            return self._format_places_result(places_result)
            
        except Exception as e:
            print(f"Maps API error: {e}")
            return self._get_mock_places(query)
    
    def _search_places_sync(self, query: str, location: Optional[Dict[str, float]], radius: int):
        """Synchronous search places"""
        if location:
            places_result = self.gmaps.places_nearby(
                location=location,
                radius=radius,
                keyword=query
            )
        else:
            places_result = self.gmaps.places(query=query)
        
        return places_result
    
    def _format_places_result(self, places_result: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Format places result from Google Maps API"""
        places = []
        
        for place in places_result.get('results', []):
            place_data = {
                "id": place.get('place_id'),
                "name": place.get('name'),
                "address": place.get('formatted_address'),
                "rating": place.get('rating'),
                "price_level": place.get('price_level'),
                "types": place.get('types', []),
                "coordinates": {
                    "lat": place['geometry']['location']['lat'],
                    "lng": place['geometry']['location']['lng']
                },
                "photos": place.get('photos', []),
                "opening_hours": place.get('opening_hours', {}),
                "vicinity": place.get('vicinity')
            }
            places.append(place_data)
        
        return places
    
    async def get_place_details(self, place_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed information about a place"""
        try:
            if not self.gmaps:
                return self._get_mock_place_details(place_id)
            
            loop = asyncio.get_event_loop()
            place_details = await loop.run_in_executor(
                None,
                self.gmaps.place,
                place_id,
                fields=['name', 'formatted_address', 'rating', 'price_level', 
                       'opening_hours', 'photos', 'reviews', 'website', 'phone_number']
            )
            
            return self._format_place_details(place_details)
            
        except Exception as e:
            print(f"Place details API error: {e}")
            return self._get_mock_place_details(place_id)
    
    def _format_place_details(self, place_details: Dict[str, Any]) -> Dict[str, Any]:
        """Format place details from Google Maps API"""
        result = place_details.get('result', {})
        
        return {
            "id": result.get('place_id'),
            "name": result.get('name'),
            "address": result.get('formatted_address'),
            "rating": result.get('rating'),
            "price_level": result.get('price_level'),
            "phone_number": result.get('formatted_phone_number'),
            "website": result.get('website'),
            "opening_hours": result.get('opening_hours', {}),
            "photos": result.get('photos', []),
            "reviews": result.get('reviews', []),
            "coordinates": {
                "lat": result['geometry']['location']['lat'],
                "lng": result['geometry']['location']['lng']
            }
        }
    
    async def get_directions(self, origin: str, destination: str, mode: str = "driving") -> Optional[Dict[str, Any]]:
        """Get directions between two points"""
        try:
            if not self.gmaps:
                return self._get_mock_directions(origin, destination)
            
            loop = asyncio.get_event_loop()
            directions = await loop.run_in_executor(
                None,
                self.gmaps.directions,
                origin,
                destination,
                mode=mode
            )
            
            return self._format_directions(directions)
            
        except Exception as e:
            print(f"Directions API error: {e}")
            return self._get_mock_directions(origin, destination)
    
    def _format_directions(self, directions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Format directions from Google Maps API"""
        if not directions:
            return None
        
        route = directions[0]
        leg = route['legs'][0]
        
        return {
            "distance": leg['distance']['text'],
            "duration": leg['duration']['text'],
            "start_address": leg['start_address'],
            "end_address": leg['end_address'],
            "steps": [
                {
                    "instruction": step['html_instructions'],
                    "distance": step['distance']['text'],
                    "duration": step['duration']['text']
                }
                for step in leg['steps']
            ]
        }
    
    async def geocode_address(self, address: str) -> Optional[Dict[str, float]]:
        """Convert address to coordinates"""
        try:
            if not self.gmaps:
                return self._get_mock_coordinates(address)
            
            loop = asyncio.get_event_loop()
            geocode_result = await loop.run_in_executor(
                None,
                self.gmaps.geocode,
                address
            )
            
            if geocode_result:
                location = geocode_result[0]['geometry']['location']
                return {
                    "lat": location['lat'],
                    "lng": location['lng']
                }
            
            return None
            
        except Exception as e:
            print(f"Geocoding API error: {e}")
            return self._get_mock_coordinates(address)
    
    def _get_mock_places(self, query: str) -> List[Dict[str, Any]]:
        """Get mock places data"""
        return [
            {
                "id": f"mock_place_{i}",
                "name": f"{query} Place {i+1}",
                "address": f"123 Mock Street, {query}",
                "rating": 4.0 + (i * 0.1),
                "price_level": i % 4 + 1,
                "types": ["tourist_attraction", "establishment"],
                "coordinates": {
                    "lat": 35.6762 + (i * 0.01),
                    "lng": 139.6503 + (i * 0.01)
                },
                "photos": [],
                "opening_hours": {"open_now": True},
                "vicinity": f"Mock Area, {query}"
            }
            for i in range(5)
        ]
    
    def _get_mock_place_details(self, place_id: str) -> Dict[str, Any]:
        """Get mock place details"""
        return {
            "id": place_id,
            "name": "Mock Place",
            "address": "123 Mock Street, Mock City",
            "rating": 4.5,
            "price_level": 2,
            "phone_number": "+1 234 567 8900",
            "website": "https://mockplace.com",
            "opening_hours": {"open_now": True},
            "photos": [],
            "reviews": [],
            "coordinates": {"lat": 35.6762, "lng": 139.6503}
        }
    
    def _get_mock_directions(self, origin: str, destination: str) -> Dict[str, Any]:
        """Get mock directions"""
        return {
            "distance": "5.2 km",
            "duration": "15 mins",
            "start_address": origin,
            "end_address": destination,
            "steps": [
                {
                    "instruction": f"Head towards {destination}",
                    "distance": "2.1 km",
                    "duration": "8 mins"
                },
                {
                    "instruction": f"Arrive at {destination}",
                    "distance": "3.1 km",
                    "duration": "7 mins"
                }
            ]
        }
    
    def _get_mock_coordinates(self, address: str) -> Dict[str, float]:
        """Get mock coordinates"""
        return {
            "lat": 35.6762,
            "lng": 139.6503
        }
    
    # ==================== SERPAPI INTEGRATION ====================
    
    async def search_coffee_shops(self, 
                                location: Optional[Dict[str, float]] = None,
                                radius: int = 5000,
                                min_rating: float = 4.0,
                                limit: int = 20) -> List[Dict[str, Any]]:
        """
        Tìm kiếm các quán cà phê sử dụng SerpAPI
        
        Args:
            location: Tọa độ vị trí {"lat": float, "lng": float}
            radius: Bán kính tìm kiếm (mét)
            min_rating: Rating tối thiểu để lọc
            limit: Số lượng kết quả tối đa
        
        Returns:
            List[Dict]: Danh sách các quán cà phê với thông tin chi tiết
        """
        try:
            return await self.serpapi_service.search_coffee_shops(
                query="Coffee",
                location=location,
                radius=radius,
                min_rating=min_rating,
                limit=limit
            )
        except Exception as e:
            print(f"Error searching coffee shops: {e}")
            return self._get_mock_coffee_shops(location, limit)
    
    async def search_restaurants(self, 
                               location: Optional[Dict[str, float]] = None,
                               radius: int = 5000,
                               min_rating: float = 4.0,
                               limit: int = 20) -> List[Dict[str, Any]]:
        """Tìm kiếm nhà hàng sử dụng SerpAPI"""
        try:
            return await self.serpapi_service.search_coffee_shops(
                query="Vietnamese restaurants",
                location=location,
                radius=radius,
                min_rating=min_rating,
                limit=limit
            )
        except Exception as e:
            print(f"Error searching restaurants: {e}")
            return self._get_mock_restaurants(location, limit)
    
    async def search_hotels(self, 
                          location: Optional[Dict[str, float]] = None,
                          radius: int = 10000,
                          min_rating: float = 4.0,
                          limit: int = 20) -> List[Dict[str, Any]]:
        """Tìm kiếm khách sạn sử dụng SerpAPI"""
        try:
            return await self.serpapi_service.search_coffee_shops(
                query="Hotels",
                location=location,
                radius=radius,
                min_rating=min_rating,
                limit=limit
            )
        except Exception as e:
            print(f"Error searching hotels: {e}")
            return self._get_mock_hotels(location, limit)
    
    async def search_attractions(self, 
                               location: Optional[Dict[str, float]] = None,
                               radius: int = 10000,
                               min_rating: float = 4.0,
                               limit: int = 20) -> List[Dict[str, Any]]:
        """Tìm kiếm điểm tham quan sử dụng SerpAPI"""
        try:
            return await self.serpapi_service.search_coffee_shops(
                query="Tourist attractions",
                location=location,
                radius=radius,
                min_rating=min_rating,
                limit=limit
            )
        except Exception as e:
            print(f"Error searching attractions: {e}")
            return self._get_mock_attractions(location, limit)
    
    async def get_place_reviews(self, place_id: str) -> List[Dict[str, Any]]:
        """Lấy đánh giá của một địa điểm"""
        try:
            return await self.serpapi_service.get_place_reviews(place_id)
        except Exception as e:
            print(f"Error getting place reviews: {e}")
            return self._get_mock_reviews()
    
    # ==================== MOCK DATA METHODS ====================
    
    def _get_mock_coffee_shops(self, location: Optional[Dict[str, float]], limit: int) -> List[Dict[str, Any]]:
        """Dữ liệu mock cho quán cà phê"""
        base_lat = location["lat"] if location else 21.0285  # Hà Nội
        base_lng = location["lng"] if location else 105.8542
        
        coffee_shops = [
            {
                "id": f"coffee_{i}",
                "name": f"Coffee Shop {i+1}",
                "address": f"{100+i} Đường Mock, Quận {i+1}, Hà Nội",
                "rating": 4.0 + (i * 0.2),
                "reviews_count": 50 + (i * 10),
                "price_level": (i % 3) + 1,
                "phone": f"+84 123 456 78{i:02d}",
                "website": f"https://coffeeshop{i+1}.com",
                "hours": "7:00 AM - 10:00 PM",
                "coordinates": {
                    "lat": base_lat + (i * 0.01),
                    "lng": base_lng + (i * 0.01)
                },
                "thumbnail": "",
                "types": ["cafe", "coffee_shop"],
                "source": "mock",
                "opening_hours": {"open_now": True, "hours_text": "7:00 AM - 10:00 PM"},
                "vicinity": f"Quận {i+1}, Hà Nội"
            }
            for i in range(min(limit, 10))
        ]
        
        return coffee_shops
    
    def _get_mock_restaurants(self, location: Optional[Dict[str, float]], limit: int) -> List[Dict[str, Any]]:
        """Dữ liệu mock cho nhà hàng"""
        base_lat = location["lat"] if location else 21.0285
        base_lng = location["lng"] if location else 105.8542
        
        restaurants = [
            {
                "id": f"restaurant_{i}",
                "name": f"Nhà hàng {i+1}",
                "address": f"{200+i} Đường Mock, Quận {i+1}, Hà Nội",
                "rating": 4.2 + (i * 0.1),
                "reviews_count": 30 + (i * 5),
                "price_level": (i % 4) + 1,
                "phone": f"+84 987 654 32{i:02d}",
                "website": f"https://restaurant{i+1}.com",
                "hours": "10:00 AM - 11:00 PM",
                "coordinates": {
                    "lat": base_lat + (i * 0.01),
                    "lng": base_lng + (i * 0.01)
                },
                "thumbnail": "",
                "types": ["restaurant", "food"],
                "source": "mock",
                "opening_hours": {"open_now": True, "hours_text": "10:00 AM - 11:00 PM"},
                "vicinity": f"Quận {i+1}, Hà Nội"
            }
            for i in range(min(limit, 8))
        ]
        
        return restaurants
    
    def _get_mock_hotels(self, location: Optional[Dict[str, float]], limit: int) -> List[Dict[str, Any]]:
        """Dữ liệu mock cho khách sạn"""
        base_lat = location["lat"] if location else 21.0285
        base_lng = location["lng"] if location else 105.8542
        
        hotels = [
            {
                "id": f"hotel_{i}",
                "name": f"Khách sạn {i+1}",
                "address": f"{300+i} Đường Mock, Quận {i+1}, Hà Nội",
                "rating": 4.5 + (i * 0.1),
                "reviews_count": 100 + (i * 20),
                "price_level": (i % 4) + 1,
                "phone": f"+84 555 123 45{i:02d}",
                "website": f"https://hotel{i+1}.com",
                "hours": "24/7",
                "coordinates": {
                    "lat": base_lat + (i * 0.01),
                    "lng": base_lng + (i * 0.01)
                },
                "thumbnail": "",
                "types": ["lodging", "hotel"],
                "source": "mock",
                "opening_hours": {"open_now": True, "hours_text": "24/7"},
                "vicinity": f"Quận {i+1}, Hà Nội"
            }
            for i in range(min(limit, 6))
        ]
        
        return hotels
    
    def _get_mock_attractions(self, location: Optional[Dict[str, float]], limit: int) -> List[Dict[str, Any]]:
        """Dữ liệu mock cho điểm tham quan"""
        base_lat = location["lat"] if location else 21.0285
        base_lng = location["lng"] if location else 105.8542
        
        attractions = [
            {
                "id": f"attraction_{i}",
                "name": f"Điểm tham quan {i+1}",
                "address": f"{400+i} Đường Mock, Quận {i+1}, Hà Nội",
                "rating": 4.3 + (i * 0.1),
                "reviews_count": 80 + (i * 15),
                "price_level": (i % 3) + 1,
                "phone": f"+84 777 888 99{i:02d}",
                "website": f"https://attraction{i+1}.com",
                "hours": "8:00 AM - 6:00 PM",
                "coordinates": {
                    "lat": base_lat + (i * 0.01),
                    "lng": base_lng + (i * 0.01)
                },
                "thumbnail": "",
                "types": ["tourist_attraction", "establishment"],
                "source": "mock",
                "opening_hours": {"open_now": True, "hours_text": "8:00 AM - 6:00 PM"},
                "vicinity": f"Quận {i+1}, Hà Nội"
            }
            for i in range(min(limit, 5))
        ]
        
        return attractions
    
    def _get_mock_reviews(self) -> List[Dict[str, Any]]:
        """Dữ liệu mock cho đánh giá"""
        return [
            {
                "author": f"Người dùng {i+1}",
                "rating": 4 + (i % 2),
                "text": f"Địa điểm rất tốt, dịch vụ chuyên nghiệp. Đánh giá {i+1}",
                "date": f"2024-01-{15+i:02d}",
                "likes": 5 + i
            }
            for i in range(5)
        ]
