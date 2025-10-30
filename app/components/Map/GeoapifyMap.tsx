'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// 位置由上层传入的 center 控制，避免在此重复订阅位置

// 修复 Leaflet 默认图标问题
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Place {
  id: string;
  name: string;
  address: string;
  city?: string;
  rating: number;
  reviews_count: number;
  phone?: string;
  website?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  categories?: string[];
  source: string;
}

interface UserLocation {
  lat: number;
  lng: number;
}

interface RouteData {
  waypoints: Array<{ lat: number; lng: number }>;
  distance?: number;
  time?: number;
  instructions?: Array<{ instruction: string; distance: number; time: number }>;
}

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
  country: string;
}

interface GeoapifyMapProps {
  center?: UserLocation;
  zoom?: number;
  categories?: string;
  radius?: number;
  onPlaceSelect?: (place: Place) => void;
  onPlacesUpdate?: (places: Place[]) => void;
  onRouteSelect?: (route: RouteData) => void;
  selectedPlaces?: Array<{ id: string; name: string; coordinates: { lat: number; lng: number } }>;
  showRoute?: boolean;
  className?: string;
  height?: string;
}

// 内部组件：自动更新地图中心
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    // Preserve current zoom when recentring (avoids locking user zoom)
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const MapZoomUpdater: React.FC<{ zoom: number }> = ({ zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setZoom(zoom);
  }, [zoom, map]);
  return null;
};

// 内部组件：处理地图点击事件
const MapClickHandler: React.FC<{ onMapClick: (e: any) => void }> = ({ onMapClick }) => {
  const map = useMap();
  
  useEffect(() => {
    const handleClick = (e: any) => {
      onMapClick(e);
    };
    
    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);
  
  return null;
};

// 自定义标记图标
const createCustomIcon = (category: string, rating: number) => {
  const colors: { [key: string]: string } = {
    'cafe': '#8B4513',
    'catering.restaurant': '#FF6B6B',
    'accommodation.hotel': '#4ECDC4',
    'entertainment.museum': '#45B7D1',
    'default': '#95A5A6'
  };
  
  const color = colors[category] || colors.default;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-size: 10px;
          font-weight: bold;
        ">${rating.toFixed(1)}</span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const GeoapifyMap: React.FC<GeoapifyMapProps> = ({
  center = { lat: 21.0285, lng: 105.8542 },
  zoom = 13,
  categories = 'catering.restaurant',
  radius = 5000,
  onPlaceSelect,
  onPlacesUpdate,
  onRouteSelect,
  selectedPlaces = [],
  showRoute = false,
  className = '',
  height = '80vh'
}) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<RouteData | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapCenter: [number, number] = [center.lat, center.lng];
  const radiusToZoom = (r: number) => (r <= 1500 ? 16 : r <= 3000 ? 15 : r <= 6000 ? 14 : r <= 12000 ? 13 : 12);
  const [zoomState, setZoomState] = useState<number>(radiusToZoom(radius));
  // 获取路线
// 获取附近的场所
const fetchNearbyPlaces = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

  const response = await fetch(
      `/api/maps/nearby?lat=${center.lat}&lng=${center.lng}&categories=${categories}&radius=${radius}&limit=20`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch places: ${response.statusText}`);
    }

    const data = await response.json();

    // ✅ Fix: đọc đúng field backend trả về
    const placesData = Array.isArray(data) ? data : data.places || [];
    setPlaces(placesData);

    if (onPlacesUpdate) {
      onPlacesUpdate(placesData);
    }

    console.log("✅ Loaded places:", placesData.length, "items");

  } catch (err) {
    console.error('❌ Error fetching places:', err);
    setError('Không thể tải dữ liệu địa điểm');
  } finally {
    setLoading(false);
  }
}, [center, categories, radius, onPlacesUpdate]);

useEffect(() => {
  if (center?.lat && center?.lng) {
    // Debounce API calls to avoid rate limiting
    const timeoutId = setTimeout(() => {
      fetchNearbyPlaces();
    }, 500); // 500ms delay
    
    return () => clearTimeout(timeoutId);
  }
  }, [center, fetchNearbyPlaces]);

  // Update zoom when radius changes
  useEffect(() => {
    setZoomState(radiusToZoom(radius));
  }, [radius]);

  // 获取天气信息
  const fetchWeather = useCallback(async (lat: number, lng: number) => {
    try {
      setWeatherLoading(true);
      const response = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather');
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  // 获取路线
  const fetchRoute = useCallback(async (waypoints: Array<{ lat: number; lng: number }>) => {
    if (waypoints.length < 2) {
      setRoute(null);
      return;
    }

    try {
      setRouteLoading(true);
      const response = await fetch(`/api/maps/route`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          waypoints,
          mode: 'drive'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch route');
      }

      const data = await response.json();
      setRoute(data);
      
      if (onRouteSelect) {
        onRouteSelect(data);
      }
    } catch (err) {
      console.error('Error fetching route:', err);
      setError('Không thể lấy thông tin đường đi');
    } finally {
      setRouteLoading(false);
    }
  }, [onRouteSelect]);

  // 当selectedPlaces改变时获取路线
  useEffect(() => {
    if (showRoute && selectedPlaces.length >= 2) {
      const waypoints = selectedPlaces.map(p => ({
        lat: p.coordinates.lat,
        lng: p.coordinates.lng
      }));
      fetchRoute(waypoints);
    } else {
      setRoute(null);
    }
  }, [showRoute, selectedPlaces, fetchRoute]);

  // 获取当前位置的天气
  useEffect(() => {
    if (center?.lat && center?.lng) {
      fetchWeather(center.lat, center.lng);
    }
  }, [center, fetchWeather]);

  // 处理地图点击事件
  const handleMapClick = useCallback((e: any) => {
    const { lat, lng } = e.latlng;
    setClickedLocation({ lat, lng });
    
    // 从当前位置到点击位置绘制路线
    if (center?.lat && center?.lng) {
      const waypoints = [
        { lat: center.lat, lng: center.lng },
        { lat, lng }
      ];
      fetchRoute(waypoints);
    }
  }, [center, fetchRoute]);


  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place);
    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white rounded-lg shadow-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-600">Đang tải...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <MapContainer
        center={mapCenter}
        zoom={zoomState}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <MapUpdater center={mapCenter} />
        <MapZoomUpdater zoom={zoomState} />
        <MapClickHandler onMapClick={handleMapClick} />
        
        {/* Base tiles switched to OpenStreetMap (data via SerpAPI for places) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        
        {/* 路线显示 */}
        {route && route.waypoints && route.waypoints.length > 0 && (
          <Polyline
            positions={route.waypoints.map(wp => [wp.lat, wp.lng])}
            color="#3B82F6"
            weight={4}
            opacity={0.8}
          />
        )}
        
        {/* Radius circle */}
        <Circle center={mapCenter} radius={radius} pathOptions={{ color: '#3B82F6', fillOpacity: 0.05 }} />

        {/* 点击位置标记 */}
        {clickedLocation && (
          <Marker
            position={[clickedLocation.lat, clickedLocation.lng]}
            icon={L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            })}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-red-600">Vị trí đã chọn</p>
                <p className="text-xs text-gray-500">
                  {clickedLocation.lat.toFixed(4)}, {clickedLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        
        
        {/* 场所标记 */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.coordinates.lat, place.coordinates.lng]}
            icon={createCustomIcon(
              place.categories?.[0] || 'default',
              place.rating
            )}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-semibold text-gray-900 mb-1">{place.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{place.address}</p>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-medium">{place.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({place.reviews_count})</span>
                </div>
                
                
                 <div className="mt-3">
                   <button
                     onClick={() => handleMarkerClick(place)}
                     className="w-full bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition"
                   >
                     Chọn địa điểm
                   </button>
                 </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* 天气信息 */}
      {weather && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-4 py-3 z-[1000] min-w-[200px]">
          <div className="flex items-center gap-3">
            <img 
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
              alt={weather.description}
              className="w-12 h-12"
            />
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {Math.round(weather.temperature)}°C
              </p>
              <p className="text-sm text-gray-600 capitalize">
                {weather.description}
              </p>
              <p className="text-xs text-gray-500">
                {weather.city}, {weather.country}
              </p>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>💧 {weather.humidity}%</span>
            <span>💨 {weather.windSpeed} m/s</span>
          </div>
        </div>
      )}
      
      {/* 天气加载中 */}
      {weatherLoading && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-4 py-3 z-[1000]">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-600">Đang tải thời tiết...</span>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default GeoapifyMap;

