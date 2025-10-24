from typing import Dict, List, Any
import os

class LanguageService:
    def __init__(self):
        self.default_language = os.getenv("DEFAULT_LANGUAGE", "vi")
        self.supported_languages = os.getenv("SUPPORTED_LANGUAGES", "vi,en").split(",")
        
        # Bản dịch cho các thông báo hệ thống
        self.system_messages = {
            "vi": {
                "trip_created": "Lịch trình du lịch đã được tạo thành công",
                "trip_updated": "Lịch trình du lịch đã được cập nhật",
                "trip_deleted": "Lịch trình du lịch đã được xóa",
                "feedback_submitted": "Phản hồi đã được gửi thành công",
                "user_registered": "Đăng ký tài khoản thành công",
                "user_logged_in": "Đăng nhập thành công",
                "error_occurred": "Đã xảy ra lỗi",
                "invalid_credentials": "Thông tin đăng nhập không chính xác",
                "access_denied": "Không có quyền truy cập",
                "not_found": "Không tìm thấy dữ liệu",
                "validation_error": "Dữ liệu không hợp lệ"
            },
            "en": {
                "trip_created": "Travel itinerary created successfully",
                "trip_updated": "Travel itinerary updated successfully", 
                "trip_deleted": "Travel itinerary deleted successfully",
                "feedback_submitted": "Feedback submitted successfully",
                "user_registered": "User registered successfully",
                "user_logged_in": "Login successful",
                "error_occurred": "An error occurred",
                "invalid_credentials": "Invalid credentials",
                "access_denied": "Access denied",
                "not_found": "Data not found",
                "validation_error": "Invalid data"
            }
        }
        
        # Bản dịch cho các loại hoạt động
        self.activity_types = {
            "vi": {
                "attraction": "Điểm tham quan",
                "restaurant": "Nhà hàng",
                "hotel": "Khách sạn",
                "transport": "Phương tiện",
                "shopping": "Mua sắm",
                "entertainment": "Giải trí"
            },
            "en": {
                "attraction": "Attraction",
                "restaurant": "Restaurant",
                "hotel": "Hotel",
                "transport": "Transport",
                "shopping": "Shopping",
                "entertainment": "Entertainment"
            }
        }
        
        # Bản dịch cho các loại ngân sách
        self.budget_types = {
            "vi": {
                "low": "Thấp",
                "medium": "Trung bình",
                "high": "Cao",
                "luxury": "Sang trọng"
            },
            "en": {
                "low": "Low",
                "medium": "Medium", 
                "high": "High",
                "luxury": "Luxury"
            }
        }
        
        # Bản dịch cho phong cách du lịch
        self.travel_styles = {
            "vi": {
                "adventure": "Phiêu lưu",
                "relaxation": "Thư giãn",
                "culture": "Văn hóa",
                "food": "Ẩm thực",
                "nature": "Thiên nhiên",
                "comfort": "Thoải mái"
            },
            "en": {
                "adventure": "Adventure",
                "relaxation": "Relaxation",
                "culture": "Culture",
                "food": "Food",
                "nature": "Nature",
                "comfort": "Comfort"
            }
        }
    
    def get_supported_languages(self) -> List[str]:
        """Get list of supported languages"""
        return self.supported_languages
    
    def is_language_supported(self, language: str) -> bool:
        """Check if language is supported"""
        return language in self.supported_languages
    
    def get_system_message(self, key: str, language: str = None) -> str:
        """Get system message in specified language"""
        lang = language or self.default_language
        return self.system_messages.get(lang, {}).get(key, key)
    
    def translate_activity_type(self, activity_type: str, language: str = None) -> str:
        """Translate activity type"""
        lang = language or self.default_language
        return self.activity_types.get(lang, {}).get(activity_type, activity_type)
    
    def translate_budget_type(self, budget_type: str, language: str = None) -> str:
        """Translate budget type"""
        lang = language or self.default_language
        return self.budget_types.get(lang, {}).get(budget_type, budget_type)
    
    def translate_travel_style(self, travel_style: str, language: str = None) -> str:
        """Translate travel style"""
        lang = language or self.default_language
        return self.travel_styles.get(lang, {}).get(travel_style, travel_style)
    
    def get_localized_response(self, data: Dict[str, Any], language: str = None) -> Dict[str, Any]:
        """Get localized response data"""
        lang = language or self.default_language
        
        # Deep copy để không thay đổi dữ liệu gốc
        localized_data = data.copy()
        
        # Dịch các trường cần thiết
        if isinstance(localized_data, dict):
            if "budget" in localized_data:
                localized_data["budget"] = self.translate_budget_type(localized_data["budget"], lang)
            if "travel_style" in localized_data:
                localized_data["travel_style"] = self.translate_travel_style(localized_data["travel_style"], lang)
            if "activities" in localized_data:
                for activity in localized_data["activities"]:
                    if "type" in activity:
                        activity["type"] = self.translate_activity_type(activity["type"], lang)
        
        return localized_data
    
    def format_currency(self, amount: float, language: str = None) -> str:
        """Format currency based on language"""
        lang = language or self.default_language
        
        if lang == "vi":
            return f"{amount:,.0f} VND"
        else:
            return f"${amount:,.2f}"
    
    def format_date(self, date_obj, language: str = None) -> str:
        """Format date based on language"""
        lang = language or self.default_language
        
        if lang == "vi":
            return date_obj.strftime("%d/%m/%Y")
        else:
            return date_obj.strftime("%m/%d/%Y")
    
    def get_language_info(self) -> Dict[str, Any]:
        """Get language configuration info"""
        return {
            "default_language": self.default_language,
            "supported_languages": self.supported_languages,
            "language_names": {
                "vi": "Tiếng Việt",
                "en": "English"
            }
        }
