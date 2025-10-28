"""
Geo utilities for getting nearby places using Geoapify
"""
from __future__ import annotations
import os
from typing import Dict, List
import httpx

GEOAPIFY_KEY = os.getenv("GEOAPIFY_KEY", "e21572c819734004b50cce6f8b52e171")


def _build_categories_from_prefs(prefs: Dict) -> str:
    """Map sở thích → categories Geoapify"""
    theme = (prefs.get("theme") or "").lower()
    base = ["tourism.sights", "leisure.park"]
    
    if "ẩm thực" in theme or "food" in theme or "ẩm thực" in theme:
        base.append("catering.restaurant")
        base.append("catering.cafe")
    
    if "phiêu lưu" in theme or "adventure" in theme:
        base.append("sport.climbing")
        base.append("entertainment.amusement_arcade")
    
    if "nghỉ dưỡng" in theme or "relax" in theme:
        base.append("entertainment.spa")
        base.append("leisure.park")
    
    return ",".join(base)


def get_nearby_places(lat: float, lon: float, prefs: Dict, radius: int = 8000, limit: int = 20) -> List[Dict]:
    """
    Lấy danh sách địa điểm gần user bằng Geoapify.
    """
    if not GEOAPIFY_KEY:
        return []

    try:
        cats = _build_categories_from_prefs(prefs)
        url = (
            "https://api.geoapify.com/v2/places?"
            f"categories={cats}&filter=circle:{lon},{lat},{radius}"
            f"&bias=proximity:{lon},{lat}&limit={limit}&apiKey={GEOAPIFY_KEY}"
        )

        with httpx.Client(timeout=15.0) as client:
            res = client.get(url)
            res.raise_for_status()
            features = res.json().get("features", [])
            
            # Transform to simple format
            places = []
            for feature in features:
                props = feature.get("properties", {})
                coords = feature.get("geometry", {}).get("coordinates", [])
                places.append({
                    "name": props.get("name", "Unknown"),
                    "address": props.get("address_line1", "") + ", " + props.get("address_line2", ""),
                    "category": ",".join(props.get("categories", [])),
                    "rating": props.get("rating", 0),
                    "lat": coords[1] if len(coords) > 1 else lat,
                    "lon": coords[0] if len(coords) > 0 else lon,
                })
            
            return places
    except Exception as e:
        print(f"Error fetching nearby places: {e}")
        return []

