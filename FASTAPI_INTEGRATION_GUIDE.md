# 🚀 FASTAPI BACKEND INTEGRATION GUIDE

## 📋 Tổng quan

Hướng dẫn này mô tả cách tích hợp Frontend Next.js với FastAPI Backend cho dự án AI Travel Planner.

## 🔗 API Endpoints

### **1. Travel Planner API**
```
POST /api/travel-planner
```

**Request Body:**
```json
{
  "budget": "medium",
  "people": 2,
  "days": 5,
  "destination": "Tokyo, Japan",
  "startDate": "2024-03-15",
  "travelStyle": "comfort",
  "interests": ["food", "culture", "nature"]
}
```

**Response:**
```json
{
  "tripId": "trip_123456",
  "status": "success",
  "message": "Itinerary generated successfully"
}
```

### **2. Itinerary Details API**
```
GET /api/itinerary/{tripId}
```

**Response:**
```json
{
  "tripId": "trip_123456",
  "destination": "Tokyo, Japan",
  "totalDays": 5,
  "totalCost": 12500000,
  "startDate": "2024-03-15",
  "endDate": "2024-03-19",
  "days": [
    {
      "day": 1,
      "date": "2024-03-15",
      "estimatedCost": 2500000,
      "activities": [
        {
          "id": "1",
          "name": "Sân bay Narita → Khách sạn",
          "type": "transport",
          "time": "08:00",
          "duration": "2h",
          "cost": 500000,
          "description": "Đón taxi từ sân bay đến khách sạn ở Shibuya",
          "location": "Narita → Shibuya",
          "rating": 4.5
        }
      ]
    }
  ],
  "summary": {
    "totalAttractions": 8,
    "totalRestaurants": 6,
    "totalHotels": 1,
    "averageRating": 4.7
  }
}
```

### **3. Feedback API**
```
POST /api/feedback
```

**Request Body:**
```json
{
  "tripId": "trip_123456",
  "feedback": {
    "overallRating": 5,
    "valueForMoney": 4,
    "itineraryQuality": 5,
    "accommodationRating": 4,
    "foodRating": 5,
    "transportationRating": 4,
    "attractionsRating": 5,
    "wouldRecommend": true,
    "favoriteActivity": "Tham quan Senso-ji Temple",
    "leastFavoriteActivity": "Chờ đợi quá lâu tại nhà hàng",
    "suggestions": "Cần thêm thông tin về phương tiện công cộng",
    "additionalComments": "Chuyến đi rất tuyệt vời!"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Feedback submitted successfully",
  "feedbackId": "feedback_789"
}
```

### **4. Admin APIs**

#### **Get All Trips**
```
GET /api/admin/trips
```

#### **Get Admin Stats**
```
GET /api/admin/stats
```

**Response:**
```json
{
  "totalTrips": 1247,
  "completedTrips": 1156,
  "totalRevenue": 15600000000,
  "averageRating": 4.7,
  "activeUsers": 892
}
```

## 🛠️ FastAPI Backend Setup

### **1. Cài đặt FastAPI**
```bash
pip install fastapi uvicorn python-multipart
```

### **2. Cấu trúc thư mục FastAPI**
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── trip.py
│   │   └── feedback.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── travel_planner.py
│   │   ├── itinerary.py
│   │   ├── feedback.py
│   │   └── admin.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_service.py
│   │   └── database_service.py
│   └── utils/
│       ├── __init__.py
│       └── helpers.py
├── requirements.txt
└── README.md
```

### **3. Main FastAPI App (main.py)**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import travel_planner, itinerary, feedback, admin

app = FastAPI(title="AI Travel Planner API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(travel_planner.router, prefix="/api", tags=["travel-planner"])
app.include_router(itinerary.router, prefix="/api", tags=["itinerary"])
app.include_router(feedback.router, prefix="/api", tags=["feedback"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

@app.get("/")
async def root():
    return {"message": "AI Travel Planner API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### **4. Travel Planner Router (routers/travel_planner.py)**
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_service import AITravelPlannerService

router = APIRouter()

class TravelPlannerRequest(BaseModel):
    budget: str
    people: int
    days: int
    destination: str
    start_date: str
    travel_style: str
    interests: list[str] = []

class TravelPlannerResponse(BaseModel):
    trip_id: str
    status: str
    message: str

@router.post("/travel-planner", response_model=TravelPlannerResponse)
async def create_travel_plan(request: TravelPlannerRequest):
    try:
        # Call AI service to generate itinerary
        ai_service = AITravelPlannerService()
        trip_id = await ai_service.generate_itinerary(request)
        
        return TravelPlannerResponse(
            trip_id=trip_id,
            status="success",
            message="Itinerary generated successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 🔧 Environment Variables

### **Frontend (.env.local)**
```env
FASTAPI_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### **Backend (.env)**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/travel_db
OPENAI_API_KEY=your-openai-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
WEATHER_API_KEY=your-weather-api-key
```

## 🚀 Chạy dự án

### **1. Chạy FastAPI Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **2. Chạy Next.js Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 📊 Database Schema

### **Trips Table**
```sql
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    total_cost DECIMAL(12,2) NOT NULL,
    people INTEGER NOT NULL,
    budget VARCHAR(50) NOT NULL,
    travel_style VARCHAR(50) NOT NULL,
    interests TEXT[],
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Activities Table**
```sql
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id),
    day INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    time TIME NOT NULL,
    duration VARCHAR(50) NOT NULL,
    cost DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    location VARCHAR(255),
    rating DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Feedback Table**
```sql
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id),
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    value_for_money INTEGER NOT NULL CHECK (value_for_money >= 1 AND value_for_money <= 5),
    itinerary_quality INTEGER NOT NULL CHECK (itinerary_quality >= 1 AND itinerary_quality <= 5),
    accommodation_rating INTEGER NOT NULL CHECK (accommodation_rating >= 1 AND accommodation_rating <= 5),
    food_rating INTEGER NOT NULL CHECK (food_rating >= 1 AND food_rating <= 5),
    transportation_rating INTEGER NOT NULL CHECK (transportation_rating >= 1 AND transportation_rating <= 5),
    attractions_rating INTEGER NOT NULL CHECK (attractions_rating >= 1 AND attractions_rating <= 5),
    would_recommend BOOLEAN NOT NULL,
    favorite_activity TEXT,
    least_favorite_activity TEXT,
    suggestions TEXT,
    additional_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Authentication (Optional)

Nếu cần authentication, có thể thêm JWT:

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
import jwt

security = HTTPBearer()

def get_current_user(token: str = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

## 🧪 Testing

### **Test API với curl:**
```bash
# Test travel planner
curl -X POST "http://localhost:8000/api/travel-planner" \
  -H "Content-Type: application/json" \
  -d '{
    "budget": "medium",
    "people": 2,
    "days": 5,
    "destination": "Tokyo, Japan",
    "start_date": "2024-03-15",
    "travel_style": "comfort",
    "interests": ["food", "culture"]
  }'
```

## 📝 Notes

1. **CORS**: Đảm bảo cấu hình CORS đúng để frontend có thể gọi API
2. **Error Handling**: Implement proper error handling cho tất cả endpoints
3. **Validation**: Sử dụng Pydantic để validate request/response
4. **Logging**: Thêm logging để debug và monitor
5. **Rate Limiting**: Có thể thêm rate limiting để bảo vệ API
6. **Caching**: Implement caching cho các request tốn kém

---

**Lưu ý**: Đây là hướng dẫn cơ bản. Trong thực tế, bạn có thể cần thêm nhiều tính năng như authentication, database migration, testing, deployment, etc.
