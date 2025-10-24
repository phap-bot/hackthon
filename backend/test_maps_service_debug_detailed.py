import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.services.maps_service import MapsService

async def test_maps_service_debug():
    """Test MapsService with debug info"""
    print("Testing MapsService with Debug Info")
    print("=" * 50)
    
    service = MapsService()
    
    print(f"Google Maps API Key: {service.gmaps_api_key[:20] if service.gmaps_api_key else 'None'}...")
    print(f"SerpAPI Service: {service.serpapi_service.api_key[:20]}...")
    
    # Test coffee shops search with debug
    print("\n1. Testing coffee shops search with debug...")
    try:
        print("Calling search_coffee_shops...")
        results = await service.search_coffee_shops(
            location={"lat": 10.8231, "lng": 106.6297},
            radius=5000,
            min_rating=4.0,
            limit=5
        )
        
        print(f"✅ Success! Found {len(results)} coffee shops:")
        for i, shop in enumerate(results[:3], 1):
            print(f"  {i}. {shop.get('name', 'N/A')} - {shop.get('rating', 'N/A')} stars")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    # Test restaurants search with debug
    print("\n2. Testing restaurants search with debug...")
    try:
        print("Calling search_restaurants...")
        results = await service.search_restaurants(
            location={"lat": 10.8231, "lng": 106.6297},
            radius=5000,
            min_rating=4.0,
            limit=5
        )
        
        print(f"✅ Success! Found {len(results)} restaurants:")
        for i, restaurant in enumerate(results[:3], 1):
            print(f"  {i}. {restaurant.get('name', 'N/A')} - {restaurant.get('rating', 'N/A')} stars")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_maps_service_debug())
