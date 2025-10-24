# 🔗 Hướng dẫn tích hợp Frontend-Backend hoàn chỉnh

## 📋 Tổng quan

Hướng dẫn này sẽ giúp bạn tích hợp hoàn toàn frontend Next.js với backend FastAPI, bao gồm:
- ✅ Authentication system
- ✅ Preference Survey system  
- ✅ Travel Planner
- ✅ Maps integration
- ✅ Dashboard với recommendations

## 🚀 Cách chạy hệ thống hoàn chỉnh

### 1. Chuẩn bị Backend

```bash
# Đảm bảo MongoDB Compass đang chạy
# Kết nối đến: mongodb://localhost:27017

# Khởi động Backend
cd backend
python main.py
```

**Kiểm tra Backend:**
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### 2. Chuẩn bị Frontend

```bash
# Cài đặt dependencies (nếu chưa có)
npm install

# Tạo file environment
cp env.local.example .env.local

# Khởi động Frontend
npm run dev
```

**Kiểm tra Frontend:**
- Website: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard

## 🔧 Cấu hình Environment

### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=hackthon
SECRET_KEY=your-secret-key-change-in-production
OPENAI_API_KEY=your-openai-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Frontend (.env.local)
```env
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📊 API Endpoints đã tích hợp

### Authentication APIs
- `POST /api/auth/register` - Đăng ký user
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user

### Survey APIs
- `POST /api/survey/submit` - Gửi khảo sát sở thích
- `GET /api/survey/options` - Lấy tùy chọn khảo sát
- `GET /api/survey/my-preferences` - Lấy sở thích của user
- `GET /api/survey/recommendations` - Lấy gợi ý cá nhân hóa

### Travel Planner APIs
- `POST /api/travel-planner` - Tạo lịch trình du lịch
- `GET /api/itinerary/{tripId}` - Lấy chi tiết lịch trình

## 🎯 Luồng hoạt động

### 1. User Registration/Login
```
Frontend → /api/auth/register → Backend → MongoDB
Frontend → /api/auth/login → Backend → JWT Token
```

### 2. Preference Survey
```
Frontend → /api/preferences → Backend → /api/survey/submit → MongoDB
Backend → Generate Recommendations → Return to Frontend
```

### 3. Dashboard với Recommendations
```
Frontend → /api/survey/recommendations → Backend → MongoDB
Backend → Return Personalized Recommendations → Frontend Display
```

## 🧪 Test Integration

### 1. Test Backend
```bash
cd backend
python test_mongodb.py  # Test MongoDB connection
python test_auth.py     # Test Authentication
```

### 2. Test Frontend
```bash
# Mở browser và test:
# 1. http://localhost:3000/register - Đăng ký user mới
# 2. http://localhost:3000/login - Đăng nhập
# 3. http://localhost:3000/preferences - Hoàn thành khảo sát
# 4. http://localhost:3000/dashboard - Xem recommendations
```

## 🔍 Troubleshooting

### Backend Issues
```bash
# Kiểm tra MongoDB connection
python -c "from app.database import get_database; print('MongoDB OK')"

# Kiểm tra server status
curl http://localhost:8000/health

# Xem logs
tail -f logs/app.log
```

### Frontend Issues
```bash
# Kiểm tra API routes
curl http://localhost:3000/api/auth/me

# Kiểm tra environment variables
echo $BACKEND_URL

# Clear cache
rm -rf .next
npm run dev
```

### Common Issues

1. **CORS Error**: Backend đã cấu hình CORS cho localhost:3000
2. **Authentication Failed**: Kiểm tra JWT token trong localStorage
3. **MongoDB Connection**: Đảm bảo MongoDB Compass đang chạy
4. **Port Conflicts**: Backend chạy trên 8000, Frontend trên 3000

## 📱 Features đã tích hợp

### ✅ Authentication System
- User registration với validation
- Login với JWT tokens
- Protected routes
- Auto-logout khi token hết hạn

### ✅ Preference Survey
- Multi-step survey form
- Real-time progress tracking
- Data validation
- Integration với backend survey API

### ✅ Personalized Recommendations
- AI-driven destination suggestions
- Activity recommendations
- Budget estimation
- Itinerary suggestions
- Accommodation options

### ✅ Dashboard
- User profile display
- Recommendations showcase
- Quick action buttons
- Real-time data updates

### ✅ Travel Planner
- Trip creation
- Itinerary generation
- Budget planning
- Activity scheduling

## 🎨 UI/UX Features

### Modern Design
- Responsive layout
- Clean interface
- Smooth animations
- Loading states
- Error handling

### User Experience
- Step-by-step guidance
- Progress indicators
- Success/error messages
- Auto-save functionality
- Mobile-friendly

## 🚀 Next Steps

### Immediate
1. ✅ Test complete integration
2. ✅ Verify all API endpoints
3. ✅ Check error handling
4. ✅ Test on different devices

### Future Enhancements
1. 🔄 Real-time notifications
2. 🔄 Social sharing features
3. 🔄 Advanced filtering
4. 🔄 Payment integration
5. 🔄 Multi-language support

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs trong `backend/logs/`
2. Xem browser console cho frontend errors
3. Verify MongoDB connection
4. Check environment variables
5. Test API endpoints individually

---

**🎉 Chúc mừng! Hệ thống đã được tích hợp hoàn chỉnh!**

Bạn có thể bắt đầu sử dụng:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs
- **Dashboard**: http://localhost:3000/dashboard
