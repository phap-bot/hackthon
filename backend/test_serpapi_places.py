import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.services.serpapi_service import SerpAPIService

async def test_serpapi_places():
    """Test SerpAPI nearby places search"""
    print("Testing SerpAPI Nearby Places Search")
    print("=" * 50)
    
    service = SerpAPIService()
    
    print(f"API Key: {service.api_key[:20]}...")
    
    # Test search nearby places
    print("\n1. Testing nearby places search...")
    try:
        results = await service.search_nearby_places(
            query="restaurants",
            location={"lat": 10.8231, "lng": 106.6297},  # Ho Chi Minh City
            radius=5000,
            limit=5
        )
        
        print(f"Found {len(results)} places:")
        for i, place in enumerate(results[:3], 1):
            print(f"  {i}. {place.get('name', 'N/A')} - {place.get('rating', 'N/A')} stars")
            print(f"      Address: {place.get('address', 'N/A')}")
            
    except Exception as e:
        print(f"Error: {e}")
    
    # Test search coffee shops
    print("\n2. Testing coffee shop search...")
    try:
        results = await service.search_coffee_shops(
            query="Coffee shops in Ho Chi Minh City",
            limit=3
        )
        
        print(f"Found {len(results)} coffee shops:")
        for i, shop in enumerate(results[:3], 1):
            print(f"  {i}. {shop.get('name', 'N/A')} - {shop.get('rating', 'N/A')} stars")
            print(f"      Address: {shop.get('address', 'N/A')}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_serpapi_places())
