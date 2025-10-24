import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.services.serpapi_service import SerpAPIService

async def test_serpapi():
    """Test SerpAPI service"""
    print("Testing SerpAPI Service")
    print("=" * 50)
    
    service = SerpAPIService()
    
    print(f"API Key: {service.api_key[:20]}...")
    
    # Test search coffee shops
    print("\n1. Testing coffee shop search...")
    try:
        results = await service.search_coffee_shops(
            query="Coffee shops in Ho Chi Minh City",
            limit=5
        )
        
        print(f"Found {len(results)} coffee shops:")
        for i, shop in enumerate(results[:3], 1):
            print(f"  {i}. {shop.get('name', 'N/A')} - {shop.get('rating', 'N/A')} stars")
            
    except Exception as e:
        print(f"Error: {e}")
    
    # Test search restaurants
    print("\n2. Testing restaurant search...")
    try:
        results = await service.search_restaurants(
            query="Vietnamese restaurants in Hanoi",
            limit=5
        )
        
        print(f"Found {len(results)} restaurants:")
        for i, restaurant in enumerate(results[:3], 1):
            print(f"  {i}. {restaurant.get('name', 'N/A')} - {restaurant.get('rating', 'N/A')} stars")
            
    except Exception as e:
        print(f"Error: {e}")
    
    # Test search attractions
    print("\n3. Testing attraction search...")
    try:
        results = await service.search_attractions(
            query="Tourist attractions in Da Nang",
            limit=5
        )
        
        print(f"Found {len(results)} attractions:")
        for i, attraction in enumerate(results[:3], 1):
            print(f"  {i}. {attraction.get('name', 'N/A')} - {attraction.get('rating', 'N/A')} stars")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_serpapi())
