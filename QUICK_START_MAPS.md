# 🚀 Quick Start - Geoapify Maps

## ⚡ 3 Bước khởi chạy nhanh

### 1️⃣ Tạo file .env.local

**Root directory:**
```bash
# Copy file template
cp env.local.template .env.local

# File .env.local đã có API key Geoapify sẵn:
GEOAPIFY_KEY=e21572c819734004b50cce6f8b52e171
NEXT_PUBLIC_GEOAPIFY_KEY=e21572c819734004b50cce6f8b52e171
```

**Backend directory:**
```bash
cd backend
cp env.local.template .env.local

# File .env.local đã có API key sẵn:
GEOAPIFY_KEY=e21572c819734004b50cce6f8b52e171
```

### 2️⃣ Khởi động Backend

```bash
cd backend
python start_local.bat  # Windows
# hoặc
./start_local.sh        # Linux/Mac
```

Backend sẽ chạy tại: **http://localhost:8000**

### 3️⃣ Khởi động Frontend

```bash
# Trong terminal mới
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:3000**

## 🌐 Truy cập Maps

- **New Map Page**: http://localhost:3000/maps
- **Map Demo**: http://localhost:3000/map-demo  
- **Backend API**: http://localhost:8000/docs

## ✅ Test nhanh

1. Mở http://localhost:3000/maps
2. Bạn sẽ thấy bản đồ Hanoi với các markers
3. Click category buttons (☕ Quán cà phê, 🍽️ Nhà hàng, etc.)
4. Map sẽ reload với địa điểm mới

## 🔑 API Keys đã cấu hình

| API | Key | Trạng thái |
|-----|-----|------------|
| Geoapify | `e21572c819734004b50cce6f8b52e171` | ✅ Đã tích hợp |
| Backend | `http://localhost:8000` | ✅ Đang chạy |

## 🐛 Nếu gặp lỗi

### Lỗi "Không thể tải dữ liệu địa điểm"

**Nguyên nhân**: Backend chưa chạy hoặc chưa có .env.local

**Giải pháp**:
```bash
# 1. Kiểm tra backend đang chạy
curl http://localhost:8000/health

# 2. Nếu lỗi, tạo .env.local
cp backend/env.local.template backend/.env.local

# 3. Restart backend
cd backend
python start_local.bat
```

### Lỗi "Module not found: leaflet"

**Giải pháp**:
```bash
npm install react-leaflet@4.2.1 leaflet @types/leaflet --legacy-peer-deps
```

### Lỗi CORS

**Giải pháp**: Kiểm tra `ALLOWED_ORIGINS` trong backend/.env.local

## 📊 API Endpoints

### 1. Lấy địa điểm xung quanh
```
GET /api/maps/nearby?lat=21.0285&lng=105.8542&categories=catering.restaurant&radius=5000
```

### 2. Lấy chi tiết địa điểm
```
GET /api/maps/place-details/{place_id}
```

### 3. Tạo route (đường đi)
```
POST /api/maps/route
Body: {
  "waypoints": [{"lat": 21.0285, "lon": 105.8542}, ...],
  "mode": "drive"
}
```

## 🎨 Tính năng

✅ Geoapify tiles rendering  
✅ Places API integration  
✅ Category filtering (restaurant, cafe, hotel, etc.)  
✅ Radius control (1-10km)  
✅ Route planning  
✅ User location tracking  
✅ Responsive design  

## 📞 Support

- Xem logs: `backend/logs/app.log`
- Xem browser console: F12 → Console
- Test API: http://localhost:8000/docs

---

**Made with ❤️ for Smart Travel Planning**

