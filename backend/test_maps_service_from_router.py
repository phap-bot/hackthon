import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.services.maps_service import MapsService

async def test_maps_service_from_router():
    """Test MapsService as called from maps router"""
    print("Testing MapsService as called from maps router")
    print("=" * 50)
    
    service = MapsService()
    
    print(f"Google Maps API Key: {service.gmaps_api_key[:20] if service.gmaps_api_key else 'None'}...")
    print(f"SerpAPI Service: {service.serpapi_service.api_key[:20]}...")
    
    # Test coffee shops search as called from maps router
    print("\n1. Testing coffee shops search as called from maps router...")
    try:
        location = {"lat": 10.8231, "lng": 106.6297}
        radius = 5000
        min_rating = 4.0
        limit = 5
        
        print(f"Parameters: location={location}, radius={radius}, min_rating={min_rating}, limit={limit}")
        print("Calling search_coffee_shops...")
        
        coffee_shops = await service.search_coffee_shops(
            location=location,
            radius=radius,
            min_rating=min_rating,
            limit=limit
        )
        
        print(f"✅ Success! Found {len(coffee_shops)} coffee shops:")
        for i, shop in enumerate(coffee_shops[:3], 1):
            print(f"  {i}. {shop.get('name', 'N/A')} - {shop.get('rating', 'N/A')} stars")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_maps_service_from_router())
