'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useUserLocation } from "../../hooks/useUserLocation";

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
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
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
  const mapCenter: [number, number] = [center.lat, center.lng];
  const GeoapifyMap = () => {
    const { location, error, loading } = useUserLocation();
    const map = useMap();

    useEffect(() => {
      if (location) {
        console.log("📍 Vị trí hiện tại:", location);
        map.setView([location.lat, location.lon], 15);
      }
    }, [location]);
  
    if (loading) return <p>Đang xác định vị trí...</p>;
    if (error) return <p>{error}</p>;
  
    return <div id="map" className="h-full w-full" />;
  };
  // 获取路线
// 获取附近的场所
const fetchNearbyPlaces = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(
      `${backendUrl}/api/maps/geoapify/nearby?lat=${center.lat}&lng=${center.lng}&categories=${categories}&radius=${radius}&limit=20`
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

  // 获取路线
  const fetchRoute = useCallback(async (waypoints: Array<{ lat: number; lng: number }>) => {
    if (waypoints.length < 2) {
      setRoute(null);
      return;
    }

    try {
      setRouteLoading(true);
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/maps/geoapify/route`, {
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
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <MapUpdater center={mapCenter} zoom={zoom} />
        
        {/* Geoapify Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.geoapify.com/">Geoapify</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY || 'e21572c819734004b50cce6f8b52e171'}`}
        />
        
        {/* 用户位置标记 */}
        <Marker position={mapCenter} icon={L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold text-blue-600">Vị trí của bạn</p>
              <p className="text-xs text-gray-500">
                {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
        
        {/* 路线显示 */}
        {route && route.waypoints && route.waypoints.length > 0 && (
          <Polyline
            positions={route.waypoints.map(wp => [wp.lat, wp.lng])}
            color="#3B82F6"
            weight={4}
            opacity={0.8}
          />
        )}
        
        {/* 已选择的场所标记 */}
        {selectedPlaces.map((place, index) => (
          <Marker
            key={`selected_${place.id}`}
            position={[place.coordinates.lat, place.coordinates.lng]}
            icon={L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            })}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-red-600">{place.name}</p>
                <p className="text-xs text-gray-500">Điểm {index + 1}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
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
                
                {place.phone && (
                  <p className="text-xs text-gray-500 mb-1">📞 {place.phone}</p>
                )}
                
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleMarkerClick(place)}
                    className="flex-1 bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Xem chi tiết
                  </button>
                  {place.website && (
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-500 text-white text-xs px-3 py-1 rounded hover:bg-gray-600 transition text-center"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Route Info */}
      {route && route.distance && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 z-[1000]">
          <p className="text-sm font-semibold text-blue-600">📍 Đường đi</p>
          <p className="text-xs text-gray-600">
            Khoảng cách: {(route.distance / 1000).toFixed(2)} km
          </p>
          {route.time && (
            <p className="text-xs text-gray-600">
              Thời gian: {Math.round(route.time / 60)} phút
            </p>
          )}
        </div>
      )}
      
      {/* Route Loading */}
      {routeLoading && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 z-[1000]">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-600">Đang tính toán đường đi...</span>
          </div>
        </div>
      )}
      
      {/* 场所计数器 */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2 z-[1000]">
        <p className="text-sm text-gray-600">
          Tìm thấy <span className="font-semibold text-blue-600">{places.length}</span> địa điểm
        </p>
      </div>
    </div>
  );
};

export default GeoapifyMap;

