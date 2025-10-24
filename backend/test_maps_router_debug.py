import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.routers.maps import search_coffee_shops

async def test_maps_router_debug():
    """Test maps router with debug"""
    print("Testing Maps Router with Debug")
    print("=" * 50)
    
    # Test coffee shops search as called from maps router
    print("\n1. Testing coffee shops search as called from maps router...")
    try:
        lat = 10.8231
        lng = 106.6297
        radius = 5000
        min_rating = 4.0
        limit = 5
        
        print(f"Parameters: lat={lat}, lng={lng}, radius={radius}, min_rating={min_rating}, limit={limit}")
        print("Calling search_coffee_shops...")
        
        coffee_shops = await search_coffee_shops(
            lat=lat,
            lng=lng,
            radius=radius,
            min_rating=min_rating,
            limit=limit,
            current_user=None
        )
        
        print(f"✅ Success! Found {len(coffee_shops)} coffee shops:")
        for i, shop in enumerate(coffee_shops[:3], 1):
            print(f"  {i}. {shop.get('name', 'N/A')} - {shop.get('rating', 'N/A')} stars")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_maps_router_debug())