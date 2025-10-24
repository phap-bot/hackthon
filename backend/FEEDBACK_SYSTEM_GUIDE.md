# 📊 Hệ thống Feedback Management - Hướng dẫn sử dụng

## Tổng quan

Hệ thống Feedback Management được thiết kế để thu thập, phân tích và xử lý feedback từ khách hàng một cách toàn diện. Hệ thống bao gồm:

- **Thu thập feedback đa dạng**: Trip feedback, service feedback, feature requests, bug reports
- **Phân tích tự động**: Sentiment analysis, trend analysis, customer satisfaction
- **Cải thiện tự động**: Tự động tạo gợi ý cải thiện dựa trên feedback
- **Dashboard quản trị**: Theo dõi và quản lý feedback hiệu quả

## 🏗️ Kiến trúc hệ thống

### Database Collections

```
feedback/                    # Feedback chính
├── feedback_replies/        # Phản hồi cho feedback
├── feedback_votes/          # Vote cho feedback
└── improvement_suggestions/ # Gợi ý cải thiện tự động
```

### Services

```
FeedbackAnalyticsService     # Phân tích feedback
AutoImprovementService       # Tự động cải thiện
```

## 📝 Các loại Feedback

### 1. Trip Feedback
Feedback về chuyến đi du lịch:
- Overall rating (1-5)
- Value for money (1-5)
- Itinerary quality (1-5)
- Accommodation rating (1-5)
- Food rating (1-5)
- Transportation rating (1-5)
- Attractions rating (1-5)
- Would recommend (boolean)
- Favorite/least favorite activities
- Suggestions

### 2. Service Feedback
Feedback về dịch vụ:
- Service name
- Service rating (1-5)
- Response time (minutes)
- Helpfulness (1-5)
- Professionalism (1-5)

### 3. Feature Request
Yêu cầu tính năng mới:
- Feature name
- Use case
- Expected benefit
- Urgency level

### 4. Bug Report
Báo cáo lỗi:
- Bug description
- Steps to reproduce
- Expected vs actual behavior
- Browser/device info
- Screenshots

### 5. General Feedback
Feedback chung:
- Title
- Description
- Category
- Tags

## 🔧 API Endpoints

### Feedback Management

#### Tạo Feedback
```bash
POST /api/feedback
```

Request Body:
```json
{
  "feedback_type": "trip_feedback",
  "category": "user_experience",
  "priority": "medium",
  "title": "Chuyến đi tuyệt vời",
  "description": "Tôi rất hài lòng với chuyến đi...",
  "rating": 5,
  "tags": ["positive", "recommend"],
  "language": "vi",
  "is_anonymous": false,
  "trip_id": "trip_123",
  "feedback_data": {
    "overall_rating": 5,
    "value_for_money": 4,
    "itinerary_quality": 5,
    "would_recommend": true
  }
}
```

#### Lấy danh sách Feedback
```bash
GET /api/feedback?skip=0&limit=20&feedback_type=trip_feedback&status=pending
```

#### Lấy chi tiết Feedback
```bash
GET /api/feedback/{feedback_id}
```

#### Cập nhật Feedback (Admin)
```bash
PUT /api/feedback/{feedback_id}
```

Request Body:
```json
{
  "status": "resolved",
  "priority": "high",
  "assigned_to": "admin_user",
  "admin_notes": "Đã xử lý xong",
  "resolution_notes": "Khách hàng hài lòng với giải pháp"
}
```

#### Vote cho Feedback
```bash
POST /api/feedback/{feedback_id}/vote?vote_type=up
```

#### Trả lời Feedback
```bash
POST /api/feedback/{feedback_id}/reply
```

Request Body:
```json
{
  "content": "Cảm ơn bạn đã phản hồi. Chúng tôi sẽ cải thiện..."
}
```

### Analytics & Insights

#### Lấy Analytics
```bash
GET /api/feedback/analytics?start_date=2024-01-01&end_date=2024-12-31
```

Response:
```json
{
  "total_feedback": 1250,
  "feedback_by_type": {
    "trip_feedback": 800,
    "service_feedback": 200,
    "feature_request": 150,
    "bug_report": 100
  },
  "feedback_by_status": {
    "pending": 50,
    "resolved": 1000,
    "closed": 200
  },
  "average_rating": 4.2,
  "rating_distribution": {
    "5": 400,
    "4": 300,
    "3": 200,
    "2": 50,
    "1": 50
  },
  "monthly_trend": [...],
  "top_tags": [...],
  "response_time_stats": {
    "average": 24.5,
    "median": 18.0,
    "min": 2.0,
    "max": 72.0
  }
}
```

#### Lấy Insights
```bash
GET /api/feedback/insights
```

Response:
```json
{
  "sentiment_analysis": {
    "positive": 800,
    "negative": 200,
    "neutral": 250,
    "positive_percentage": 64.0,
    "negative_percentage": 16.0,
    "neutral_percentage": 20.0
  },
  "common_issues": [
    {
      "issue_type": "performance",
      "count": 150,
      "percentage": 12.0
    }
  ],
  "feature_requests": [...],
  "improvement_suggestions": [
    "Cải thiện tốc độ hệ thống",
    "Tối ưu hóa giao diện người dùng"
  ],
  "customer_satisfaction_score": 4.2,
  "net_promoter_score": 65.0
}
```

### Dashboard Admin

#### Thống kê Dashboard
```bash
GET /api/dashboard/stats?days=30
```

#### Xu hướng Feedback
```bash
GET /api/dashboard/trends?days=30
```

#### Tóm tắt Feedback
```bash
GET /api/dashboard/feedback-summary
```

#### Chi tiết Feedback
```bash
GET /api/dashboard/feedback-details/{feedback_id}
```

#### Giao Feedback
```bash
POST /api/dashboard/feedback/{feedback_id}/assign
```

Request Body:
```json
{
  "assigned_to": "admin_user"
}
```

#### Giải quyết Feedback
```bash
POST /api/dashboard/feedback/{feedback_id}/resolve
```

Request Body:
```json
{
  "resolution_notes": "Đã giải quyết vấn đề của khách hàng"
}
```

### Auto Improvement

#### Lấy Roadmap cải thiện
```bash
GET /api/feedback/improvement-roadmap
```

Response:
```json
{
  "roadmap": {
    "performance_optimization": {
      "title": "Tối ưu hóa hiệu suất",
      "suggestions": [...],
      "average_impact": 8.5,
      "average_feasibility": 7.0,
      "priority_score": 59.5,
      "count": 15
    }
  },
  "total_suggestions": 50,
  "high_priority_count": 12,
  "generated_at": "2024-01-01T00:00:00Z"
}
```

#### Đánh dấu đã thực hiện
```bash
POST /api/feedback/improvement/{suggestion_id}/implement
```

Request Body:
```json
{
  "implementation_notes": "Đã tối ưu hóa database queries"
}
```

## 📊 Dashboard Features

### 1. Thống kê tổng quan
- Tổng số feedback
- Feedback đang chờ xử lý
- Feedback đã giải quyết
- Feedback ưu tiên cao
- Điểm đánh giá trung bình
- Customer Satisfaction Score
- Net Promoter Score
- Thời gian phản hồi trung bình

### 2. Xu hướng theo thời gian
- Biểu đồ feedback theo ngày/tháng
- Phân tích sentiment theo thời gian
- Xu hướng rating
- So sánh positive vs negative

### 3. Phân tích chi tiết
- Feedback theo loại
- Feedback theo trạng thái
- Top issues
- Top suggestions
- Phân tích theo category

### 4. Quản lý workflow
- Giao feedback cho người xử lý
- Theo dõi tiến độ
- Ghi chú admin
- Đánh dấu đã giải quyết

## 🤖 Auto Improvement System

### Cách hoạt động

1. **Phân tích Feedback**: Hệ thống tự động phân tích feedback mới
2. **Tạo Gợi ý**: Dựa trên nội dung, tạo gợi ý cải thiện cụ thể
3. **Đánh giá Priority**: Tính toán impact score và feasibility score
4. **Roadmap**: Tạo roadmap cải thiện theo độ ưu tiên

### Loại gợi ý cải thiện

#### Performance Optimization
- Cải thiện tốc độ hệ thống
- Tối ưu hóa database
- Giảm thời gian phản hồi

#### UI/UX Improvement
- Cải thiện giao diện
- Tăng tính dễ sử dụng
- Tối ưu hóa trải nghiệm người dùng

#### Feature Enhancement
- Thêm tính năng mới
- Cải thiện tính năng hiện có
- Tích hợp AI

#### Bug Fixes
- Sửa lỗi được báo cáo
- Cải thiện error handling
- Tăng độ ổn định

#### Customer Support
- Cải thiện hỗ trợ khách hàng
- Giảm thời gian phản hồi
- Tăng chất lượng dịch vụ

## 📈 Analytics & Reporting

### Metrics quan trọng

1. **Customer Satisfaction Score (CSAT)**
   - Điểm đánh giá trung bình
   - Phần trăm khách hàng hài lòng

2. **Net Promoter Score (NPS)**
   - Promoters (rating 4-5)
   - Detractors (rating 1-2)
   - NPS = (Promoters - Detractors) / Total * 100

3. **Response Time**
   - Thời gian phản hồi trung bình
   - Thời gian giải quyết

4. **Feedback Volume**
   - Số lượng feedback theo thời gian
   - Xu hướng tăng/giảm

### Sentiment Analysis

Hệ thống tự động phân tích sentiment của feedback:

- **Positive**: Từ khóa tích cực (tốt, tuyệt vời, hài lòng...)
- **Negative**: Từ khóa tiêu cực (tệ, thất vọng, khó chịu...)
- **Neutral**: Không có từ khóa rõ ràng

### Trend Analysis

- Xu hướng feedback theo tháng
- Phân tích theo category
- So sánh với các giai đoạn trước

## 🔧 Cấu hình

### Environment Variables

```env
# Feedback system settings
FEEDBACK_AUTO_ANALYSIS=true
FEEDBACK_NOTIFICATION_EMAIL=admin@example.com
FEEDBACK_RESPONSE_TIME_TARGET=24  # hours
```

### Database Indexes

Hệ thống tự động tạo các indexes để tối ưu hiệu suất:

```javascript
// Feedback indexes
db.feedback.createIndex({ "feedback_type": 1 });
db.feedback.createIndex({ "status": 1 });
db.feedback.createIndex({ "priority": 1 });
db.feedback.createIndex({ "created_at": 1 });
db.feedback.createIndex({ "rating": 1 });
db.feedback.createIndex({ "tags": 1 });

// Replies indexes
db.feedback_replies.createIndex({ "feedback_id": 1 });
db.feedback_replies.createIndex({ "created_at": 1 });

// Votes indexes
db.feedback_votes.createIndex({ "feedback_id": 1, "user_id": 1 }, { unique: true });

// Suggestions indexes
db.improvement_suggestions.createIndex({ "suggestion_type": 1 });
db.improvement_suggestions.createIndex({ "status": 1 });
db.improvement_suggestions.createIndex({ "priority": 1 });
```

## 🚀 Deployment

### 1. Database Setup

```bash
# Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Initialize database
mongosh mongodb://localhost:27017/travel_planner < mongo-init.js
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Test API

```bash
# Test feedback creation
curl -X POST "http://localhost:8000/api/feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "feedback_type": "trip_feedback",
    "title": "Test feedback",
    "description": "This is a test feedback",
    "rating": 5
  }'

# Test analytics
curl -X GET "http://localhost:8000/api/feedback/analytics"
```

## 📱 Frontend Integration

### React Component Example

```jsx
import React, { useState } from 'react';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState({
    feedback_type: 'trip_feedback',
    title: '',
    description: '',
    rating: 5
  });

  const submitFeedback = async () => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(feedback)
      });
      
      const result = await response.json();
      console.log('Feedback submitted:', result);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <form onSubmit={submitFeedback}>
      <input
        type="text"
        placeholder="Tiêu đề feedback"
        value={feedback.title}
        onChange={(e) => setFeedback({...feedback, title: e.target.value})}
      />
      <textarea
        placeholder="Mô tả chi tiết"
        value={feedback.description}
        onChange={(e) => setFeedback({...feedback, description: e.target.value})}
      />
      <select
        value={feedback.rating}
        onChange={(e) => setFeedback({...feedback, rating: parseInt(e.target.value)})}
      >
        <option value={5}>5 - Rất hài lòng</option>
        <option value={4}>4 - Hài lòng</option>
        <option value={3}>3 - Bình thường</option>
        <option value={2}>2 - Không hài lòng</option>
        <option value={1}>1 - Rất không hài lòng</option>
      </select>
      <button type="submit">Gửi Feedback</button>
    </form>
  );
};
```

## 🔍 Monitoring & Alerts

### Key Metrics to Monitor

1. **Feedback Volume**
   - Số lượng feedback mới mỗi ngày
   - Alert nếu giảm đột ngột

2. **Response Time**
   - Thời gian phản hồi trung bình
   - Alert nếu vượt quá target

3. **Customer Satisfaction**
   - CSAT score
   - Alert nếu giảm dưới ngưỡng

4. **High Priority Issues**
   - Số lượng feedback urgent/high priority
   - Alert nếu tăng đột biến

### Dashboard Alerts

```javascript
// Example alert configuration
const alerts = {
  low_satisfaction: {
    condition: "csat_score < 3.5",
    message: "Customer satisfaction score thấp",
    action: "notify_admin"
  },
  high_response_time: {
    condition: "avg_response_time > 48",
    message: "Thời gian phản hồi quá lâu",
    action: "escalate_to_manager"
  },
  urgent_feedback_spike: {
    condition: "urgent_feedback_count > 10",
    message: "Quá nhiều feedback urgent",
    action: "notify_all_admins"
  }
};
```

## 📚 Best Practices

### 1. Feedback Collection
- Đặt câu hỏi cụ thể và rõ ràng
- Sử dụng rating scale nhất quán
- Cho phép feedback ẩn danh
- Hỗ trợ đa ngôn ngữ

### 2. Response Management
- Phản hồi nhanh chóng (< 24h)
- Cá nhân hóa phản hồi
- Theo dõi đến khi giải quyết
- Ghi chú chi tiết

### 3. Analytics Usage
- Theo dõi trends thường xuyên
- Phân tích root causes
- Đo lường impact của cải thiện
- Báo cáo định kỳ

### 4. Continuous Improvement
- Implement suggestions nhanh chóng
- Đo lường hiệu quả
- Học hỏi từ feedback
- Cập nhật processes

---

**🎯 Hệ thống Feedback Management giúp bạn hiểu rõ khách hàng và cải thiện dịch vụ liên tục!**
