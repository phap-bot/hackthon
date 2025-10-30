import os
import httpx
from typing import Dict, List, Any, Optional
from datetime import datetime


class GeoapifyService:
    """
    GeoapifyService — Fix version
    Chuẩn hoá endpoint API mới nhất (v2) + kiểm soát lỗi & fallback mock.
    """

    def __init__(self):
        self.api_key = os.getenv("GEOAPIFY_KEY", "e21572c819734004b50cce6f8b52e171")
        self.base_url = "https://api.geoapify.com"
        self.tiles_url = "https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png"

        if not self.api_key:
            print("⚠️ Warning: GEOAPIFY_KEY not found — service in mock mode.")

    # -------------------------------------------------------------
    # 📍 NEARBY PLACES
    # -------------------------------------------------------------
    async def get_nearby_places(
        self,
        lat: float,
        lng: float,
        categories: Optional[List[str]] = None,
        radius: int = 5000,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """Lấy danh sách địa điểm gần vị trí hiện tại."""

        if not self.api_key:
            return self._get_mock_places(lat, lng, limit)

        category_str = ",".join(categories) if categories else "catering.restaurant,catering.cafe,tourism.sights"

        url = f"{self.base_url}/v2/places"
        params = {
            "categories": category_str,
            "filter": f"circle:{lng},{lat},{radius}",
            "bias": f"proximity:{lng},{lat}",
            "limit": limit,
            "apiKey": self.api_key,
        }

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                res = await client.get(url, params=params)
                res.raise_for_status()
                data = res.json()

            features = data.get("features", [])
            results = []
            for f in features[:limit]:
                p = f.get("properties", {})
                coords = f.get("geometry", {}).get("coordinates", [])
                results.append({
                    "id": p.get("place_id", f"geo_{len(results)}"),
                    "name": p.get("name", "Unnamed"),
                    "address": p.get("address_line1", ""),
                    "city": p.get("city", ""),
                    "country": p.get("country", ""),
                    "rating": p.get("rank", 0),
                    "website": p.get("website", ""),
                    "lat": coords[1] if len(coords) > 1 else lat,
                    "lon": coords[0] if len(coords) > 0 else lng,
                    "categories": p.get("categories", []),
                    "source": "geoapify"
                })
            return results

        except Exception as e:
            print(f"❌ Geoapify nearby error: {e}")
            return self._get_mock_places(lat, lng, limit)

    # -------------------------------------------------------------
    # 📍 REVERSE GEOCODE
    # -------------------------------------------------------------
    async def reverse_geocode(self, lat: float, lng: float) -> Dict[str, Any]:
        """Lấy địa chỉ từ toạ độ"""
        if not self.api_key:
            return self._get_mock_address()

        url = f"{self.base_url}/v1/geocode/reverse"
        params = {"lat": lat, "lon": lng, "apiKey": self.api_key}

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.get(url, params=params)
                res.raise_for_status()
                data = res.json()
            feat = data.get("features", [])
            if not feat:
                return self._get_mock_address()
            prop = feat[0]["properties"]
            return {
                "formatted": prop.get("formatted", ""),
                "address_line1": prop.get("address_line1", ""),
                "city": prop.get("city", ""),
                "state": prop.get("state", ""),
                "country": prop.get("country", ""),
                "lat": lat, "lon": lng
            }
        except Exception as e:
            print(f"❌ Reverse geocode error: {e}")
            return self._get_mock_address()

    # -------------------------------------------------------------
    # 🚗 ROUTING
    # -------------------------------------------------------------
    async def get_route(self, waypoints: List[Dict[str, float]], mode: str = "drive") -> Dict[str, Any]:
        """Lấy route giữa các điểm"""
        if not self.api_key:
            return self._get_mock_route(waypoints)

        url = f"{self.base_url}/v1/routing"
        # Geoapify expects lon,lat order
        waypoint_str = "|".join([f"{p['lon']},{p['lat']}" for p in waypoints])
        params = {"waypoints": waypoint_str, "mode": mode, "apiKey": self.api_key}

        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.get(url, params=params)
                if res.status_code in (403, 429):
                    return {"error": res.text, "status": res.status_code}
                res.raise_for_status()
                data = res.json()

            feature = data.get("features", [{}])[0]
            coords = feature.get("geometry", {}).get("coordinates", [])
            prop = feature.get("properties", {})

            return {
                "distance_m": prop.get("distance", 0),
                "time_s": prop.get("time", 0),
                "waypoints": [{"lat": c[1], "lng": c[0]} for c in coords],
                "mode": mode,
            }

        except Exception as e:
            print(f"❌ Routing API error: {e}")
            return self._get_mock_route(waypoints)

    # -------------------------------------------------------------
    # 🧮 DISTANCE MATRIX
    # -------------------------------------------------------------
    async def get_distance_matrix(
        self, origins: List[Dict[str, float]], destinations: List[Dict[str, float]], mode="drive"
    ) -> List[List[float]]:
        if not self.api_key:
            return self._get_mock_matrix(origins, destinations)

        url = f"{self.base_url}/v1/routematrix"
        params = {
            "mode": mode,
            "sources": "|".join([f"{o['lat']},{o['lon']}" for o in origins]),
            "targets": "|".join([f"{d['lat']},{d['lon']}" for d in destinations]),
            "apiKey": self.api_key,
        }
        try:
            async with httpx.AsyncClient(timeout=20.0) as cli:
                r = await cli.get(url, params=params)
                r.raise_for_status()
                data = r.json()
            # Format: distances/time matrix
            rows = data.get("sources_to_targets", [])
            return [[t.get("time", 0) for t in src["targets"]] for src in rows]
        except Exception as e:
            print(f"❌ Matrix error: {e}")
            return self._get_mock_matrix(origins, destinations)

    # -------------------------------------------------------------
    # 🔄 MOCK FALLBACKS
    # -------------------------------------------------------------
    def _get_mock_places(self, lat: float, lng: float, limit: int):
        return [{
            "id": f"mock_{i}",
            "name": f"Mock Cafe {i+1}",
            "address": f"{100+i} Đường 3/2",
            "city": "Quy Nhơn",
            "country": "VN",
            "rating": 4.2,
            "lat": lat + i * 0.001,
            "lon": lng + i * 0.001,
            "categories": ["catering.cafe"],
            "source": "mock"
        } for i in range(min(limit, 8))]

    def _get_mock_route(self, waypoints):
        return {"distance_m": 2500, "time_s": 320, "waypoints": waypoints, "mode": "drive"}

    def _get_mock_matrix(self, origins, destinations):
        return [[300, 600][: len(destinations)] for _ in origins]

    def _get_mock_address(self):
        return {"formatted": "Hà Nội, Việt Nam", "city": "Hà Nội", "country": "VN"}
