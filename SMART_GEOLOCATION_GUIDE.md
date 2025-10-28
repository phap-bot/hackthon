# 📍 Hướng dẫn hệ thống Geolocation thông minh

## ✅ Đã hoàn thành

### 1. Backend Reverse Geocoding API
- ✅ Tạo `/api/maps/reverse` endpoint
- ✅ Sử dụng Geoapify Reverse Geocoding API
- ✅ Trả về formatted address từ lat/lng
- ✅ Endpoint: `GET /api/maps/reverse?lat={lat}&lng={lng}`

### 2. Frontend Smart Geolocation Hook
- ✅ Tạo `useSmartGeolocation` hook
- ✅ Tự động lấy GPS hoặc fallback về Hà Nội
- ✅ Xử lý 3 loại lỗi GPS:
  - PERMISSION_DENIED (code 1): Người dùng từ chối
  - POSITION_UNAVAILABLE (code 2): Không có tín hiệu
  - TIMEOUT (code 3): GPS chậm
- ✅ Reverse geocoding tự động để hiển thị địa chỉ

### 3. GeoapifyMapWrapper Component
- ✅ Wrapper component tự động GPS
- ✅ Hiển thị status indicator:
  - 🟢 `Vị trí của bạn` nếu GPS thành công
  - 🟠 `Vị trí giả định` nếu fallback
- ✅ Toast notification cho lỗi GPS
- ✅ Loading state khi đang lấy vị trí

### 4. Integrated với Maps Pages
- ✅ `/maps` - sử dụng GeoapifyMapWrapper
- ✅ `/map-demo` - sử dụng GeoapifyMapWrapper

## 🔧 Cấu hình

### Backend

```env
# backend/.env.local
GEOAPIFY_KEY=e21572c819734004b50cce6f8b52e171
```

### Frontend

```env
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_GEOAPIFY_KEY=e21572c819734004b50cce6f8b52e171
```

## 📊 Luồng hoạt động

### Kịch bản 1: GPS Thành công ✅

```
1. User mở trang → Component mount
2. useSmartGeolocation hook trigger
3. navigator.geolocation.getCurrentPosition() được gọi
4. ✅ User cho phép → Lấy được lat, lng
5. Gọi /api/maps/reverse để lấy địa chỉ
6. Hiển thị marker "Vị trí của bạn" + địa chỉ
7. Load địa điểm xung quanh theo categories
```

### Kịch bản 2: GPS Bị từ chối 🚫

```
1. User mở trang → Component mount
2. useSmartGeolocation hook trigger
3. navigator.geolocation.getCurrentPosition() được gọi
4. ❌ User từ chối (PERMISSION_DENIED)
5. Fallback về Hà Nội (lat: 21.0278, lng: 105.8342)
6. Hiển thị marker "Vị trí giả định" + toast warning
7. Load địa điểm Hà Nội
```

### Kịch bản 3: Mất kết nối 📶

```
1. User mở trang → Component mount
2. useSmartGeolocation hook trigger
3. navigator.geolocation.getCurrentPosition() timeout
4. ❌ TIMEOUT error
5. Fallback về Hà Nội
6. Hiển thị marker "Vị trí giả định" + toast warning
7. Load địa điểm Hà Nội
```

## 🎨 Giao diện

### GPS Status Indicator

**Khi GPS thành công:**
```tsx
📍 Vị trí của bạn
Hà Nội, Việt Nam
```

**Khi GPS failed (fallback):**
```tsx
⚠️ Vị trí giả định
Hà Nội, Việt Nam
Người dùng đã từ chối truy cập vị trí. Sử dụng vị trí mặc định Hà Nội.
```

### Console Logs

**GPS Thành công:**
```
✅ Got real GPS location: { lat: 21.0278, lng: 105.8342 }
```

**GPS Bị từ chối:**
```
⚠️ GPS access denied or failed, using fallback location
❌ PERMISSION_DENIED: Người dùng từ chối GPS
```

**GPS Timeout:**
```
⚠️ GPS access denied or failed, using fallback location
❌ TIMEOUT: GPS timeout
```

## 🧪 Test Cases

### Test 1: GPS Cho phép
1. Mở http://localhost:3000/maps
2. Click "Cho phép" khi browser hỏi GPS
3. ✅ Kiểm tra console: "Got real GPS location"
4. ✅ Kiểm tra marker: xanh với text "Vị trí của bạn"
5. ✅ Kiểm tra địa điểm xung quanh xuất hiện

### Test 2: GPS Từ chối
1. Mở http://localhost:3000/maps
2. Click "Chặn" khi browser hỏi GPS
3. ✅ Kiểm tra console: "PERMISSION_DENIED"
4. ✅ Kiểm tra marker: cam với text "Vị trí giả định"
5. ✅ Kiểm tra toast: "Người dùng đã từ chối..."
6. ✅ Địa điểm Hà Nội xuất hiện

### Test 3: GPS Timeout
1. Mở http://localhost:3000/maps trên mobile (GPS chậm)
2. Đợi 10 giây
3. ✅ Kiểm tra console: "TIMEOUT"
4. ✅ Fallback về Hà Nội
5. ✅ Toast hiển thị

## 📁 File Structure

```
FE_AG/
├── app/
│   ├── hooks/
│   │   └── useSmartGeolocation.ts      # Smart GPS hook
│   ├── components/Map/
│   │   ├── GeoapifyMap.tsx            # Main map component
│   │   └── GeoapifyMapWrapper.tsx     # GPS wrapper
│   ├── api/maps/
│   │   └── reverse/
│   │       └── route.ts               # Reverse geocoding proxy
│   ├── maps/
│   │   └── page.tsx                    # Updated to use wrapper
│   └── map-demo/
│       └── page.tsx                    # Updated to use wrapper
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   └── geoapify_service.py     # Added reverse_geocode()
│   │   └── routers/
│   │       └── maps.py                 # Added /reverse endpoint
└── SMART_GEOLOCATION_GUIDE.md
```

## 🎯 Tính năng

### ✅ Automatic GPS Detection
- Tự động lấy GPS khi component mount
- Timeout 10 giây
- Fallback tự động nếu lỗi

### ✅ Smart Error Handling
- Phân biệt 3 loại lỗi GPS
- Console logs chi tiết
- Toast notifications thân thiện

### ✅ Reverse Geocoding
- Tự động lấy địa chỉ từ tọa độ
- Hiển thị formatted address
- Fallback nếu API lỗi

### ✅ User Experience
- Loading state khi đang lấy GPS
- Status indicator rõ ràng
- Không làm gián đoạn trải nghiệm

## 🔍 Debug Console

Khi test, mở Browser Console (F12) sẽ thấy:

**Success:**
```
✅ Got real GPS location: { lat: 21.0278, lng: 105.8342 }
```

**Error Types:**
```
❌ PERMISSION_DENIED: Người dùng từ chối GPS
❌ POSITION_UNAVAILABLE: Không có tín hiệu GPS
❌ TIMEOUT: GPS chậm
⚠️ Unknown GPS error
```

## 🚀 Sử dụng

### Trong Component

```tsx
import GeoapifyMapWrapper from '../components/Map/GeoapifyMapWrapper';

<GeoapifyMapWrapper
  zoom={13}
  categories="catering.restaurant"
  radius={5000}
  height="600px"
/>
```

### Direct Hook Usage

```tsx
import { useSmartGeolocation } from '../hooks/useSmartGeolocation';

const { location, loading, error, isRealGPS } = useSmartGeolocation();
```

## 📞 API Endpoints

### Reverse Geocoding

```bash
# Backend
curl "http://localhost:8000/api/maps/reverse?lat=21.0278&lng=105.8342"

# Frontend (proxy)
curl "http://localhost:3000/api/maps/reverse?lat=21.0278&lng=105.8342"
```

**Response:**
```json
{
  "address": "Hà Nội, Việt Nam",
  "address_line1": "Hà Nội",
  "city": "Hà Nội",
  "country": "Vietnam",
  "lat": 21.0278,
  "lng": 105.8342
}
```

## 🎉 Kết quả

- ✅ GPS tự động hoặc fallback
- ✅ Error handling chi tiết
- ✅ User-friendly notifications
- ✅ Reverse geocoding địa chỉ
- ✅ Không lỗi SSR
- ✅ Responsive design

---

**Developed with ❤️ for Phap bot**

