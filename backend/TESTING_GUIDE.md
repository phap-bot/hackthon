# 🧪 Backend Testing Guide

Hướng dẫn testing cho AI Travel Planner Backend

## 📁 Cấu trúc Test Files

```
backend/
├── test_unified.py      # Test suite đầy đủ
├── test_quick.py        # Test nhanh các vấn đề chính
├── test_auth.py         # Test authentication
├── test_mongodb.py      # Test database connection
├── test_serpapi.py      # Test SerpAPI integration
└── tests/
    └── test_api.py      # Unit tests
```

## 🚀 Cách sử dụng

### 1. Test nhanh (Recommended)
```bash
cd backend
python test_quick.py
```

### 2. Test đầy đủ
```bash
cd backend
python test_unified.py
```

### 3. Test database
```bash
cd backend
python test_mongodb.py
```

### 4. Test authentication
```bash
cd backend
python test_auth.py
```

## 🔧 Yêu cầu

- Backend service đang chạy trên port 8000
- MongoDB đang chạy trên port 27017
- Python dependencies đã được cài đặt

## 📊 Test Results

### Quick Test
- ✅ API Health Check
- ✅ Public Preferences
- ✅ Authenticated Preferences

### Full Test Suite
- ✅ Database Connection
- ✅ API Health
- ✅ Public Preferences
- ✅ Authenticated Preferences (Create/Get/Update)
- ✅ Travel Planner
- ✅ Maps API

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **Connection refused**: Backend service chưa chạy
   ```bash
   python main.py
   ```

2. **MongoDB connection failed**: MongoDB chưa chạy
   ```bash
   # Sử dụng MongoDB Compass hoặc Docker
   docker run -d -p 27017:27017 mongo:7.0
   ```

3. **Serialization errors**: Đã được fix trong preferences.py

## 📝 Notes

- Tất cả test files đã được tối ưu hóa
- Các file test cũ đã được dọn dẹp
- Code được tổ chức gọn gàng và dễ quản lý
