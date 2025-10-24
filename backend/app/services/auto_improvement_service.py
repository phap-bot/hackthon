from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import asyncio
from app.database import get_database
from app.models.feedback_models import ImprovementSuggestion, FeedbackPriority
from app.services.ai_service import AITravelPlannerService

class AutoImprovementService:
    def __init__(self):
        self.db = None
        self.ai_service = AITravelPlannerService()
    
    async def get_database(self):
        if self.db is None:
            self.db = get_database()
        return self.db
    
    async def analyze_feedback_for_improvements(self, feedback_id: str) -> List[ImprovementSuggestion]:
        """Phân tích feedback để tạo gợi ý cải thiện tự động"""
        db = await self.get_database()
        
        # Get feedback
        feedback = await db.feedback.find_one({"_id": feedback_id})
        if not feedback:
            return []
        
        suggestions = []
        
        # Analyze based on feedback type
        if feedback["feedback_type"] == "bug_report":
            suggestions.extend(await self._analyze_bug_report(feedback))
        elif feedback["feedback_type"] == "feature_request":
            suggestions.extend(await self._analyze_feature_request(feedback))
        elif feedback["feedback_type"] == "trip_feedback":
            suggestions.extend(await self._analyze_trip_feedback(feedback))
        elif feedback["feedback_type"] == "service_feedback":
            suggestions.extend(await self._analyze_service_feedback(feedback))
        else:
            suggestions.extend(await self._analyze_general_feedback(feedback))
        
        # Save suggestions to database
        if suggestions:
            await db.improvement_suggestions.insert_many([suggestion.dict() for suggestion in suggestions])
        
        return suggestions
    
    async def _analyze_bug_report(self, feedback: Dict) -> List[ImprovementSuggestion]:
        """Phân tích bug report để tạo gợi ý cải thiện"""
        suggestions = []
        
        description = feedback.get("description", "").lower()
        bug_description = feedback.get("feedback_data", {}).get("bug_description", "").lower()
        
        # Analyze bug patterns
        if "performance" in description or "slow" in description or "lag" in description:
            suggestions.append(ImprovementSuggestion(
                feedback_id=feedback["_id"],
                suggestion_type="performance_optimization",
                title="Tối ưu hóa hiệu suất hệ thống",
                description="Cải thiện tốc độ xử lý và phản hồi của ứng dụng",
                priority=FeedbackPriority.HIGH,
                estimated_effort="medium",
                impact_score=8.0,
                feasibility_score=7.0
            ))
        
        if "ui" in description or "interface" in description or "design" in description:
            suggestions.append(ImprovementSuggestion(
                feedback_id=feedback["_id"],
                suggestion_type="ui_improvement",
                title="Cải thiện giao diện người dùng",
                description="Tối ưu hóa trải nghiệm người dùng và thiết kế giao diện",
                priority=FeedbackPriority.MEDIUM,
                estimated_effort="low",
                impact_score=6.0,
                feasibility_score=8.0
            ))
        
        if "error" in description or "crash" in description or "exception" in description:
            suggestions.append(ImprovementSuggestion(
                feedback_id=feedback["_id"],
                suggestion_type="error_handling",
                title="Cải thiện xử lý lỗi",
                description="Tăng cường hệ thống xử lý lỗi và thông báo lỗi thân thiện",
                priority=FeedbackPriority.HIGH,
                estimated_effort="medium",
                impact_score=9.0,
                feasibility_score=6.0
            ))
        
        return suggestions
    
    async def _analyze_feature_request(self, feedback: Dict) -> List[ImprovementSuggestion]:
        """Phân tích feature request để tạo gợi ý cải thiện"""
        suggestions = []
        
        feature_name = feedback.get("feedback_data", {}).get("feature_name", "")
        use_case = feedback.get("feedback_data", {}).get("use_case", "")
        expected_benefit = feedback.get("feedback_data", {}).get("expected_benefit", "")
        
        # Analyze feature request
        if "ai" in feature_name.lower() or "intelligent" in feature_name.lower():
            suggestions.append(ImprovementSuggestion(
                feedback_id=feedback["_id"],
                suggestion_type="ai_enhancement",
                title=f"Phát triển tính năng AI: {feature_name}",
                description=f"Tích hợp AI để {use_case}. Lợi ích: {expected_benefit}",
                priority=FeedbackPriority.MEDIUM,
                estimated_effort="high",
                impact_score=7.0,
                feasibility_score=5.0
            ))
        
        if "mobile" in feature_name.lower() or "app" in feature_name.lower():
            suggestions.append(ImprovementSuggestion(
                feedback_id=feedback["_id"],
                suggestion_type="mobile_development",
                title=f"Phát triển ứng dụng di động: {feature_name}",
                description=f"Tạo ứng dụng di động để {use_case}",
                priority=FeedbackPriority.MEDIUM,
                estimated_effort="high",
                impact_score=8.0,
                feasibility_score=6.0
            ))
        
        if "integration" in feature_name.lower() or "api" in feature_name.lower():
            suggestions.append(ImprovementSuggestion(
                feedback_id=feedback["_id"],
                suggestion_type="integration",
                title=f"Tích hợp API: {feature_name}",
                description=f"Tích hợp với dịch vụ bên thứ ba để {use_case}",
                priority=FeedbackPriority.LOW,
                estimated_effort="medium",
                impact_score=6.0,
                feasibility_score=7.0
            ))
        
        return suggestions
    
    async def _analyze_trip_feedback(self, feedback: Dict) -> List[ImprovementSuggestion]:
        """Phân tích trip feedback để cải thiện AI travel planner"""
        suggestions = []
        
        feedback_data = feedback.get("feedback_data", {})
        overall_rating = feedback_data.get("overall_rating", 0)
        
        if overall_rating <= 2:
            suggestions.append(ImprovementSuggestion(
                feedback_id=feedback["_id"],
                suggestion_type="ai_training",
                title="Cải thiện thuật toán AI lập kế hoạch du lịch",
                description="Cập nhật và cải thiện thuật toán AI để tạo lịch trình phù hợp hơn",
                priority=FeedbackPriority.HIGH,
                estimated_effort="high",
                impact_score=9.0,
                feasibility_score=6.0
            ))
        
        if feedback_data.get("itinerary_quality", 0) <= 2:
            suggestions.append(ImprovementSuggestion(
                feedback_id=feedback["_id"],
                suggestion_type="itinerary_optimization",
                title="Tối ưu hóa chất lượng lịch trình",
                description="Cải thiện logic tạo lịch trình và đề xuất hoạt động",
                priority=FeedbackPriority.HIGH,
                estimated_effort="medium",
                impact_score=8.0,
                feasibility_score=7.0
            ))
        
        if feedback_data.get("value_for_money", 0) <= 2:
            suggestions.append(ImprovementSuggestion(
                feedback_id=feedback["_id"],
                suggestion_type="pricing_optimization",
                title="Tối ưu hóa đề xuất giá cả",
                description="Cải thiện thuật toán tính toán chi phí và đề xuất giá phù hợp",
                priority=FeedbackPriority.MEDIUM,
                estimated_effort="medium",
                impact_score=7.0,
                feasibility_score=8.0
            ))
        
        return suggestions
    
    async def _analyze_service_feedback(self, feedback: Dict) -> List[ImprovementSuggestion]:
        """Phân tích service feedback để cải thiện dịch vụ"""
        suggestions = []
        
        feedback_data = feedback.get("feedback_data", {})
        service_rating = feedback_data.get("service_rating", 0)
        
        if service_rating <= 2:
            suggestions.append(ImprovementSuggestion(
                feedback_id=feedback["_id"],
                suggestion_type="customer_support",
                title="Cải thiện dịch vụ hỗ trợ khách hàng",
                description="Tăng cường chất lượng và tốc độ phản hồi hỗ trợ khách hàng",
                priority=FeedbackPriority.HIGH,
                estimated_effort="low",
                impact_score=8.0,
                feasibility_score=9.0
            ))
        
        response_time = feedback_data.get("response_time")
        if response_time and response_time > 60:  # More than 1 hour
            suggestions.append(ImprovementSuggestion(
                feedback_id=feedback["_id"],
                suggestion_type="response_time",
                title="Cải thiện thời gian phản hồi",
                description="Giảm thời gian phản hồi hỗ trợ khách hàng",
                priority=FeedbackPriority.MEDIUM,
                estimated_effort="low",
                impact_score=7.0,
                feasibility_score=8.0
            ))
        
        return suggestions
    
    async def _analyze_general_feedback(self, feedback: Dict) -> List[ImprovementSuggestion]:
        """Phân tích general feedback để tạo gợi ý cải thiện"""
        suggestions = []
        
        description = feedback.get("description", "").lower()
        
        # Analyze common themes
        if "slow" in description or "performance" in description:
            suggestions.append(ImprovementSuggestion(
                feedback_id=feedback["_id"],
                suggestion_type="performance",
                title="Cải thiện hiệu suất hệ thống",
                description="Tối ưu hóa tốc độ và hiệu suất của ứng dụng",
                priority=FeedbackPriority.MEDIUM,
                estimated_effort="medium",
                impact_score=7.0,
                feasibility_score=7.0
            ))
        
        if "confusing" in description or "difficult" in description:
            suggestions.append(ImprovementSuggestion(
                feedback_id=feedback["_id"],
                suggestion_type="usability",
                title="Cải thiện tính dễ sử dụng",
                description="Làm cho ứng dụng dễ sử dụng và thân thiện hơn",
                priority=FeedbackPriority.MEDIUM,
                estimated_effort="low",
                impact_score=6.0,
                feasibility_score=8.0
            ))
        
        return suggestions
    
    async def get_improvement_roadmap(self) -> Dict[str, Any]:
        """Tạo roadmap cải thiện dựa trên tất cả feedback"""
        db = await self.get_database()
        
        # Get all improvement suggestions
        suggestions = await db.improvement_suggestions.find({"status": "pending"}).to_list(length=None)
        
        # Group by suggestion type
        roadmap = {}
        
        for suggestion in suggestions:
            suggestion_type = suggestion["suggestion_type"]
            if suggestion_type not in roadmap:
                roadmap[suggestion_type] = {
                    "title": self._get_suggestion_type_title(suggestion_type),
                    "suggestions": [],
                    "total_impact": 0,
                    "total_feasibility": 0,
                    "count": 0
                }
            
            roadmap[suggestion_type]["suggestions"].append(suggestion)
            roadmap[suggestion_type]["total_impact"] += suggestion["impact_score"]
            roadmap[suggestion_type]["total_feasibility"] += suggestion["feasibility_score"]
            roadmap[suggestion_type]["count"] += 1
        
        # Calculate averages and sort by priority
        for suggestion_type in roadmap:
            roadmap[suggestion_type]["average_impact"] = (
                roadmap[suggestion_type]["total_impact"] / roadmap[suggestion_type]["count"]
            )
            roadmap[suggestion_type]["average_feasibility"] = (
                roadmap[suggestion_type]["total_feasibility"] / roadmap[suggestion_type]["count"]
            )
            roadmap[suggestion_type]["priority_score"] = (
                roadmap[suggestion_type]["average_impact"] * roadmap[suggestion_type]["average_feasibility"]
            )
        
        # Sort by priority score
        sorted_roadmap = dict(sorted(roadmap.items(), key=lambda x: x[1]["priority_score"], reverse=True))
        
        return {
            "roadmap": sorted_roadmap,
            "total_suggestions": len(suggestions),
            "high_priority_count": len([s for s in suggestions if s["priority"] == "high"]),
            "generated_at": datetime.utcnow()
        }
    
    def _get_suggestion_type_title(self, suggestion_type: str) -> str:
        """Lấy tiêu đề cho loại gợi ý"""
        titles = {
            "performance_optimization": "Tối ưu hóa hiệu suất",
            "ui_improvement": "Cải thiện giao diện",
            "error_handling": "Xử lý lỗi",
            "ai_enhancement": "Nâng cao AI",
            "mobile_development": "Phát triển di động",
            "integration": "Tích hợp API",
            "ai_training": "Huấn luyện AI",
            "itinerary_optimization": "Tối ưu lịch trình",
            "pricing_optimization": "Tối ưu giá cả",
            "customer_support": "Hỗ trợ khách hàng",
            "response_time": "Thời gian phản hồi",
            "performance": "Hiệu suất",
            "usability": "Tính dễ sử dụng"
        }
        return titles.get(suggestion_type, suggestion_type)
    
    async def implement_improvement(self, suggestion_id: str, implementation_notes: str) -> bool:
        """Đánh dấu gợi ý cải thiện đã được thực hiện"""
        db = await self.get_database()
        
        result = await db.improvement_suggestions.update_one(
            {"_id": suggestion_id},
            {
                "$set": {
                    "status": "implemented",
                    "implementation_notes": implementation_notes,
                    "implemented_at": datetime.utcnow()
                }
            }
        )
        
        return result.modified_count > 0
