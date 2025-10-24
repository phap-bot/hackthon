from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from collections import Counter
import re
import asyncio
from app.database import get_database
from app.models.feedback_models import FeedbackAnalytics, FeedbackInsights

class FeedbackAnalyticsService:
    def __init__(self):
        self.db = None
    
    async def get_database(self):
        if self.db is None:
            self.db = get_database()
        return self.db
    
    async def get_feedback_analytics(self, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> FeedbackAnalytics:
        """Tính toán analytics tổng quan về feedback"""
        db = await self.get_database()
        
        # Build date filter
        date_filter = {}
        if start_date:
            date_filter["$gte"] = start_date
        if end_date:
            date_filter["$lte"] = end_date
        if date_filter:
            query = {"created_at": date_filter}
        else:
            query = {}
        
        # Get all feedback
        feedback_list = await db.feedback.find(query).to_list(length=None)
        
        if not feedback_list:
            return self._empty_analytics()
        
        # Calculate basic stats
        total_feedback = len(feedback_list)
        
        # Feedback by type
        feedback_by_type = Counter(fb["feedback_type"] for fb in feedback_list)
        
        # Feedback by status
        feedback_by_status = Counter(fb["status"] for fb in feedback_list)
        
        # Feedback by priority
        feedback_by_priority = Counter(fb["priority"] for fb in feedback_list)
        
        # Feedback by category
        feedback_by_category = Counter(fb["category"] for fb in feedback_list)
        
        # Rating statistics
        ratings = [fb["rating"] for fb in feedback_list if fb.get("rating")]
        average_rating = sum(ratings) / len(ratings) if ratings else 0.0
        
        rating_distribution = Counter(ratings)
        
        # Monthly trend
        monthly_trend = await self._calculate_monthly_trend(feedback_list)
        
        # Top tags
        all_tags = []
        for fb in feedback_list:
            all_tags.extend(fb.get("tags", []))
        top_tags = Counter(all_tags).most_common(10)
        
        # Response time stats
        response_time_stats = await self._calculate_response_time_stats(feedback_list)
        
        return FeedbackAnalytics(
            total_feedback=total_feedback,
            feedback_by_type=dict(feedback_by_type),
            feedback_by_status=dict(feedback_by_status),
            feedback_by_priority=dict(feedback_by_priority),
            feedback_by_category=dict(feedback_by_category),
            average_rating=average_rating,
            rating_distribution=dict(rating_distribution),
            monthly_trend=monthly_trend,
            top_tags=[{"tag": tag, "count": count} for tag, count in top_tags],
            response_time_stats=response_time_stats
        )
    
    async def get_feedback_insights(self, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> FeedbackInsights:
        """Phân tích insights từ feedback"""
        db = await self.get_database()
        
        # Build date filter
        date_filter = {}
        if start_date:
            date_filter["$gte"] = start_date
        if end_date:
            date_filter["$lte"] = end_date
        if date_filter:
            query = {"created_at": date_filter}
        else:
            query = {}
        
        feedback_list = await db.feedback.find(query).to_list(length=None)
        
        if not feedback_list:
            return self._empty_insights()
        
        # Sentiment analysis
        sentiment_analysis = await self._analyze_sentiment(feedback_list)
        
        # Common issues
        common_issues = await self._identify_common_issues(feedback_list)
        
        # Feature requests
        feature_requests = await self._extract_feature_requests(feedback_list)
        
        # Improvement suggestions
        improvement_suggestions = await self._generate_improvement_suggestions(feedback_list)
        
        # Customer satisfaction score
        satisfaction_score = await self._calculate_satisfaction_score(feedback_list)
        
        # Net Promoter Score
        nps_score = await self._calculate_nps_score(feedback_list)
        
        return FeedbackInsights(
            sentiment_analysis=sentiment_analysis,
            common_issues=common_issues,
            feature_requests=feature_requests,
            improvement_suggestions=improvement_suggestions,
            customer_satisfaction_score=satisfaction_score,
            net_promoter_score=nps_score
        )
    
    async def _calculate_monthly_trend(self, feedback_list: List[Dict]) -> List[Dict[str, Any]]:
        """Tính toán xu hướng theo tháng"""
        monthly_data = {}
        
        for fb in feedback_list:
            month_key = fb["created_at"].strftime("%Y-%m")
            if month_key not in monthly_data:
                monthly_data[month_key] = {
                    "month": month_key,
                    "count": 0,
                    "average_rating": 0,
                    "positive_count": 0,
                    "negative_count": 0
                }
            
            monthly_data[month_key]["count"] += 1
            
            if fb.get("rating"):
                monthly_data[month_key]["average_rating"] += fb["rating"]
                if fb["rating"] >= 4:
                    monthly_data[month_key]["positive_count"] += 1
                elif fb["rating"] <= 2:
                    monthly_data[month_key]["negative_count"] += 1
        
        # Calculate averages
        for month_data in monthly_data.values():
            if month_data["count"] > 0:
                month_data["average_rating"] = month_data["average_rating"] / month_data["count"]
        
        return list(monthly_data.values())
    
    async def _calculate_response_time_stats(self, feedback_list: List[Dict]) -> Dict[str, float]:
        """Tính toán thống kê thời gian phản hồi"""
        response_times = []
        
        for fb in feedback_list:
            if fb.get("resolved_at") and fb.get("created_at"):
                response_time = (fb["resolved_at"] - fb["created_at"]).total_seconds() / 3600  # hours
                response_times.append(response_time)
        
        if not response_times:
            return {"average": 0, "median": 0, "min": 0, "max": 0}
        
        response_times.sort()
        return {
            "average": sum(response_times) / len(response_times),
            "median": response_times[len(response_times) // 2],
            "min": min(response_times),
            "max": max(response_times)
        }
    
    async def _analyze_sentiment(self, feedback_list: List[Dict]) -> Dict[str, Any]:
        """Phân tích sentiment của feedback"""
        positive_keywords = [
            "tốt", "tuyệt vời", "hài lòng", "thích", "yêu thích", "xuất sắc", "hoàn hảo",
            "good", "excellent", "amazing", "wonderful", "fantastic", "perfect", "great"
        ]
        negative_keywords = [
            "tệ", "xấu", "không hài lòng", "thất vọng", "tồi tệ", "khó chịu", "bực mình",
            "bad", "terrible", "awful", "disappointed", "frustrated", "annoyed", "poor"
        ]
        
        positive_count = 0
        negative_count = 0
        neutral_count = 0
        
        for fb in feedback_list:
            text = (fb.get("title", "") + " " + fb.get("description", "")).lower()
            
            positive_score = sum(1 for keyword in positive_keywords if keyword in text)
            negative_score = sum(1 for keyword in negative_keywords if keyword in text)
            
            if positive_score > negative_score:
                positive_count += 1
            elif negative_score > positive_score:
                negative_count += 1
            else:
                neutral_count += 1
        
        total = positive_count + negative_count + neutral_count
        
        return {
            "positive": positive_count,
            "negative": negative_count,
            "neutral": neutral_count,
            "positive_percentage": (positive_count / total * 100) if total > 0 else 0,
            "negative_percentage": (negative_count / total * 100) if total > 0 else 0,
            "neutral_percentage": (neutral_count / total * 100) if total > 0 else 0
        }
    
    async def _identify_common_issues(self, feedback_list: List[Dict]) -> List[Dict[str, Any]]:
        """Xác định các vấn đề phổ biến"""
        issue_keywords = {
            "slow_performance": ["chậm", "lag", "slow", "performance", "tốc độ"],
            "ui_issues": ["giao diện", "ui", "design", "khó sử dụng", "confusing"],
            "bug_issues": ["lỗi", "bug", "crash", "error", "không hoạt động"],
            "feature_missing": ["thiếu", "missing", "cần thêm", "need more"],
            "support_issues": ["hỗ trợ", "support", "không trả lời", "no response"]
        }
        
        issue_counts = {}
        
        for fb in feedback_list:
            text = (fb.get("title", "") + " " + fb.get("description", "")).lower()
            
            for issue_type, keywords in issue_keywords.items():
                if any(keyword in text for keyword in keywords):
                    issue_counts[issue_type] = issue_counts.get(issue_type, 0) + 1
        
        return [
            {"issue_type": issue_type, "count": count, "percentage": (count / len(feedback_list) * 100)}
            for issue_type, count in sorted(issue_counts.items(), key=lambda x: x[1], reverse=True)
        ]
    
    async def _extract_feature_requests(self, feedback_list: List[Dict]) -> List[Dict[str, Any]]:
        """Trích xuất các yêu cầu tính năng"""
        feature_requests = []
        
        for fb in feedback_list:
            if fb.get("feedback_type") == "feature_request":
                feature_requests.append({
                    "title": fb.get("title", ""),
                    "description": fb.get("description", ""),
                    "priority": fb.get("priority", "medium"),
                    "created_at": fb.get("created_at"),
                    "votes": fb.get("like_count", 0)
                })
        
        # Sort by votes and priority
        feature_requests.sort(key=lambda x: (x["votes"], x["priority"]), reverse=True)
        
        return feature_requests[:10]  # Top 10 feature requests
    
    async def _generate_improvement_suggestions(self, feedback_list: List[Dict]) -> List[str]:
        """Tạo gợi ý cải thiện dựa trên feedback"""
        suggestions = []
        
        # Analyze common themes
        themes = {
            "performance": ["cải thiện tốc độ", "tối ưu hóa hiệu suất"],
            "ui_ux": ["cải thiện giao diện", "làm cho dễ sử dụng hơn"],
            "features": ["thêm tính năng mới", "mở rộng chức năng"],
            "support": ["cải thiện hỗ trợ khách hàng", "tăng cường phản hồi"],
            "content": ["cập nhật nội dung", "làm phong phú thông tin"]
        }
        
        # Count theme occurrences
        theme_counts = {}
        for fb in feedback_list:
            text = (fb.get("title", "") + " " + fb.get("description", "")).lower()
            
            for theme, keywords in themes.items():
                if any(keyword in text for keyword in keywords):
                    theme_counts[theme] = theme_counts.get(theme, 0) + 1
        
        # Generate suggestions based on most common themes
        for theme, count in sorted(theme_counts.items(), key=lambda x: x[1], reverse=True):
            if count > len(feedback_list) * 0.1:  # If more than 10% of feedback mentions this theme
                suggestions.extend(themes[theme])
        
        return suggestions[:5]  # Top 5 suggestions
    
    async def _calculate_satisfaction_score(self, feedback_list: List[Dict]) -> float:
        """Tính điểm hài lòng khách hàng"""
        ratings = [fb["rating"] for fb in feedback_list if fb.get("rating")]
        
        if not ratings:
            return 0.0
        
        # Weighted average based on rating distribution
        weighted_sum = sum(rating for rating in ratings)
        return weighted_sum / len(ratings)
    
    async def _calculate_nps_score(self, feedback_list: List[Dict]) -> float:
        """Tính Net Promoter Score"""
        ratings = [fb["rating"] for fb in feedback_list if fb.get("rating")]
        
        if not ratings:
            return 0.0
        
        promoters = len([r for r in ratings if r >= 4])
        detractors = len([r for r in ratings if r <= 2])
        total = len(ratings)
        
        if total == 0:
            return 0.0
        
        nps = ((promoters - detractors) / total) * 100
        return nps
    
    def _empty_analytics(self) -> FeedbackAnalytics:
        """Trả về analytics rỗng"""
        return FeedbackAnalytics(
            total_feedback=0,
            feedback_by_type={},
            feedback_by_status={},
            feedback_by_priority={},
            feedback_by_category={},
            average_rating=0.0,
            rating_distribution={},
            monthly_trend=[],
            top_tags=[],
            response_time_stats={"average": 0, "median": 0, "min": 0, "max": 0}
        )
    
    def _empty_insights(self) -> FeedbackInsights:
        """Trả về insights rỗng"""
        return FeedbackInsights(
            sentiment_analysis={"positive": 0, "negative": 0, "neutral": 0},
            common_issues=[],
            feature_requests=[],
            improvement_suggestions=[],
            customer_satisfaction_score=0.0,
            net_promoter_score=0.0
        )
