from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import logging

from app.database import get_database
from app.utils.auth import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

# Pydantic models for preference survey
class TravelPreferenceSurvey(BaseModel):
    """Travel preference survey data model"""
    travel_type: str = Field(..., description="Loại hình du lịch: nghỉ_dưỡng, khám_phá, phiêu_lưu, văn_hóa")
    dream_destination: str = Field(..., description="Địa điểm mơ ước: bãi_biển, vùng_núi, thành_phố, miền_quê")
    activities: List[str] = Field(..., description="Hoạt động yêu thích: ẩm_thực, mua_sắm, trekking, lặn_biển, chụp_ảnh")
    budget_range: Optional[str] = Field(None, description="Khoảng ngân sách: thấp, trung_bình, cao")
    travel_style: Optional[str] = Field(None, description="Phong cách du lịch: tiết_kiệm, thoải_mái, sang_trọng")
    accommodation_type: Optional[str] = Field(None, description="Loại chỗ ở: khách_sạn, homestay, resort, camping")
    group_size: Optional[int] = Field(None, description="Số lượng người")
    duration_preference: Optional[str] = Field(None, description="Thời gian ưa thích: ngắn_hạn, trung_hạn, dài_hạn")

class SurveyResponse(BaseModel):
    """Survey response model"""
    survey_id: str
    user_id: str
    preferences: TravelPreferenceSurvey
    created_at: datetime
    updated_at: datetime

class SurveySubmission(BaseModel):
    """Survey submission model"""
    travel_type: str
    dream_destination: str
    activities: List[str]
    budget_range: Optional[str] = None
    travel_style: Optional[str] = None
    accommodation_type: Optional[str] = None
    group_size: Optional[int] = None
    duration_preference: Optional[str] = None

class PersonalizedRecommendation(BaseModel):
    """Personalized recommendation model"""
    destination_suggestions: List[Dict[str, Any]]
    activity_recommendations: List[Dict[str, Any]]
    budget_estimation: Dict[str, Any]
    itinerary_suggestions: List[Dict[str, Any]]
    accommodation_suggestions: List[Dict[str, Any]]

@router.post("/submit", response_model=dict)
async def submit_preference_survey(
    survey_data: SurveySubmission,
    current_user: dict = Depends(get_current_user)
):
    """Submit travel preference survey"""
    try:
        db = get_database()
        
        # Create survey document
        survey_doc = {
            "user_id": current_user["user_id"],
            "preferences": survey_data.dict(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert survey
        result = await db.user_preferences.insert_one(survey_doc)
        
        # Generate personalized recommendations
        recommendations = await generate_personalized_recommendations(survey_data)
        
        return {
            "status": "success",
            "message": "Khảo sát sở thích đã được lưu thành công",
            "survey_id": str(result.inserted_id),
            "recommendations": recommendations
        }
        
    except Exception as e:
        logger.error(f"Failed to submit survey: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể lưu khảo sát: {str(e)}"
        )

@router.get("/my-preferences", response_model=dict)
async def get_my_preferences(current_user: dict = Depends(get_current_user)):
    """Get current user's travel preferences"""
    try:
        db = get_database()
        
        # Get latest preferences
        preferences = await db.user_preferences.find_one(
            {"user_id": current_user["user_id"]},
            sort=[("created_at", -1)]
        )
        
        if not preferences:
            return {
                "status": "success",
                "message": "Chưa có dữ liệu sở thích",
                "preferences": None
            }
        
        return {
            "status": "success",
            "preferences": {
                "survey_id": str(preferences["_id"]),
                "preferences": preferences["preferences"],
                "created_at": preferences["created_at"],
                "updated_at": preferences["updated_at"]
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get preferences: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể lấy dữ liệu sở thích: {str(e)}"
        )

@router.put("/update", response_model=dict)
async def update_preferences(
    survey_data: SurveySubmission,
    current_user: dict = Depends(get_current_user)
):
    """Update travel preferences"""
    try:
        db = get_database()
        
        # Update latest preferences
        result = await db.user_preferences.update_one(
            {"user_id": current_user["user_id"]},
            {
                "$set": {
                    "preferences": survey_data.dict(),
                    "updated_at": datetime.utcnow()
                }
            },
            sort=[("created_at", -1)]
        )
        
        if result.matched_count == 0:
            # Create new preferences if none exist
            survey_doc = {
                "user_id": current_user["user_id"],
                "preferences": survey_data.dict(),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db.user_preferences.insert_one(survey_doc)
        
        # Generate updated recommendations
        recommendations = await generate_personalized_recommendations(survey_data)
        
        return {
            "status": "success",
            "message": "Sở thích đã được cập nhật thành công",
            "recommendations": recommendations
        }
        
    except Exception as e:
        logger.error(f"Failed to update preferences: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể cập nhật sở thích: {str(e)}"
        )

@router.get("/recommendations", response_model=dict)
async def get_personalized_recommendations(
    current_user: dict = Depends(get_current_user)
):
    """Get personalized travel recommendations based on preferences"""
    try:
        db = get_database()
        
        # Get user preferences
        preferences = await db.user_preferences.find_one(
            {"user_id": current_user["user_id"]},
            sort=[("created_at", -1)]
        )
        
        if not preferences:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chưa có dữ liệu sở thích. Vui lòng hoàn thành khảo sát trước."
            )
        
        # Generate recommendations
        survey_data = SurveySubmission(**preferences["preferences"])
        recommendations = await generate_personalized_recommendations(survey_data)
        
        return {
            "status": "success",
            "recommendations": recommendations
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get recommendations: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể tạo gợi ý: {str(e)}"
        )

@router.get("/options", response_model=dict)
async def get_survey_options():
    """Get all available survey options"""
    return {
        "status": "success",
        "options": {
            "travel_types": [
                {"value": "nghỉ_dưỡng", "label": "Nghỉ dưỡng", "description": "Thư giãn, tận hưởng"},
                {"value": "khám_phá", "label": "Khám phá", "description": "Điểm đến mới lạ"},
                {"value": "phiêu_lưu", "label": "Phiêu lưu", "description": "Cảm giác mạnh"},
                {"value": "văn_hóa", "label": "Văn hóa", "description": "Lịch sử, nghệ thuật"}
            ],
            "dream_destinations": [
                {"value": "bãi_biển", "label": "Bãi biển", "description": "Biển xanh, cát trắng"},
                {"value": "vùng_núi", "label": "Vùng núi", "description": "Không khí trong lành"},
                {"value": "thành_phố", "label": "Thành phố", "description": "Sôi động, hiện đại"},
                {"value": "miền_quê", "label": "Miền quê", "description": "Yên bình, mộc mạc"}
            ],
            "activities": [
                {"value": "ẩm_thực", "label": "Ẩm thực", "description": "Thưởng thức món ngon"},
                {"value": "mua_sắm", "label": "Mua sắm", "description": "Săn đồ độc lạ"},
                {"value": "trekking", "label": "Trekking", "description": "Leo núi, đi bộ"},
                {"value": "lặn_biển", "label": "Lặn biển", "description": "Khám phá đại dương"},
                {"value": "chụp_ảnh", "label": "Chụp ảnh", "description": "Lưu giữ khoảnh khắc"}
            ],
            "budget_ranges": [
                {"value": "thấp", "label": "Thấp", "description": "Dưới 5 triệu VNĐ"},
                {"value": "trung_bình", "label": "Trung bình", "description": "5-15 triệu VNĐ"},
                {"value": "cao", "label": "Cao", "description": "Trên 15 triệu VNĐ"}
            ],
            "travel_styles": [
                {"value": "tiết_kiệm", "label": "Tiết kiệm", "description": "Chi phí hợp lý"},
                {"value": "thoải_mái", "label": "Thoải mái", "description": "Cân bằng giá cả và chất lượng"},
                {"value": "sang_trọng", "label": "Sang trọng", "description": "Trải nghiệm cao cấp"}
            ],
            "accommodation_types": [
                {"value": "khách_sạn", "label": "Khách sạn", "description": "Tiện nghi, dịch vụ đầy đủ"},
                {"value": "homestay", "label": "Homestay", "description": "Trải nghiệm địa phương"},
                {"value": "resort", "label": "Resort", "description": "Nghỉ dưỡng cao cấp"},
                {"value": "camping", "label": "Camping", "description": "Gần gũi thiên nhiên"}
            ]
        }
    }

async def generate_personalized_recommendations(survey_data: SurveySubmission) -> PersonalizedRecommendation:
    """Generate personalized recommendations based on survey data"""
    
    # Destination mapping based on preferences
    destination_mapping = {
        "bãi_biển": [
            {"name": "Nha Trang", "country": "Việt Nam", "rating": 4.5, "price_range": "trung_bình"},
            {"name": "Phú Quốc", "country": "Việt Nam", "rating": 4.7, "price_range": "cao"},
            {"name": "Đà Nẵng", "country": "Việt Nam", "rating": 4.6, "price_range": "trung_bình"},
            {"name": "Phuket", "country": "Thái Lan", "rating": 4.4, "price_range": "trung_bình"},
            {"name": "Bali", "country": "Indonesia", "rating": 4.8, "price_range": "cao"}
        ],
        "vùng_núi": [
            {"name": "Sapa", "country": "Việt Nam", "rating": 4.5, "price_range": "thấp"},
            {"name": "Đà Lạt", "country": "Việt Nam", "rating": 4.6, "price_range": "trung_bình"},
            {"name": "Chiang Mai", "country": "Thái Lan", "rating": 4.7, "price_range": "trung_bình"},
            {"name": "Cameron Highlands", "country": "Malaysia", "rating": 4.3, "price_range": "trung_bình"},
            {"name": "Baguio", "country": "Philippines", "rating": 4.2, "price_range": "thấp"}
        ],
        "thành_phố": [
            {"name": "Hồ Chí Minh", "country": "Việt Nam", "rating": 4.4, "price_range": "trung_bình"},
            {"name": "Hà Nội", "country": "Việt Nam", "rating": 4.5, "price_range": "trung_bình"},
            {"name": "Singapore", "country": "Singapore", "rating": 4.8, "price_range": "cao"},
            {"name": "Bangkok", "country": "Thái Lan", "rating": 4.6, "price_range": "trung_bình"},
            {"name": "Kuala Lumpur", "country": "Malaysia", "rating": 4.3, "price_range": "trung_bình"}
        ],
        "miền_quê": [
            {"name": "Hội An", "country": "Việt Nam", "rating": 4.7, "price_range": "trung_bình"},
            {"name": "Huế", "country": "Việt Nam", "rating": 4.4, "price_range": "thấp"},
            {"name": "Mai Châu", "country": "Việt Nam", "rating": 4.3, "price_range": "thấp"},
            {"name": "Luang Prabang", "country": "Lào", "rating": 4.5, "price_range": "thấp"},
            {"name": "Bagan", "country": "Myanmar", "rating": 4.6, "price_range": "thấp"}
        ]
    }
    
    # Activity recommendations
    activity_mapping = {
        "ẩm_thực": [
            {"name": "Tham quan chợ đêm", "type": "văn_hóa", "duration": "2-3 giờ"},
            {"name": "Tham gia lớp học nấu ăn", "type": "trải_nghiệm", "duration": "3-4 giờ"},
            {"name": "Food tour đường phố", "type": "khám_phá", "duration": "2-3 giờ"},
            {"name": "Thưởng thức buffet cao cấp", "type": "nghỉ_dưỡng", "duration": "1-2 giờ"}
        ],
        "mua_sắm": [
            {"name": "Tham quan chợ truyền thống", "type": "văn_hóa", "duration": "2-3 giờ"},
            {"name": "Shopping tại trung tâm thương mại", "type": "hiện_đại", "duration": "3-4 giờ"},
            {"name": "Tìm kiếm đồ handmade", "type": "độc_đáo", "duration": "2-3 giờ"},
            {"name": "Mua sắm tại outlet", "type": "tiết_kiệm", "duration": "2-4 giờ"}
        ],
        "trekking": [
            {"name": "Đi bộ khám phá rừng", "type": "thiên_nhiên", "duration": "4-6 giờ"},
            {"name": "Leo núi ngắm cảnh", "type": "thể_thao", "duration": "6-8 giờ"},
            {"name": "Đi bộ đường dài", "type": "khám_phá", "duration": "2-3 ngày"},
            {"name": "Trekking vùng núi", "type": "phiêu_lưu", "duration": "1-2 ngày"}
        ],
        "lặn_biển": [
            {"name": "Lặn biển ngắm san hô", "type": "thiên_nhiên", "duration": "2-3 giờ"},
            {"name": "Snorkeling", "type": "nhẹ_nhàng", "duration": "1-2 giờ"},
            {"name": "Lặn sâu", "type": "phiêu_lưu", "duration": "3-4 giờ"},
            {"name": "Khám phá đại dương", "type": "khám_phá", "duration": "2-3 giờ"}
        ],
        "chụp_ảnh": [
            {"name": "Chụp ảnh tại điểm check-in", "type": "du_lịch", "duration": "1-2 giờ"},
            {"name": "Photography tour", "type": "chuyên_nghiệp", "duration": "3-4 giờ"},
            {"name": "Chụp ảnh hoàng hôn", "type": "lãng_mạn", "duration": "1-2 giờ"},
            {"name": "Chụp ảnh đường phố", "type": "nghệ_thuật", "duration": "2-3 giờ"}
        ]
    }
    
    # Get recommendations based on preferences
    destination_suggestions = destination_mapping.get(survey_data.dream_destination, [])
    activity_recommendations = []
    
    for activity in survey_data.activities:
        if activity in activity_mapping:
            activity_recommendations.extend(activity_mapping[activity])
    
    # Budget estimation
    budget_estimation = {
        "low": {"min": 2000000, "max": 5000000, "currency": "VND"},
        "medium": {"min": 5000000, "max": 15000000, "currency": "VND"},
        "high": {"min": 15000000, "max": 50000000, "currency": "VND"}
    }
    
    # Itinerary suggestions
    itinerary_suggestions = [
        {
            "day": 1,
            "title": "Ngày khởi hành",
            "activities": ["Check-in khách sạn", "Tham quan khu vực xung quanh", "Thưởng thức bữa tối địa phương"],
            "estimated_cost": 500000
        },
        {
            "day": 2,
            "title": "Khám phá chính",
            "activities": ["Tham quan điểm nổi bật", "Hoạt động theo sở thích", "Mua sắm quà lưu niệm"],
            "estimated_cost": 800000
        },
        {
            "day": 3,
            "title": "Trải nghiệm địa phương",
            "activities": ["Tham gia hoạt động văn hóa", "Thưởng thức ẩm thực", "Chụp ảnh kỷ niệm"],
            "estimated_cost": 600000
        }
    ]
    
    # Accommodation suggestions
    accommodation_suggestions = [
        {"type": "Khách sạn 3 sao", "price_range": "trung_bình", "amenities": ["WiFi", "Bể bơi", "Nhà hàng"]},
        {"type": "Resort", "price_range": "cao", "amenities": ["Spa", "Bãi biển riêng", "Dịch vụ cao cấp"]},
        {"type": "Homestay", "price_range": "thấp", "amenities": ["Trải nghiệm địa phương", "Bữa sáng", "Hướng dẫn viên"]}
    ]
    
    return PersonalizedRecommendation(
        destination_suggestions=destination_suggestions[:5],  # Top 5 recommendations
        activity_recommendations=activity_recommendations[:8],  # Top 8 activities
        budget_estimation=budget_estimation,
        itinerary_suggestions=itinerary_suggestions,
        accommodation_suggestions=accommodation_suggestions
    )
