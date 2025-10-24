import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.services.maps_service import MapsService

async def test_maps_service():
    """Test MapsService directly"""
    print("Testing MapsService")
    print("=" * 50)
    
    service = MapsService()
    
    print(f"Google Maps API Key: {service.gmaps_api_key[:20] if service.gmaps_api_key else 'None'}...")
    print(f"SerpAPI Service: {service.serpapi_service.api_key[:20]}...")
    
    # Test coffee shops search
    print("\n1. Testing coffee shops search...")
    try:
        results = await service.search_coffee_shops(
            location={"lat": 10.8231, "lng": 106.6297},  # Ho Chi Minh City
            radius=5000,
            min_rating=4.0,
            limit=5
        )
        
        print(f"Found {len(results)} coffee shops:")
        for i, shop in enumerate(results[:3], 1):
            print(f"  {i}. {shop.get('name', 'N/A')} - {shop.get('rating', 'N/A')} stars")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    
    # Test restaurants search
    print("\n2. Testing restaurants search...")
    try:
        results = await service.search_restaurants(
            location={"lat": 10.8231, "lng": 106.6297},
            radius=5000,
            min_rating=4.0,
            limit=5
        )
        
        print(f"Found {len(results)} restaurants:")
        for i, restaurant in enumerate(results[:3], 1):
            print(f"  {i}. {restaurant.get('name', 'N/A')} - {restaurant.get('rating', 'N/A')} stars")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_maps_service())
