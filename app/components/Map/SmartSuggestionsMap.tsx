'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Fix Leaflet default icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface SmartPlace {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviews_count: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  opening_hours?: {
    hours_text: string;
    open_now: boolean;
  };
  thumbnail?: string;
  gmap_link?: string;
  phone?: string;
  website?: string;
  source: string;
}

interface SmartSuggestionsData {
  suggestions: SmartPlace[];
  high_rated: SmartPlace[];
  good_rated: SmartPlace[];
  total_found: number;
  category: string;
  location: { lat: number; lng: number };
  radius: number;
  timestamp: string;
}

interface SmartSuggestionsMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  categories?: string;
  radius?: number;
  onPlaceSelect?: (place: SmartPlace) => void;
  onSuggestionsUpdate?: (suggestions: SmartSuggestionsData) => void;
  className?: string;
  height?: string;
}

// Map updater component
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Map events handler for move/zoom
const MapEvents: React.FC<{
  onMoveEnd: (lat: number, lng: number, zoom: number) => void;
}> = ({ onMoveEnd }) => {
  useMapEvents({
    moveend: (e) => {
      const center = e.target.getCenter();
      const zoom = e.target.getZoom();
      onMoveEnd(center.lat, center.lng, zoom);
    },
  });
  return null;
};

// Create custom marker icons based on rating
const createSmartIcon = (rating: number, isHighRated: boolean) => {
  let color = '#95A5A6'; // Default gray
  
  if (isHighRated) {
    color = '#FFD700'; // Gold for high rated
  } else if (rating >= 4.0) {
    color = '#4ECDC4'; // Teal for good rated
  } else if (rating >= 3.5) {
    color = '#45B7D1'; // Blue for average
  }

  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 35px;
      height: 35px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
      ${isHighRated ? 'animation: glow 2s ease-in-out infinite alternate;' : ''}
    ">
      <span style="
        transform: rotate(45deg);
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">${rating.toFixed(1)}</span>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'smart-marker-icon',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  });
};

const SmartSuggestionsMap: React.FC<SmartSuggestionsMapProps> = ({
  center,
  zoom = 13,
  categories = 'catering.restaurant',
  radius = 5000,
  onPlaceSelect,
  onSuggestionsUpdate,
  className = '',
  height = '80vh'
}) => {
  const [suggestions, setSuggestions] = useState<SmartSuggestionsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const mapCenter: [number, number] = [center.lat, center.lng];

  // Fetch smart suggestions
  const fetchSmartSuggestions = useCallback(async (lat: number, lng: number, showToast = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/maps/ai/suggest_places?lat=${lat}&lng=${lng}&category=${categories}&radius=${radius}&limit=10`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch smart suggestions');
      }

      const data = await response.json();
      setSuggestions(data);

      if (onSuggestionsUpdate) {
        onSuggestionsUpdate(data);
      }

      // Show toast notification
      if (showToast && data.total_found > 0) {
        const highRatedCount = data.high_rated.length;
        const message = highRatedCount > 0 
          ? `🌟 Tìm thấy ${highRatedCount} địa điểm nổi bật gần bạn!`
          : `📍 Tìm thấy ${data.total_found} địa điểm gần bạn`;
        
        toast.success(message, {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: 'white',
            fontWeight: 'bold',
          },
        });
      }

    } catch (err) {
      console.error('Error fetching smart suggestions:', err);
      setError('Không thể tải gợi ý địa điểm');
      
      if (showToast) {
        toast.error('Không thể tải gợi ý địa điểm', {
          position: 'top-right',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [categories, radius, onSuggestionsUpdate]);

  // Handle map move/zoom
  const handleMoveEnd = useCallback((lat: number, lng: number, zoom: number) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTime;
    
    // Only update if moved significantly and enough time has passed
    if (timeSinceLastUpdate > 2000 && zoom >= 12) {
      setLastUpdateTime(now);
      fetchSmartSuggestions(lat, lng, true);
    }
  }, [fetchSmartSuggestions, lastUpdateTime]);

  // Initial load
  useEffect(() => {
    fetchSmartSuggestions(center.lat, center.lng, false);
  }, [fetchSmartSuggestions, center.lat, center.lng]);

  const handleMarkerClick = (place: SmartPlace) => {
    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <Toaster />
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000]">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-600">Đang tìm địa điểm nổi bật...</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Suggestions counter */}
      {suggestions && suggestions.total_found > 0 && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2 z-[1000]">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">🌟</span>
            <span className="text-sm font-semibold text-gray-900">
              {suggestions.high_rated.length} địa điểm nổi bật
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Tổng: {suggestions.total_found} địa điểm
          </p>
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
        <MapEvents onMoveEnd={handleMoveEnd} />

        {/* Geoapify Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.geoapify.com/">Geoapify</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY || 'e21572c819734004b50cce6f8b52e171'}`}
        />

        {/* User location marker */}
        <Marker position={mapCenter} icon={L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold text-blue-600">📍 Vị trí của bạn</p>
              <p className="text-xs text-gray-500">
                {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Smart suggestion markers */}
        <AnimatePresence>
          {suggestions?.suggestions.map((place) => {
            const isHighRated = place.rating >= 4.5;
            return (
              <Marker
                key={place.id}
                position={[place.coordinates.lat, place.coordinates.lng]}
                icon={createSmartIcon(place.rating, isHighRated)}
                eventHandlers={{
                  click: () => handleMarkerClick(place),
                }}
              >
                <Popup>
                  <div className="min-w-[250px]">
                    <div className="flex items-start gap-3 mb-3">
                      {place.thumbnail && (
                        <img
                          src={place.thumbnail}
                          alt={place.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{place.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{place.address}</p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-medium">{place.rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-500">({place.reviews_count} đánh giá)</span>
                          {isHighRated && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              🌟 Nổi bật
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {place.opening_hours?.hours_text && (
                      <p className="text-xs text-gray-600 mb-2">
                        🕒 {place.opening_hours.hours_text}
                      </p>
                    )}

                    {place.opening_hours?.open_now !== undefined && (
                      <p className={`text-xs font-medium mb-3 ${
                        place.opening_hours.open_now ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {place.opening_hours.open_now ? '✅ Đang mở cửa' : '❌ Đã đóng cửa'}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMarkerClick(place)}
                        className="flex-1 bg-blue-500 text-white text-xs px-3 py-2 rounded hover:bg-blue-600 transition"
                      >
                        Xem chi tiết
                      </button>
                      {place.gmap_link && (
                        <a
                          href={place.gmap_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gray-500 text-white text-xs px-3 py-2 rounded hover:bg-gray-600 transition text-center"
                        >
                          Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </AnimatePresence>
      </MapContainer>

      {/* CSS for glow animation */}
      <style jsx>{`
        @keyframes glow {
          from {
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          }
          to {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default SmartSuggestionsMap;
