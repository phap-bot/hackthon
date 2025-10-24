import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.services.serpapi_service import SerpAPIService

async def test_serpapi_direct_debug():
    """Test SerpAPI service directly with debug"""
    print("Testing SerpAPI Service Directly with Debug")
    print("=" * 50)
    
    service = SerpAPIService()
    
    print(f"API Key: {service.api_key[:20]}...")
    
    # Test coffee shops search with debug
    print("\n1. Testing coffee shops search with debug...")
    try:
        print("Calling search_coffee_shops...")
        results = await service.search_coffee_shops(
            query="Coffee shops in Ho Chi Minh City",
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
    
    # Test direct SerpAPI call with debug
    print("\n2. Testing direct SerpAPI call with debug...")
    try:
        from serpapi import GoogleSearch
        
        params = {
            "engine": "google_maps",
            "q": "Coffee shops in Ho Chi Minh City",
            "ll": "@10.8231,106.6297,5z",
            "api_key": service.api_key,
            "hl": "vi",
            "gl": "vn"
        }
        
        print(f"Params: {params}")
        print("Calling GoogleSearch...")
        
        search = GoogleSearch(params)
        results = search.get_dict()
        
        print(f"✅ Success! Got results: {type(results)}")
        print(f"Keys: {list(results.keys()) if isinstance(results, dict) else 'Not a dict'}")
        
        if "local_results" in results:
            print(f"Local results: {len(results['local_results'])}")
            for i, place in enumerate(results['local_results'][:3], 1):
                print(f"  {i}. {place.get('title', 'N/A')} - {place.get('rating', 'N/A')} stars")
                
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_serpapi_direct_debug())