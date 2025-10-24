import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.services.serpapi_service import SerpAPIService

async def test_serpapi_exact_format():
    """Test SerpAPI with exact format from documentation"""
    print("Testing SerpAPI with Exact Format from Documentation")
    print("=" * 60)
    
    service = SerpAPIService()
    
    print(f"API Key: {service.api_key[:20]}...")
    
    # Test 1: Exact format from documentation
    print("\n1. Testing exact format from documentation...")
    try:
        from serpapi import GoogleSearch
        
        params = {
            "engine": "google_maps",
            "q": "Coffee",
            "ll": "@10.8231,106.6297,14z",  # Ho Chi Minh City
            "api_key": service.api_key
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
                print(f"      Address: {place.get('address', 'N/A')}")
                
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    # Test 2: Our service with exact format
    print("\n2. Testing our service with exact format...")
    try:
        results = await service.search_coffee_shops(
            query="Coffee",
            location={"lat": 10.8231, "lng": 106.6297},
            radius=14000,  # 14km to match zoom level 14z
            min_rating=4.0,
            limit=5
        )
        
        print(f"✅ Success! Found {len(results)} coffee shops:")
        for i, shop in enumerate(results[:3], 1):
            print(f"  {i}. {shop.get('name', 'N/A')} - {shop.get('rating', 'N/A')} stars")
            print(f"      Address: {shop.get('address', 'N/A')}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_serpapi_exact_format())
