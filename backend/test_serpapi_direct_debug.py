import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.services.serpapi_service import SerpAPIService

async def test_serpapi_direct():
    """Test SerpAPI service directly"""
    print("Testing SerpAPI Service Directly")
    print("=" * 50)
    
    service = SerpAPIService()
    
    print(f"API Key: {service.api_key[:20]}...")
    
    # Test coffee shops search
    print("\n1. Testing coffee shops search...")
    try:
        results = await service.search_coffee_shops(
            query="Coffee",
            location={"lat": 10.8231, "lng": 106.6297},
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

if __name__ == "__main__":
    asyncio.run(test_serpapi_direct())
