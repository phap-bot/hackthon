import os
import httpx
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import json

class SerpAPIService:
    def __init__(self):
        self.api_key = os.getenv("SERPAPI_KEY")
        self.base_url = "https://serpapi.com/search"

        if not self.api_key:
            print("⚠️ Warning: SERPAPI_KEY not found. SerpAPI features will run in mock mode.")

    # ===========================================================
    # 🔍 Lấy chi tiết địa điểm
    # ===========================================================
    async def get_place_details(
        self,
        place_name: str,
        lat: float,
        lng: float,
        place_id: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Lấy chi tiết địa điểm từ SerpAPI Google Maps Engine
        """

        if not self.api_key:
            return self._get_mock_place_details(place_name, lat, lng)

        try:
            params = {
                "engine": "google_maps",
                "q": place_name,
                "ll": f"@{lat},{lng},14z",
                "type": "search",
                "api_key": self.api_key,
            }

            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.get(self.base_url, params=params)
                res.raise_for_status()
                data = res.json()

            # SerpAPI có thể trả về nhiều dạng key khác nhau
            local_results = data.get("local_results") or data.get("place_results") or []

            if not local_results:
                print(f"⚠️ SerpAPI: No results found for '{place_name}' at {lat},{lng}")
                return self._get_mock_place_details(place_name, lat, lng)

            best_match = self._find_best_match(local_results, place_name, lat, lng)

            if not best_match:
                print(f"⚠️ SerpAPI: No match found for '{place_name}'")
                return self._get_mock_place_details(place_name, lat, lng)

            result = self._format_serpapi_result(best_match)
            print(f"✅ SerpAPI: Found '{result['name']}' with rating {result['rating']}")
            return result

        except httpx.TimeoutException:
            print(f"⏱ Timeout: SerpAPI took too long for '{place_name}'")
            return self._get_mock_place_details(place_name, lat, lng)
        except Exception as e:
            print(f"❌ SerpAPI error for '{place_name}': {e}")
            return self._get_mock_place_details(place_name, lat, lng)

    # ===========================================================
    # 🧭 Match Finder (improved for VN names)
    # ===========================================================
    def _find_best_match(
        self,
        results: List[Dict],
        target_name: str,
        target_lat: float,
        target_lng: float
    ) -> Optional[Dict]:
        """Tìm kết quả phù hợp nhất theo tên & khoảng cách"""
        if not results:
            return None

        best_score = 0
        best_match = None
        target_norm = self._normalize_name(target_name)

        for result in results:
            name = result.get("title", "")
            coords = result.get("gps_coordinates", {})
            result_lat = coords.get("latitude", 0)
            result_lng = coords.get("longitude", 0)

            name_similarity = self._calculate_name_similarity(
                target_norm, self._normalize_name(name)
            )
            distance = self._calculate_distance(target_lat, target_lng, result_lat, result_lng)
            distance_score = max(0, 1 - (distance / 2.0))  # ưu tiên dưới 2km

            score = (name_similarity * 0.8) + (distance_score * 0.2)

            if score > best_score:
                best_score = score
                best_match = result

        return best_match if best_score > 0.25 else None

    def _normalize_name(self, s: str) -> str:
        import re
        import unicodedata
        s = unicodedata.normalize("NFD", s)
        s = re.sub(r"[\u0300-\u036f]", "", s)  # bỏ dấu tiếng Việt
        return s.lower().strip()

    def _calculate_name_similarity(self, name1: str, name2: str) -> float:
        if not name1 or not name2:
            return 0
        words1, words2 = set(name1.split()), set(name2.split())
        if not words1 or not words2:
            return 0
        intersection = len(words1.intersection(words2))
        union = len(words1.union(words2))
        return intersection / union if union else 0

    def _calculate_distance(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        from math import radians, cos, sin, asin, sqrt
        lat1, lng1, lat2, lng2 = map(radians, [lat1, lng1, lat2, lng2])
        dlat, dlng = lat2 - lat1, lng2 - lng1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlng/2)**2
        return 6371 * (2 * asin(sqrt(a)))  # km

    # ===========================================================
    # 🧾 Formatter (clean)
    # ===========================================================
    def _format_serpapi_result(self, result: Dict) -> Dict[str, Any]:
        rating = float(result.get("rating", 0) or 0)
        reviews = int(result.get("reviews", 0) or 0)
        hours = result.get("hours", "")
        open_now = None
        if isinstance(hours, str):
            open_now = "mở cửa" in hours.lower() or "open" in hours.lower()
        elif isinstance(hours, dict):
            open_now = hours.get("open_now")

        return {
            "name": result.get("title", ""),
            "rating": rating,
            "reviews_count": reviews,
            "opening_hours": {
                "hours_text": hours or "",
                "open_now": open_now,
            },
            "thumbnail": result.get("thumbnail", ""),
            "gmap_link": result.get("gps_coordinates", {}).get("link", ""),
            "address": result.get("address", ""),
            "phone": result.get("phone", ""),
            "website": result.get("website", ""),
            "source": "serpapi",
        }

    # ===========================================================
    # 🧪 Mock fallback
    # ===========================================================
    def _get_mock_place_details(self, place_name: str, lat: float, lng: float) -> Dict[str, Any]:
        return {
            "name": place_name,
            "rating": 4.2,
            "reviews_count": 128,
            "opening_hours": {
                "hours_text": "Mo-Su 08:00–22:00",
                "open_now": True,
            },
            "thumbnail": "",
            "gmap_link": f"https://maps.google.com/?q={lat},{lng}",
            "address": f"Near {lat:.4f},{lng:.4f}",
            "phone": "",
            "website": "",
            "source": "mock",
        }

    # ===========================================================
    # ⚙️ Lấy nhiều địa điểm cùng lúc (song song)
    # ===========================================================
    async def get_multiple_places_details(
        self, places: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        results = []
        for place in places:
            try:
                details = await self.get_place_details(
                    place_name=place.get("name", ""),
                    lat=place.get("lat", 0),
                    lng=place.get("lng", 0),
                    place_id=place.get("place_id"),
                )
                if details:
                    results.append({**place, **details})
                else:
                    results.append({**place, **self._get_mock_place_details(place.get("name",""), place.get("lat",0), place.get("lng",0))})
            except Exception as e:
                print(f"❌ SerpAPI multiple error for {place.get('name')}: {e}")
                results.append({**place, **self._get_mock_place_details(place.get('name',''), place.get('lat',0), place.get('lng',0))})
        return results
