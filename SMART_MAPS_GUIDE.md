# 🗺️ Hướng dẫn Bản đồ thông minh Realtime với Geoapify + React Leaflet

## 📋 Tổng quan

Hệ thống bản đồ thông minh realtime được xây dựng với:
- **Frontend**: React Leaflet + TypeScript
- **Backend**: FastAPI + Geoapify Places API
- **Real-time**: User location tracking với navigator.geolocation
- **Filter**: Theo category (cafe, restaurant, hotel, attraction)

## 🎯 Tính năng

### ✅ Đã hoàn thành

1. **React Leaflet Integration**
   - ✅ Cài đặt react-leaflet v4.2.1 (compatible với React 18)
   - ✅ Tự động fix Leaflet icon issue
   - ✅ Custom marker icons với rating display

2. **Geoapify Backend Service**
   - ✅ Tạo `backend/app/services/geoapify_service.py`
   - ✅ API: `/api/maps/nearby` - Lấy địa điểm xung quanh
   - ✅ API: `/api/maps/place-details/{place_id}` - Chi tiết địa điểm
   - ✅ Support categories: restaurant, cafe, hotel, museum, etc.

3. **Frontend Components**
   - ✅ `app/components/Map/GeoapifyMap.tsx` - Main map component
   - ✅ Custom marker icons với rating display
   - ✅ Popup hiển thị thông tin địa điểm
   - ✅ User location marker (blue marker)

4. **New Map Page**
   - ✅ `app/maps/page.tsx` - Full-featured map page
   - ✅ Category filter (restaurant, cafe, hotel, museum, bar, attraction)
   - ✅ Radius control (1km - 10km)
   - ✅ Location buttons (Current location, Hanoi, Ho Chi Minh)
   - ✅ Places list sidebar với details modal

5. **API Routes**
   - ✅ `app/api/maps/nearby/route.ts` - Proxy cho Geoapify API

## 🚀 Cách sử dụng

### 1. Cấu hình Environment Variables

Tạo file `.env.local` trong root directory:

```env
# Backend API Configuration
BACKEND_URL=http://localhost:8000

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Geoapify API Key
GEOAPIFY_KEY=your-geoapify-key-here
NEXT_PUBLIC_GEOAPIFY_KEY=your-geoapify-key-here

# SerpAPI Key (Optional)
SERPAPI_KEY=your-serpapi-key-here

# Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 2. Lấy API Keys

#### Geoapify API Key (Bắt buộc)

1. Truy cập: https://www.geoapify.com/
2. Đăng ký/đăng nhập account
3. Tạo API key mới
4. Copy key và paste vào `.env.local`

#### SerpAPI Key (Tùy chọn - cho dữ liệu chi tiết)

1. Truy cập: https://serpapi.com/
2. Đăng ký free account (100 searches/month)
3. Lấy API key
4. Copy key và paste vào `.env.local`

### 3. Cài đặt Dependencies

```bash
# Frontend dependencies đã cài trong setup
npm install react-leaflet@4.2.1 leaflet @types/leaflet --legacy-peer-deps

# Backend dependencies (nếu chưa có)
pip install httpx fastapi pydantic
```

### 4. Chạy dự án

```bash
# Terminal 1: Backend
cd backend
python start_local.bat  # Windows
# hoặc
./start_local.sh  # Linux/Mac

# Terminal 2: Frontend
cd ..
npm run dev
```

### 5. Truy cập

- **Frontend**: http://localhost:3000
- **Map Page**: http://localhost:3000/maps
- **Backend API**: http://localhost:8000/docs

## 📁 Cấu trúc Files

```
FE_AG/
├── app/
│   ├── maps/
│   │   └── page.tsx                    # New map page
│   ├── components/
│   │   └── Map/
│   │       └── GeoapifyMap.tsx         # Main map component
│   └── api/
│       └── maps/
│           └── nearby/
│               └── route.ts            # API proxy route
├── backend/
│   └── app/
│       ├── services/
│       │   └── geoapify_service.py     # Geoapify service
│       └── routers/
│           └── maps.py                 # Updated với Geoapify endpoints
├── .env.local                          # Environment variables
└── SMART_MAPS_GUIDE.md                 # This file
```

## 🎮 Sử dụng Map

### 1. Category Filter

```typescript
const categories = [
  { value: 'catering.restaurant', label: '🍽️ Nhà hàng' },
  { value: 'catering.cafe', label: '☕ Quán cà phê' },
  { value: 'accommodation.hotel', label: '🏨 Khách sạn' },
  { value: 'entertainment.museum', label: '🏛️ Bảo tàng' },
  { value: 'entertainment.night_club', label: '🎉 Quán bar' },
  { value: 'tourist_attraction', label: '🎯 Điểm tham quan' },
];
```

### 2. Radius Control

```typescript
const radius = 5000; // meters (default: 5km)
// Range: 1000m - 10000m (1km - 10km)
```

### 3. Location Management

```typescript
// Get current location
navigator.geolocation.getCurrentPosition((position) => {
  setCurrentLocation({
    lat: position.coords.latitude,
    lng: position.coords.longitude
  });
});

// Predefined locations
const locations = {
  hanoi: { lat: 21.0285, lng: 105.8542 },
  hochimin: { lat: 10.8231, lng: 106.6297 }
};
```

## 🔧 API Endpoints

### Backend API

#### 1. GET `/api/maps/nearby`

Lấy địa điểm xung quanh vị trí

**Parameters:**
- `lat` (float): Latitude
- `lng` (float): Longitude
- `categories` (string): Comma-separated categories
- `radius` (int): Search radius in meters
- `limit` (int): Max results (default: 20)

**Example:**
```bash
curl "http://localhost:8000/api/maps/nearby?lat=21.0285&lng=105.8542&categories=catering.restaurant&radius=5000&limit=20"
```

#### 2. GET `/api/maps/place-details/{place_id}`

Lấy chi tiết địa điểm

**Example:**
```bash
curl "http://localhost:8000/api/maps/place-details/geoapify_1"
```

### Frontend API (Proxy)

#### `/api/maps/nearby`

Proxy route để gọi backend API từ frontend.

**Usage:**
```typescript
const response = await fetch(
  `/api/maps/nearby?lat=${lat}&lng=${lng}&categories=${category}&radius=${radius}`
);
const data = await response.json();
```

## 🎨 Customization

### 1. Category Colors

Sửa trong `GeoapifyMap.tsx`:

```typescript
const colors: { [key: string]: string } = {
  'cafe': '#8B4513',           // Brown
  'catering.restaurant': '#FF6B6B',  // Red
  'accommodation.hotel': '#4ECDC4',  // Teal
  'entertainment.museum': '#45B7D1', // Blue
  'default': '#95A5A6'          // Gray
};
```

### 2. Marker Styles

Custom icon trong `createCustomIcon` function:

```typescript
const createCustomIcon = (category: string, rating: number) => {
  const color = colors[category] || colors.default;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div>...</div>`,  // Custom HTML
    iconSize: [30, 30],
    // ...
  });
};
```

### 3. Popup Content

Sửa trong `Marker` component:

```tsx
<Popup>
  <div className="custom-popup">
    {/* Your custom content */}
  </div>
</Popup>
```

## 🧪 Testing

### 1. Test Geoapify Service

```bash
# Start backend
cd backend
python start_local.bat

# Test in browser
curl "http://localhost:8000/api/maps/nearby?lat=21.0285&lng=105.8542&categories=catering.restaurant&radius=5000"
```

### 2. Test Frontend

1. Start frontend: `npm run dev`
2. Open: http://localhost:3000/maps
3. Click "📍 Vị trí của tôi" để test geolocation
4. Select different categories
5. Check markers appear on map

### 3. Debug Mode

Enable console logging:

```typescript
// In GeoapifyMap.tsx
console.log('Places:', places);
console.log('Selected place:', selectedPlace);
```

## 🐛 Troubleshooting

### 1. Leaflet Icon Issue

**Problem**: Markers không hiển thị icon

**Solution**: Code đã tự động fix trong component:
```typescript
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  // ...
});
```

### 2. CORS Error

**Problem**: Frontend không gọi được backend API

**Solution**: 
- Kiểm tra `NEXT_PUBLIC_BACKEND_URL` trong `.env.local`
- Thêm CORS middleware vào backend (đã có sẵn)

### 3. "Cannot find module 'leaflet'"

**Problem**: Missing leaflet dependency

**Solution**:
```bash
npm install leaflet @types/leaflet
```

### 4. Geolocation Permission

**Problem**: "Không thể lấy vị trí hiện tại"

**Solution**: 
- Cho phép browser truy cập vị trí
- Check HTTPS required cho production

### 5. API Key Invalid

**Problem**: Geoapify API trả về error

**Solution**:
1. Check `.env.local` có đúng key không
2. Copy `.env.local` vào `backend/` directory
3. Restart backend server

## 🚀 Production Deployment

### 1. Environment Variables

Thêm vào Vercel/VPS:
- `NEXT_PUBLIC_GEOAPIFY_KEY`
- `NEXT_PUBLIC_BACKEND_URL`
- `GEOAPIFY_KEY` (backend only)

### 2. Leaflet CSS Import

Đã import trong component:
```typescript
import 'leaflet/dist/leaflet.css';
```

### 3. SSL Certificate

HTTPS required cho geolocation API.

## 📊 Geoapify API Categories

Danh sách categories hỗ trợ:

```python
categories = [
    "catering.restaurant",
    "catering.cafe", 
    "catering.fast_food",
    "accommodation.hotel",
    "accommodation.motel",
    "entertainment.museum",
    "entertainment.theatre",
    "entertainment.night_club",
    "commercial.shopping_mall",
    "tourism.attraction",
    # ... more categories
]
```

Tham khảo: https://www.geoapify.com/places-api

## 🔄 Next Steps

### Phase 2: Realtime Location Updates

```typescript
// Watch user position
navigator.geolocation.watchPosition((position) => {
  updateMapCenter(position.coords.latitude, position.coords.longitude);
});
```

### Phase 3: AI Recommendations

```typescript
// Based on user preferences
const recommendations = await getAIRecommendations(userPreferences);
```

### Phase 4: Cache & Performance

```typescript
// Cache places in localStorage
localStorage.setItem('cached_places', JSON.stringify(places));
```

## 📞 Support

Nếu có vấn đề:
1. Check console logs
2. Check network tab trong DevTools
3. Check backend logs: `backend/logs/app.log`
4. Reference: https://react-leaflet.js.org/

---

**Developed with ❤️ for Smart Travel Planning**

