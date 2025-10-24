import os
import asyncio
from typing import Dict, List, Any, Optional
try:
    from serpapi import GoogleSearch
except ImportError:
    # Fallback nếu không có serpapi
    GoogleSearch = None
import httpx
from datetime import datetime, timedelta

class SerpAPIService:
    def __init__(self):
        self.api_key = os.getenv("SERPAPI_API_KEY", "f32a2c0ee8e1f9aad03fbf62c5db3e3efcd1f6d1188fd2b9f134cb77204a502a")
        self.base_url = "https://serpapi.com/search.json"
    
    async def search_coffee_shops(self, 
                                query: str = "Coffee", 
                                location: Optional[Dict[str, float]] = None,
                                radius: int = 5000,
                                min_rating: float = 4.0,
                                limit: int = 20) -> List[Dict[str, Any]]:
        """
        Tìm kiếm các quán cà phê sử dụng SerpAPI
        
        Args:
            query: Từ khóa tìm kiếm (mặc định: "Coffee")
            location: Tọa độ vị trí {"lat": float, "lng": float}
            radius: Bán kính tìm kiếm (mét)
            min_rating: Rating tối thiểu để lọc
            limit: Số lượng kết quả tối đa
        
        Returns:
            List[Dict]: Danh sách các quán cà phê với thông tin chi tiết
        """
        try:
            if not self.api_key:
                print("SerpAPI key not found, using mock data")
                return self._get_mock_coffee_shops(location, limit)
            
            # Chuẩn bị parameters cho SerpAPI theo format chuẩn
            params = {
                "engine": "google_maps",
                "q": query,
                "api_key": self.api_key
            }
            
            # Thêm tọa độ nếu có (format chuẩn: @lat,lng,zoom)
            if location:
                ll = f"@{location['lat']},{location['lng']},{radius//1000}z"
                params["ll"] = ll
            
            # Chạy trong thread pool để tránh blocking
            loop = asyncio.get_event_loop()
            results = await loop.run_in_executor(
                None,
                self._search_sync,
                params
            )
            
            # Xử lý và lọc kết quả
            coffee_shops = self._process_serpapi_results(results, min_rating, limit)
            
            return coffee_shops
            
        except Exception as e:
            print(f"SerpAPI error: {e}")
            return self._get_mock_coffee_shops(location, limit)
    
    def _search_sync(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Tìm kiếm đồng bộ với SerpAPI"""
        if GoogleSearch is None:
            return {"local_results": [], "organic_results": []}
        search = GoogleSearch(params)
        return search.get_dict()
    
    def _process_serpapi_results(self, 
                                results: Dict[str, Any], 
                                min_rating: float, 
                                limit: int) -> List[Dict[str, Any]]:
        """Xử lý kết quả từ SerpAPI"""
        coffee_shops = []
        
        # Lấy danh sách kết quả
        places = results.get("local_results", [])
        if not places:
            places = results.get("organic_results", [])
        
        for place in places[:limit]:
            try:
                # Lấy thông tin cơ bản
                name = place.get("title", "")
                address = place.get("address", "")
                rating = place.get("rating", 0.0)
                reviews = place.get("reviews", 0)
                
                # Lọc theo rating
                if rating < min_rating:
                    continue
                
                # Lấy tọa độ
                coordinates = self._extract_coordinates(place)
                if not coordinates:
                    continue
                
                # Lấy thông tin bổ sung
                price_level = place.get("price", "")
                phone = place.get("phone", "")
                website = place.get("website", "")
                hours = place.get("hours", "")
                
                # Lấy ảnh
                thumbnail = place.get("thumbnail", "")
                
                coffee_shop = {
                    "id": place.get("place_id", f"serpapi_{len(coffee_shops)}"),
                    "name": name,
                    "address": address,
                    "rating": rating,
                    "reviews_count": reviews,
                    "price_level": self._parse_price_level(price_level),
                    "phone": phone,
                    "website": website,
                    "hours": hours,
                    "coordinates": coordinates,
                    "thumbnail": thumbnail,
                    "types": ["cafe", "coffee_shop", "food"],
                    "source": "serpapi",
                    "opening_hours": self._parse_opening_hours(hours),
                    "vicinity": address.split(",")[0] if address else ""
                }
                
                coffee_shops.append(coffee_shop)
                
            except Exception as e:
                print(f"Error processing place: {e}")
                continue
        
        # Sắp xếp theo rating giảm dần
        coffee_shops.sort(key=lambda x: x["rating"], reverse=True)
        
        return coffee_shops
    
    def _extract_coordinates(self, place: Dict[str, Any]) -> Optional[Dict[str, float]]:
        """Trích xuất tọa độ từ kết quả SerpAPI"""
        try:
            # Thử lấy từ GPS coordinates
            gps = place.get("gps_coordinates", {})
            if gps:
                return {
                    "lat": float(gps.get("latitude", 0)),
                    "lng": float(gps.get("longitude", 0))
                }
            
            # Thử lấy từ address
            address = place.get("address", "")
            if address:
                # Có thể cần geocoding ở đây
                return None
                
        except (ValueError, TypeError) as e:
            print(f"Error extracting coordinates: {e}")
        
        return None
    
    def _parse_price_level(self, price_str: str) -> int:
        """Chuyển đổi chuỗi giá thành số"""
        if not price_str:
            return 0
        
        price_str = price_str.lower()
        if "đồng" in price_str or "vnd" in price_str:
            if "dưới" in price_str or "dưới 50" in price_str:
                return 1
            elif "50-100" in price_str:
                return 2
            elif "100-200" in price_str:
                return 3
            else:
                return 4
        elif "$" in price_str:
            dollar_count = price_str.count("$")
            return min(dollar_count, 4)
        
        return 0
    
    def _parse_opening_hours(self, hours_str: str) -> Dict[str, Any]:
        """Phân tích giờ mở cửa"""
        if not hours_str:
            return {"open_now": False}
        
        hours_str = hours_str.lower()
        return {
            "open_now": "mở" in hours_str or "open" in hours_str,
            "hours_text": hours_str
        }
    
    def _get_mock_coffee_shops(self, 
                              location: Optional[Dict[str, float]], 
                              limit: int) -> List[Dict[str, Any]]:
        """Dữ liệu mock cho quán cà phê"""
        base_lat = location["lat"] if location else 21.0285  # Hà Nội
        base_lng = location["lng"] if location else 105.8542
        
        mock_shops = [
            {
                "id": f"mock_coffee_{i}",
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
        
        return mock_shops
    
    async def search_nearby_places(self, 
                                 place_type: str,
                                 location: Dict[str, float],
                                 radius: int = 1000,
                                 min_rating: float = 4.0) -> List[Dict[str, Any]]:
        """
        Tìm kiếm các địa điểm gần đó theo loại
        
        Args:
            place_type: Loại địa điểm (restaurant, hotel, attraction, etc.)
            location: Tọa độ vị trí
            radius: Bán kính tìm kiếm (mét)
            min_rating: Rating tối thiểu
        """
        return await self.search_coffee_shops(
            query=place_type,
            location=location,
            radius=radius,
            min_rating=min_rating
        )
    
    async def get_place_reviews(self, place_id: str) -> List[Dict[str, Any]]:
        """Lấy đánh giá của một địa điểm"""
        try:
            if not self.api_key:
                return self._get_mock_reviews()
            
            params = {
                "engine": "google_maps_reviews",
                "place_id": place_id,
                "api_key": self.api_key,
                "hl": "vi"
            }
            
            loop = asyncio.get_event_loop()
            results = await loop.run_in_executor(
                None,
                self._search_sync,
                params
            )
            
            return self._process_reviews(results)
            
        except Exception as e:
            print(f"Error getting reviews: {e}")
            return self._get_mock_reviews()
    
    def _process_reviews(self, results: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Xử lý kết quả đánh giá"""
        reviews = []
        
        for review in results.get("reviews", []):
            review_data = {
                "author": review.get("user", {}).get("name", ""),
                "rating": review.get("rating", 0),
                "text": review.get("snippet", ""),
                "date": review.get("date", ""),
                "likes": review.get("likes", 0)
            }
            reviews.append(review_data)
        
        return reviews
    
    def _get_mock_reviews(self) -> List[Dict[str, Any]]:
        """Dữ liệu mock cho đánh giá"""
        return [
            {
                "author": f"Người dùng {i+1}",
                "rating": 4 + (i % 2),
                "text": f"Quán cà phê rất tốt, không gian đẹp và đồ uống ngon. Đánh giá {i+1}",
                "date": f"2024-01-{15+i:02d}",
                "likes": 5 + i
            }
            for i in range(5)
        ]
