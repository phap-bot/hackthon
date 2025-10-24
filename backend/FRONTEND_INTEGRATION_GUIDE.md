# 🔗 Frontend-Backend Integration Guide

Hướng dẫn tích hợp giao diện khảo sát sở thích với backend API.

## 📋 Tổng quan

Backend đã được cấu hình để hỗ trợ MongoDB Compass local và cung cấp các API endpoints cho:
- ✅ User authentication (đăng ký/đăng nhập)
- ✅ Preference survey (khảo sát sở thích)
- ✅ Personalized recommendations (gợi ý cá nhân hóa)

## 🚀 Cách chạy Backend

### 1. Chuẩn bị MongoDB Compass
```bash
# Đảm bảo MongoDB Compass đang chạy
# Kết nối đến: mongodb://localhost:27017
```

### 2. Khởi động Backend
```bash
# Windows
start_local.bat

# Linux/Mac
chmod +x start_local.sh
./start_local.sh
```

### 3. Kiểm tra Backend
```bash
# Test MongoDB connection
python test_mongodb.py

# Test Authentication
python test_auth.py
```

## 🔌 API Endpoints cho Frontend

### Authentication APIs
```javascript
// Base URL
const API_BASE = 'http://localhost:8000';

// 1. User Registration
POST /api/auth/register
{
  "username": "string",
  "email": "string", 
  "password": "string",
  "full_name": "string"
}

// 2. User Login
POST /api/auth/login
{
  "email": "string",
  "password": "string"
}

// 3. Get User Info (Protected)
GET /api/auth/me
Headers: { "Authorization": "Bearer <token>" }
```

### Survey APIs
```javascript
// 1. Get Survey Options
GET /api/survey/options
// Returns: travel_types, dream_destinations, activities, etc.

// 2. Submit Survey (Protected)
POST /api/survey/submit
Headers: { "Authorization": "Bearer <token>" }
{
  "travel_type": "khám_phá",
  "dream_destination": "thành_phố", 
  "activities": ["ẩm_thực", "mua_sắm"],
  "budget_range": "trung_bình",
  "travel_style": "thoải_mái"
}

// 3. Get My Preferences (Protected)
GET /api/survey/my-preferences
Headers: { "Authorization": "Bearer <token>" }

// 4. Get Recommendations (Protected)
GET /api/survey/recommendations
Headers: { "Authorization": "Bearer <token>" }
```

## 💻 Frontend Integration Example

### 1. Authentication Service
```javascript
// services/auth.js
class AuthService {
  constructor() {
    this.baseURL = 'http://localhost:8000';
    this.token = localStorage.getItem('auth_token');
  }

  async register(userData) {
    const response = await fetch(`${this.baseURL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (response.ok) {
      const data = await response.json();
      this.token = data.access_token;
      localStorage.setItem('auth_token', this.token);
      return data;
    }
    throw new Error('Registration failed');
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      this.token = data.access_token;
      localStorage.setItem('auth_token', this.token);
      return data;
    }
    throw new Error('Login failed');
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }
}
```

### 2. Survey Service
```javascript
// services/survey.js
class SurveyService {
  constructor(authService) {
    this.baseURL = 'http://localhost:8000';
    this.authService = authService;
  }

  async getSurveyOptions() {
    const response = await fetch(`${this.baseURL}/api/survey/options`);
    return response.json();
  }

  async submitSurvey(surveyData) {
    const response = await fetch(`${this.baseURL}/api/survey/submit`, {
      method: 'POST',
      headers: this.authService.getAuthHeaders(),
      body: JSON.stringify(surveyData)
    });
    
    if (response.ok) {
      return response.json();
    }
    throw new Error('Survey submission failed');
  }

  async getMyPreferences() {
    const response = await fetch(`${this.baseURL}/api/survey/my-preferences`, {
      headers: this.authService.getAuthHeaders()
    });
    return response.json();
  }

  async getRecommendations() {
    const response = await fetch(`${this.baseURL}/api/survey/recommendations`, {
      headers: this.authService.getAuthHeaders()
    });
    return response.json();
  }
}
```

### 3. React Component Example
```jsx
// components/PreferenceSurvey.jsx
import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/auth';
import { SurveyService } from '../services/survey';

const PreferenceSurvey = () => {
  const [surveyOptions, setSurveyOptions] = useState(null);
  const [surveyData, setSurveyData] = useState({
    travel_type: '',
    dream_destination: '',
    activities: [],
    budget_range: '',
    travel_style: ''
  });
  const [recommendations, setRecommendations] = useState(null);
  
  const authService = new AuthService();
  const surveyService = new SurveyService(authService);

  useEffect(() => {
    loadSurveyOptions();
  }, []);

  const loadSurveyOptions = async () => {
    try {
      const options = await surveyService.getSurveyOptions();
      setSurveyOptions(options.options);
    } catch (error) {
      console.error('Failed to load survey options:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await surveyService.submitSurvey(surveyData);
      setRecommendations(result.recommendations);
      alert('Khảo sát đã được lưu thành công!');
    } catch (error) {
      console.error('Survey submission failed:', error);
      alert('Có lỗi xảy ra khi lưu khảo sát');
    }
  };

  const handleActivityChange = (activity) => {
    setSurveyData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  if (!surveyOptions) {
    return <div>Loading...</div>;
  }

  return (
    <div className="survey-container">
      <h2>Hãy cho chúng tôi biết sở thích của bạn!</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Travel Type Selection */}
        <div className="question-group">
          <h3>Bạn thích loại hình du lịch nào?</h3>
          <div className="options-grid">
            {surveyOptions.travel_types.map(type => (
              <label key={type.value} className="option-card">
                <input
                  type="radio"
                  name="travel_type"
                  value={type.value}
                  checked={surveyData.travel_type === type.value}
                  onChange={(e) => setSurveyData(prev => ({
                    ...prev,
                    travel_type: e.target.value
                  }))}
                />
                <div className="card-content">
                  <h4>{type.label}</h4>
                  <p>{type.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Dream Destination Selection */}
        <div className="question-group">
          <h3>Đâu là địa điểm mơ ước của bạn?</h3>
          <div className="options-grid">
            {surveyOptions.dream_destinations.map(dest => (
              <label key={dest.value} className="option-card">
                <input
                  type="radio"
                  name="dream_destination"
                  value={dest.value}
                  checked={surveyData.dream_destination === dest.value}
                  onChange={(e) => setSurveyData(prev => ({
                    ...prev,
                    dream_destination: e.target.value
                  }))}
                />
                <div className="card-content">
                  <h4>{dest.label}</h4>
                  <p>{dest.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Activities Selection */}
        <div className="question-group">
          <h3>Hoạt động nào bạn không thể bỏ lỡ?</h3>
          <div className="options-grid">
            {surveyOptions.activities.map(activity => (
              <label key={activity.value} className="option-card">
                <input
                  type="checkbox"
                  checked={surveyData.activities.includes(activity.value)}
                  onChange={() => handleActivityChange(activity.value)}
                />
                <div className="card-content">
                  <h4>{activity.label}</h4>
                  <p>{activity.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Hoàn thành
        </button>
      </form>

      {/* Display Recommendations */}
      {recommendations && (
        <div className="recommendations">
          <h3>Gợi ý dành riêng cho bạn:</h3>
          <div className="destination-suggestions">
            {recommendations.destination_suggestions.map((dest, index) => (
              <div key={index} className="destination-card">
                <h4>{dest.name}, {dest.country}</h4>
                <p>Rating: {dest.rating}/5</p>
                <p>Price: {dest.price_range}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferenceSurvey;
```

## 🎨 CSS Styling Example
```css
/* styles/survey.css */
.survey-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.question-group {
  margin-bottom: 30px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.option-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-card:hover {
  border-color: #13a4ec;
  transform: translateY(-2px);
}

.option-card input[type="radio"]:checked + .card-content,
.option-card input[type="checkbox"]:checked + .card-content {
  background-color: #13a4ec;
  color: white;
}

.card-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.card-content p {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.submit-btn {
  background-color: #13a4ec;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.submit-btn:hover {
  background-color: #0d8bc7;
}

.recommendations {
  margin-top: 30px;
  padding: 20px;
  background-color: #f6f7f8;
  border-radius: 8px;
}

.destination-suggestions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.destination-card {
  background: white;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Error**: Backend đã cấu hình CORS cho `http://localhost:3000`
2. **Authentication Failed**: Kiểm tra token trong localStorage
3. **MongoDB Connection**: Đảm bảo MongoDB Compass đang chạy
4. **API Not Found**: Kiểm tra backend server có đang chạy không

### Debug Steps:
```bash
# 1. Check backend health
curl http://localhost:8000/health

# 2. Check API docs
# Visit: http://localhost:8000/docs

# 3. Test authentication
python test_auth.py

# 4. Check MongoDB connection
python test_mongodb.py
```

## 📱 Next Steps

1. ✅ Backend đã sẵn sàng với MongoDB Compass local
2. ✅ API endpoints cho survey đã được tạo
3. ✅ Authentication system hoạt động
4. 🔄 Tích hợp với frontend survey component
5. 🔄 Test end-to-end functionality

Backend của bạn đã sẵn sàng để tích hợp với giao diện khảo sát!
