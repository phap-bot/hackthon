# 🗺️ Hướng dẫn tích hợp Google Maps với SerpAPI

## 📋 Tổng quan

Hệ thống bản đồ đã được tích hợp hoàn chỉnh với Google Maps API và SerpAPI backend để hiển thị các địa điểm đề xuất với rating tốt cho người dùng.

## 🚀 Tính năng chính

### ✅ **Đã hoàn thành:**
- 🗺️ **Google Maps Integration** - Hiển thị bản đồ tương tác
- ☕ **SerpAPI Integration** - Lấy dữ liệu địa điểm thực tế
- 🔍 **Search & Geolocation** - Tìm kiếm và định vị
- 🎯 **Rating Filter** - Lọc theo đánh giá
- 📍 **Multiple Place Types** - Quán cà phê, nhà hàng, khách sạn, điểm tham quan
- 📱 **Responsive Design** - Tối ưu cho mọi thiết bị
- 🎨 **Custom Markers** - Marker tùy chỉnh với rating
- 📋 **Places List** - Danh sách địa điểm chi tiết

## 📁 Cấu trúc file

```
app/
├── components/Map/
│   ├── MapComponent.tsx      # Component bản đồ chính
│   ├── MapFilters.tsx        # Bộ lọc địa điểm
│   ├── MapSearch.tsx         # Tìm kiếm và geolocation
│   ├── PlacesList.tsx        # Danh sách địa điểm
│   └── PlacesMap.tsx         # Component tổng hợp
├── api/maps/
│   ├── coffee/route.ts       # API quán cà phê
│   ├── restaurants/route.ts  # API nhà hàng
│   ├── hotels/route.ts       # API khách sạn
│   └── attractions/route.ts  # API điểm tham quan
└── map-demo/
    └── page.tsx              # Trang demo
```

## ⚙️ Cài đặt

### 1. Environment Variables

Tạo file `.env.local`:

```env
# Google Maps API Key (Required)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# Backend API URL
BACKEND_URL=http://localhost:8000

# App Configuration
NEXT_PUBLIC_APP_NAME=Travel Planner
NEXT_PUBLIC_APP_VERSION=2.0.0

# Default Map Settings
NEXT_PUBLIC_DEFAULT_LAT=21.0285
NEXT_PUBLIC_DEFAULT_LNG=105.8542
NEXT_PUBLIC_DEFAULT_ZOOM=13

# API Settings
NEXT_PUBLIC_DEFAULT_RADIUS=5000
NEXT_PUBLIC_DEFAULT_MIN_RATING=4.0
NEXT_PUBLIC_DEFAULT_LIMIT=20
```

### 2. Dependencies

```bash
npm install @googlemaps/js-api-loader
```

### 3. Backend Setup

Đảm bảo backend đang chạy với SerpAPI:

```bash
cd backend
# Cấu hình SERPAPI_API_KEY trong .env
# Chạy backend
docker-compose up -d
# hoặc
python main.py
```

## 🎯 Cách sử dụng

### 1. Component cơ bản

```tsx
import PlacesMap from '@/components/Map/PlacesMap';

export default function MapPage() {
  return (
    <PlacesMap
      initialCenter={{ lat: 21.0285, lng: 105.8542 }}
      initialZoom={13}
      className="h-screen"
    />
  );
}
```

### 2. Component tùy chỉnh

```tsx
import MapComponent from '@/components/Map/MapComponent';
import MapFilters from '@/components/Map/MapFilters';
import MapSearch from '@/components/Map/MapSearch';

export default function CustomMap() {
  const [placeType, setPlaceType] = useState('coffee');
  const [minRating, setMinRating] = useState(4.0);
  const [radius, setRadius] = useState(5000);

  return (
    <div className="flex gap-4">
      <div className="w-80">
        <MapSearch onLocationSelect={handleLocation} />
        <MapFilters
          placeType={placeType}
          minRating={minRating}
          radius={radius}
          onPlaceTypeChange={setPlaceType}
          onRatingChange={setMinRating}
          onRadiusChange={setRadius}
        />
      </div>
      
      <div className="flex-1">
        <MapComponent
          center={{ lat: 21.0285, lng: 105.8542 }}
          placeType={placeType}
          minRating={minRating}
          radius={radius}
          onPlaceSelect={handlePlaceSelect}
        />
      </div>
    </div>
  );
}
```

## 🔧 API Endpoints

### Frontend API Routes

- `GET /api/maps/coffee` - Tìm kiếm quán cà phê
- `GET /api/maps/restaurants` - Tìm kiếm nhà hàng
- `GET /api/maps/hotels` - Tìm kiếm khách sạn
- `GET /api/maps/attractions` - Tìm kiếm điểm tham quan

### Query Parameters

- `lat` - Vĩ độ
- `lng` - Kinh độ
- `min_rating` - Đánh giá tối thiểu (mặc định: 4.0)
- `radius` - Bán kính tìm kiếm (mét, mặc định: 5000)
- `limit` - Số lượng kết quả (mặc định: 20)

### Example

```bash
curl "http://localhost:3000/api/maps/coffee?lat=21.0285&lng=105.8542&min_rating=4.5&radius=5000&limit=10"
```

## 🎨 Customization

### 1. Marker Icons

```tsx
const getMarkerIcon = (place: Place) => {
  const baseColor = getTypeColor(place.types[0]);
  const rating = place.rating;
  
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="40" height="50" viewBox="0 0 40 50">
        <path d="M20 0C8.95 0 0 8.95 0 20c0 15 20 30 20 30s20-15 20-30c0-11.05-8.95-20-20-20z" fill="${baseColor}"/>
        <circle cx="20" cy="20" r="15" fill="white"/>
        <text x="20" y="25" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="${baseColor}">
          ${rating.toFixed(1)}
        </text>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(40, 50),
    anchor: new google.maps.Point(20, 50)
  };
};
```

### 2. Map Styles

```tsx
const mapStyles = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  }
];

// Trong MapComponent
mapInstanceRef.current = new google.maps.Map(mapRef.current, {
  center,
  zoom,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  styles: mapStyles
});
```

## 🚀 Demo

Truy cập trang demo: `http://localhost:3000/map-demo`

### Tính năng demo:
- ✅ Tìm kiếm địa điểm
- ✅ Lấy vị trí hiện tại
- ✅ Lọc theo loại địa điểm
- ✅ Lọc theo rating
- ✅ Thay đổi bán kính tìm kiếm
- ✅ Xem danh sách địa điểm
- ✅ Click marker để xem chi tiết

## 🔧 Troubleshooting

### 1. Google Maps không load

```bash
# Kiểm tra API key
echo $NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Kiểm tra console errors
# Đảm bảo API key có quyền Maps JavaScript API
```

### 2. Backend API không hoạt động

```bash
# Kiểm tra backend
curl http://localhost:8000/health

# Kiểm tra SerpAPI key
curl http://localhost:8000/api/maps/coffee?lat=21.0285&lng=105.8542
```

### 3. Không có dữ liệu

- Kiểm tra SerpAPI key trong backend
- Kiểm tra kết nối mạng
- Thử giảm min_rating xuống 3.0
- Tăng radius lên 10000

## 📊 Performance

### 1. Optimization Tips

- Sử dụng `useCallback` cho event handlers
- Debounce search requests
- Cache API responses
- Lazy load map components

### 2. Memory Management

```tsx
// Clear markers when component unmounts
useEffect(() => {
  return () => {
    markersRef.current.forEach(marker => marker.setMap(null));
  };
}, []);
```

## 🔒 Security

### 1. API Key Protection

- Sử dụng environment variables
- Không commit API keys vào git
- Sử dụng domain restrictions cho Google Maps API
- Rate limiting cho backend API

### 2. CORS Configuration

```typescript
// Trong backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📈 Monitoring

### 1. Error Tracking

```tsx
const handleError = (error: Error) => {
  console.error('Map error:', error);
  // Send to error tracking service
};
```

### 2. Analytics

```tsx
// Track map interactions
const trackMapInteraction = (action: string, data: any) => {
  // Send to analytics service
  gtag('event', action, data);
};
```

## 🎉 Kết luận

Hệ thống bản đồ đã được tích hợp hoàn chỉnh với:

- ✅ **Google Maps API** - Hiển thị bản đồ tương tác
- ✅ **SerpAPI Backend** - Dữ liệu địa điểm thực tế
- ✅ **Search & Geolocation** - Tìm kiếm thông minh
- ✅ **Rating System** - Lọc theo chất lượng
- ✅ **Responsive UI** - Giao diện thân thiện
- ✅ **TypeScript** - Type safety
- ✅ **Error Handling** - Xử lý lỗi tốt

Bây giờ bạn có thể sử dụng các component này để tạo ứng dụng bản đồ hoàn chỉnh! 🚀
