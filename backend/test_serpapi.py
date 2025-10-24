#!/usr/bin/env python3
"""
Demo script để test SerpAPI integration
Chạy script này để test các chức năng mới
"""

import asyncio
import os
from dotenv import load_dotenv
from app.services.serpapi_service import SerpAPIService

# Load environment variables
load_dotenv()

async def test_serpapi():
    """Test SerpAPI service"""
    print("🚀 Testing SerpAPI Integration...")
    print("=" * 50)
    
    # Khởi tạo service
    serpapi_service = SerpAPIService()
    
    # Test 1: Tìm kiếm quán cà phê ở Hà Nội
    print("\n📍 Test 1: Tìm kiếm quán cà phê ở Hà Nội")
    print("-" * 30)
    
    hanoi_location = {
        "lat": 21.0285,
        "lng": 105.8542
    }
    
    coffee_shops = await serpapi_service.search_coffee_shops(
        query="Coffee",
        location=hanoi_location,
        radius=5000,
        min_rating=4.5,
        limit=5
    )
    
    print(f"Tìm thấy {len(coffee_shops)} quán cà phê:")
    for i, shop in enumerate(coffee_shops, 1):
        print(f"{i}. {shop['name']}")
        print(f"   📍 {shop['address']}")
        print(f"   ⭐ Rating: {shop['rating']}/5 ({shop['reviews_count']} đánh giá)")
        print(f"   💰 Price Level: {shop['price_level']}")
        print(f"   📞 Phone: {shop['phone']}")
        print(f"   🌐 Website: {shop['website']}")
        print(f"   🕒 Hours: {shop['hours']}")
        print()
    
    # Test 2: Tìm kiếm nhà hàng
    print("\n🍽️ Test 2: Tìm kiếm nhà hàng")
    print("-" * 30)
    
    restaurants = await serpapi_service.search_coffee_shops(
        query="Restaurant",
        location=hanoi_location,
        radius=5000,
        min_rating=4.5,
        limit=5
    )
    
    print(f"Tìm thấy {len(restaurants)} nhà hàng:")
    for i, restaurant in enumerate(restaurants, 1):
        print(f"{i}. {restaurant['name']}")
        print(f"   📍 {restaurant['address']}")
        print(f"   ⭐ Rating: {restaurant['rating']}/5")
        print()
    
    # Test 3: Tìm kiếm khách sạn
    print("\n🏨 Test 3: Tìm kiếm khách sạn")
    print("-" * 30)
    
    hotels = await serpapi_service.search_coffee_shops(
        query="Hotel",
        location=hanoi_location,
        radius=10000,
        min_rating=4.5,
        limit=5
    )
    
    print(f"Tìm thấy {len(hotels)} khách sạn:")
    for i, hotel in enumerate(hotels, 1):
        print(f"{i}. {hotel['name']}")
        print(f"   📍 {hotel['address']}")
        print(f"   ⭐ Rating: {hotel['rating']}/5")
        print()
    
    # Test 4: Lấy đánh giá
    print("\n💬 Test 4: Lấy đánh giá")
    print("-" * 30)
    
    if coffee_shops:
        place_id = coffee_shops[0]['id']
        reviews = await serpapi_service.get_place_reviews(place_id)
        
        print(f"Đánh giá cho {coffee_shops[0]['name']}:")
        for i, review in enumerate(reviews, 1):
            print(f"{i}. {review['author']} - {review['rating']}/5")
            print(f"   "{review['text']}"")
            print(f"   📅 {review['date']} | 👍 {review['likes']} likes")
            print()
    
    print("✅ Test hoàn thành!")
    print("\n📋 Cách sử dụng API:")
    print("1. GET /api/maps/coffee?lat=21.0285&lng=105.8542&min_rating=4.0")
    print("2. GET /api/maps/restaurants?lat=21.0285&lng=105.8542&min_rating=4.0")
    print("3. GET /api/maps/hotels?lat=21.0285&lng=105.8542&min_rating=4.0")
    print("4. GET /api/maps/attractions?lat=21.0285&lng=105.8542&min_rating=4.0")
    print("5. GET /api/maps/place/{place_id}/reviews")

if __name__ == "__main__":
    asyncio.run(test_serpapi())
