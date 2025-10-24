import openai
import os
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import json
import random

class AITravelPlannerService:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.default_language = os.getenv("DEFAULT_LANGUAGE", "vi")  # Mặc định tiếng Việt
        if self.openai_api_key:
            openai.api_key = self.openai_api_key
    
    async def generate_itinerary(self, trip_data: Dict[str, Any], trip_id: str, language: str = None) -> Dict[str, Any]:
        """Generate travel itinerary using AI"""
        try:
            # Sử dụng ngôn ngữ được chỉ định hoặc mặc định
            target_language = language or self.default_language
            
            if self.openai_api_key:
                return await self._generate_with_openai(trip_data, trip_id, target_language)
            else:
                return await self._generate_mock_itinerary(trip_data, trip_id, target_language)
        except Exception as e:
            # Fallback to mock data if AI fails
            return await self._generate_mock_itinerary(trip_data, trip_id, target_language)
    
    async def _generate_with_openai(self, trip_data: Dict[str, Any], trip_id: str, language: str) -> Dict[str, Any]:
        """Generate itinerary using OpenAI API"""
        try:
            prompt = self._create_prompt(trip_data, language)
            
            # Chọn model phù hợp với ngôn ngữ
            model = "gpt-3.5-turbo"
            if language == "vi":
                model = "gpt-4"  # GPT-4 hỗ trợ tiếng Việt tốt hơn
            
            response = await openai.ChatCompletion.acreate(
                model=model,
                messages=[
                    {"role": "system", "content": self._get_system_prompt(language)},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.7
            )
            
            itinerary_text = response.choices[0].message.content
            return self._parse_ai_response(itinerary_text, trip_data, language)
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return await self._generate_mock_itinerary(trip_data, trip_id, language)
    
    def _get_system_prompt(self, language: str) -> str:
        """Get system prompt based on language"""
        if language == "vi":
            return """Bạn là một chuyên gia lập kế hoạch du lịch người Việt Nam. Hãy tạo lịch trình du lịch chi tiết với các hoạt động cụ thể, thời gian, chi phí và địa điểm. Sử dụng tiếng Việt cho tất cả nội dung và đơn vị tiền tệ VND."""
        else:
            return """You are an expert travel planner. Create detailed daily itineraries with specific activities, times, costs, and locations."""
    
    def _create_prompt(self, trip_data: Dict[str, Any], language: str) -> str:
        """Create prompt for AI based on language"""
        if language == "vi":
            return f"""
            Tạo lịch trình du lịch chi tiết cho:
            - Điểm đến: {trip_data['destination']}
            - Thời gian: {trip_data['total_days']} ngày
            - Số người: {trip_data['people']}
            - Ngân sách: {self._translate_budget(trip_data['budget'], 'vi')}
            - Phong cách du lịch: {self._translate_travel_style(trip_data['travel_style'], 'vi')}
            - Sở thích: {', '.join([self._translate_interest(interest, 'vi') for interest in trip_data['interests']])}
            - Ngày bắt đầu: {trip_data['start_date']}
            
            Vui lòng cung cấp phản hồi JSON với cấu trúc sau:
            {{
                "days": [
                    {{
                        "day": 1,
                        "date": "2024-03-15",
                        "estimatedCost": 2500000,
                        "activities": [
                            {{
                                "id": "1",
                                "name": "Tên hoạt động",
                                "type": "attraction|restaurant|hotel|transport|shopping|entertainment",
                                "time": "09:00",
                                "duration": "2h",
                                "cost": 500000,
                                "description": "Mô tả hoạt động",
                                "location": "Tên địa điểm",
                                "rating": 4.5,
                                "coordinates": {{"lat": 35.6762, "lng": 139.6503}}
                            }}
                        ]
                    }}
                ],
                "summary": {{
                    "totalAttractions": 8,
                    "totalRestaurants": 6,
                    "totalHotels": 1,
                    "averageRating": 4.7
                }}
            }}
            """
        else:
            return f"""
            Create a detailed travel itinerary for:
            - Destination: {trip_data['destination']}
            - Duration: {trip_data['total_days']} days
            - People: {trip_data['people']}
            - Budget: {trip_data['budget']}
            - Travel Style: {trip_data['travel_style']}
            - Interests: {', '.join(trip_data['interests'])}
            - Start Date: {trip_data['start_date']}
            
            Please provide a JSON response with the following structure:
            {{
                "days": [
                    {{
                        "day": 1,
                        "date": "2024-03-15",
                        "estimatedCost": 2500000,
                        "activities": [
                            {{
                                "id": "1",
                                "name": "Activity Name",
                                "type": "attraction|restaurant|hotel|transport|shopping|entertainment",
                                "time": "09:00",
                                "duration": "2h",
                                "cost": 500000,
                                "description": "Activity description",
                                "location": "Location name",
                                "rating": 4.5,
                                "coordinates": {{"lat": 35.6762, "lng": 139.6503}}
                            }}
                        ]
                    }}
                ],
                "summary": {{
                    "totalAttractions": 8,
                    "totalRestaurants": 6,
                    "totalHotels": 1,
                    "averageRating": 4.7
                }}
            }}
            """
    
    def _translate_budget(self, budget: str, language: str) -> str:
        """Translate budget to target language"""
        translations = {
            "vi": {
                "low": "thấp",
                "medium": "trung bình", 
                "high": "cao",
                "luxury": "sang trọng"
            },
            "en": {
                "low": "low",
                "medium": "medium",
                "high": "high", 
                "luxury": "luxury"
            }
        }
        return translations.get(language, {}).get(budget, budget)
    
    def _translate_travel_style(self, style: str, language: str) -> str:
        """Translate travel style to target language"""
        translations = {
            "vi": {
                "adventure": "phiêu lưu",
                "relaxation": "thư giãn",
                "culture": "văn hóa",
                "food": "ẩm thực",
                "nature": "thiên nhiên",
                "comfort": "thoải mái"
            },
            "en": {
                "adventure": "adventure",
                "relaxation": "relaxation", 
                "culture": "culture",
                "food": "food",
                "nature": "nature",
                "comfort": "comfort"
            }
        }
        return translations.get(language, {}).get(style, style)
    
    def _translate_interest(self, interest: str, language: str) -> str:
        """Translate interest to target language"""
        translations = {
            "vi": {
                "food": "ẩm thực",
                "culture": "văn hóa",
                "nature": "thiên nhiên",
                "adventure": "phiêu lưu",
                "shopping": "mua sắm",
                "history": "lịch sử",
                "art": "nghệ thuật",
                "music": "âm nhạc",
                "sports": "thể thao",
                "photography": "nhiếp ảnh"
            },
            "en": {
                "food": "food",
                "culture": "culture",
                "nature": "nature",
                "adventure": "adventure",
                "shopping": "shopping",
                "history": "history",
                "art": "art",
                "music": "music",
                "sports": "sports",
                "photography": "photography"
            }
        }
        return translations.get(language, {}).get(interest, interest)
    
    async def _parse_ai_response(self, response_text: str, trip_data: Dict[str, Any], language: str) -> Dict[str, Any]:
        """Parse AI response and convert to structured data"""
        try:
            # Try to extract JSON from response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            json_str = response_text[start_idx:end_idx]
            
            itinerary = json.loads(json_str)
            return itinerary
            
        except Exception as e:
            print(f"Failed to parse AI response: {e}")
            return await self._generate_mock_itinerary(trip_data, "", language)
    
    async def _generate_mock_itinerary(self, trip_data: Dict[str, Any], trip_id: str, language: str) -> Dict[str, Any]:
        """Generate mock itinerary data"""
        destination = trip_data['destination']
        total_days = trip_data['total_days']
        budget = trip_data['budget']
        travel_style = trip_data['travel_style']
        interests = trip_data['interests']
        
        # Mock data based on destination and preferences
        mock_activities = self._get_mock_activities(destination, interests, language)
        
        days = []
        start_date = trip_data['start_date']
        
        for day in range(1, total_days + 1):
            day_date = start_date + timedelta(days=day-1)
            day_activities = random.sample(mock_activities, min(4, len(mock_activities)))
            
            # Add unique IDs to activities
            for i, activity in enumerate(day_activities):
                activity['id'] = f"{day}_{i+1}"
                activity['cost'] = self._calculate_cost(activity['type'], budget)
            
            day_cost = sum(activity['cost'] for activity in day_activities)
            
            days.append({
                "day": day,
                "date": day_date.strftime("%Y-%m-%d"),
                "estimatedCost": day_cost,
                "activities": day_activities
            })
        
        return {
            "days": days,
            "summary": {
                "totalAttractions": len([a for day in days for a in day['activities'] if a['type'] == 'attraction']),
                "totalRestaurants": len([a for day in days for a in day['activities'] if a['type'] == 'restaurant']),
                "totalHotels": len([a for day in days for a in day['activities'] if a['type'] == 'hotel']),
                "averageRating": 4.5
            }
        }
    
    def _get_mock_activities(self, destination: str, interests: List[str], language: str) -> List[Dict[str, Any]]:
        """Get mock activities based on destination and interests"""
        if language == "vi":
            base_activities = [
                {
                    "name": f"Tham quan {destination}",
                    "type": "attraction",
                    "time": "09:00",
                    "duration": "3h",
                    "description": f"Khám phá vẻ đẹp của {destination}",
                    "location": destination,
                    "rating": 4.5,
                    "coordinates": {"lat": 35.6762, "lng": 139.6503}
                },
                {
                    "name": f"Nhà hàng địa phương tại {destination}",
                    "type": "restaurant",
                    "time": "12:00",
                    "duration": "1h",
                    "description": f"Thưởng thức ẩm thực đặc sắc của {destination}",
                    "location": destination,
                    "rating": 4.2,
                    "coordinates": {"lat": 35.6762, "lng": 139.6503}
                },
                {
                    "name": f"Khách sạn tại {destination}",
                    "type": "hotel",
                    "time": "14:00",
                    "duration": "1h",
                    "description": f"Nghỉ ngơi tại khách sạn chất lượng cao",
                    "location": destination,
                    "rating": 4.3,
                    "coordinates": {"lat": 35.6762, "lng": 139.6503}
                },
                {
                    "name": f"Di chuyển trong {destination}",
                    "type": "transport",
                    "time": "16:00",
                    "duration": "1h",
                    "description": f"Khám phá thành phố bằng phương tiện công cộng",
                    "location": destination,
                    "rating": 4.0,
                    "coordinates": {"lat": 35.6762, "lng": 139.6503}
                }
            ]
        else:
            base_activities = [
                {
                    "name": f"Visit {destination}",
                    "type": "attraction",
                    "time": "09:00",
                    "duration": "3h",
                    "description": f"Explore the beauty of {destination}",
                    "location": destination,
                    "rating": 4.5,
                    "coordinates": {"lat": 35.6762, "lng": 139.6503}
                },
                {
                    "name": f"Local restaurant in {destination}",
                    "type": "restaurant",
                    "time": "12:00",
                    "duration": "1h",
                    "description": f"Enjoy local cuisine of {destination}",
                    "location": destination,
                    "rating": 4.2,
                    "coordinates": {"lat": 35.6762, "lng": 139.6503}
                },
                {
                    "name": f"Hotel in {destination}",
                    "type": "hotel",
                    "time": "14:00",
                    "duration": "1h",
                    "description": f"Rest at high-quality hotel",
                    "location": destination,
                    "rating": 4.3,
                    "coordinates": {"lat": 35.6762, "lng": 139.6503}
                },
                {
                    "name": f"Transportation in {destination}",
                    "type": "transport",
                    "time": "16:00",
                    "duration": "1h",
                    "description": f"Explore the city by public transport",
                    "location": destination,
                    "rating": 4.0,
                    "coordinates": {"lat": 35.6762, "lng": 139.6503}
                }
            ]
        
        # Add interest-specific activities
        interest_activities = []
        for interest in interests:
            if language == "vi":
                if interest == "food":
                    interest_activities.append({
                        "name": f"Tour ẩm thực {destination}",
                        "type": "restaurant",
                        "time": "18:00",
                        "duration": "2h",
                        "description": f"Khám phá ẩm thực đường phố {destination}",
                        "location": destination,
                        "rating": 4.6,
                        "coordinates": {"lat": 35.6762, "lng": 139.6503}
                    })
                elif interest == "culture":
                    interest_activities.append({
                        "name": f"Bảo tàng văn hóa {destination}",
                        "type": "attraction",
                        "time": "10:00",
                        "duration": "2h",
                        "description": f"Tìm hiểu văn hóa và lịch sử {destination}",
                        "location": destination,
                        "rating": 4.4,
                        "coordinates": {"lat": 35.6762, "lng": 139.6503}
                    })
                elif interest == "nature":
                    interest_activities.append({
                        "name": f"Công viên thiên nhiên {destination}",
                        "type": "attraction",
                        "time": "08:00",
                        "duration": "3h",
                        "description": f"Thưởng thức thiên nhiên tươi đẹp",
                        "location": destination,
                        "rating": 4.7,
                        "coordinates": {"lat": 35.6762, "lng": 139.6503}
                    })
            else:
                if interest == "food":
                    interest_activities.append({
                        "name": f"Food tour in {destination}",
                        "type": "restaurant",
                        "time": "18:00",
                        "duration": "2h",
                        "description": f"Explore street food in {destination}",
                        "location": destination,
                        "rating": 4.6,
                        "coordinates": {"lat": 35.6762, "lng": 139.6503}
                    })
                elif interest == "culture":
                    interest_activities.append({
                        "name": f"Cultural museum in {destination}",
                        "type": "attraction",
                        "time": "10:00",
                        "duration": "2h",
                        "description": f"Learn about culture and history of {destination}",
                        "location": destination,
                        "rating": 4.4,
                        "coordinates": {"lat": 35.6762, "lng": 139.6503}
                    })
                elif interest == "nature":
                    interest_activities.append({
                        "name": f"Nature park in {destination}",
                        "type": "attraction",
                        "time": "08:00",
                        "duration": "3h",
                        "description": f"Enjoy beautiful nature",
                        "location": destination,
                        "rating": 4.7,
                        "coordinates": {"lat": 35.6762, "lng": 139.6503}
                    })
        
        return base_activities + interest_activities
    
    def _calculate_cost(self, activity_type: str, budget: str) -> float:
        """Calculate cost based on activity type and budget"""
        base_costs = {
            "attraction": 200000,
            "restaurant": 300000,
            "hotel": 1000000,
            "transport": 100000,
            "shopping": 500000,
            "entertainment": 400000
        }
        
        budget_multipliers = {
            "low": 0.5,
            "medium": 1.0,
            "high": 1.5,
            "luxury": 2.0
        }
        
        base_cost = base_costs.get(activity_type, 200000)
        multiplier = budget_multipliers.get(budget, 1.0)
        
        return base_cost * multiplier
