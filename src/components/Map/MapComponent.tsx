'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Place {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviews_count: number;
  price_level: number;
  phone: string;
  website: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  thumbnail: string;
  types: string[];
  source: string;
  opening_hours: {
    open_now: boolean;
    hours_text: string;
  };
  vicinity: string;
}

interface MapComponentProps {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  placeType?: 'coffee' | 'restaurants' | 'hotels' | 'attractions';
  minRating?: number;
  radius?: number;
  onPlaceSelect?: (place: Place) => void;
  onPlacesUpdate?: (places: Place[]) => void;
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = { lat: 21.0285, lng: 105.8542 }, // Hà Nội mặc định
  zoom = 13,
  placeType = 'coffee',
  minRating = 4.5,
  radius = 5000,
  onPlaceSelect,
  onPlacesUpdate,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize without Google Maps
  useEffect(() => {
    // Skip Google Maps loading and go directly to fetch places
    setLoading(false);
    fetchPlaces();
  }, []);

  // Initialize map
  const initMap = useCallback(() => {
    if (!mapRef.current) return;

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    infoWindowRef.current = new google.maps.InfoWindow();

    // Add click listener to map
    mapInstanceRef.current.addListener('click', () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    });

    setLoading(false);
  }, [center, zoom]);

  // Fetch places from backend
  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use default location (Ho Chi Minh City) if no map center
      const lat = center.lat;
      const lng = center.lng;

      const token = localStorage.getItem('access_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `/api/maps/${placeType}?lat=${lat}&lng=${lng}&min_rating=${minRating}&radius=${radius}&limit=20`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch places');
      }

      const data = await response.json();
      setPlaces(data);
      
      // Notify parent component about places update
      if (onPlacesUpdate) {
        onPlacesUpdate(data);
      }
    } catch (err) {
      console.error('Error fetching places:', err);
      setError('Không thể tải dữ liệu địa điểm');
    } finally {
      setLoading(false);
    }
  }, [placeType, minRating, radius, center]);

  // Add markers to map
  const addMarkersToMap = useCallback((placesData: Place[]) => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    placesData.forEach((place) => {
      const marker = new google.maps.Marker({
        position: {
          lat: place.coordinates.lat,
          lng: place.coordinates.lng
        },
        map: mapInstanceRef.current,
        title: place.name,
        icon: getMarkerIcon(place),
        animation: google.maps.Animation.DROP
      });

      // Add click listener to marker
      marker.addListener('click', () => {
        setSelectedPlace(place);
        showInfoWindow(marker, place);
        if (onPlaceSelect) {
          onPlaceSelect(place);
        }
      });

      markersRef.current.push(marker);
    });
  }, [onPlaceSelect]);

  // Get marker icon based on place type and rating
  const getMarkerIcon = (place: Place) => {
    const baseColor = getTypeColor(place.types[0] || placeType);
    const rating = place.rating;
    
    // Create custom marker with rating
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
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

  // Get color based on place type
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cafe':
      case 'coffee_shop':
        return '#8B4513'; // Brown
      case 'restaurant':
      case 'food':
        return '#FF6B6B'; // Red
      case 'lodging':
      case 'hotel':
        return '#4ECDC4'; // Teal
      case 'tourist_attraction':
        return '#45B7D1'; // Blue
      default:
        return '#95A5A6'; // Gray
    }
  };

  // Show info window
  const showInfoWindow = (marker: google.maps.Marker, place: Place) => {
    if (!infoWindowRef.current) return;

    const content = `
      <div style="padding: 10px; max-width: 300px;">
        <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${place.name}</h3>
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${place.address}</p>
        <div style="display: flex; align-items: center; margin: 8px 0;">
          <span style="color: #FFD700; font-size: 16px;">⭐</span>
          <span style="margin-left: 4px; font-weight: bold;">${place.rating}/5</span>
          <span style="margin-left: 8px; color: #666; font-size: 12px;">(${place.reviews_count} đánh giá)</span>
        </div>
        ${place.phone ? `<p style="margin: 4px 0; color: #666; font-size: 14px;">📞 ${place.phone}</p>` : ''}
        ${place.hours ? `<p style="margin: 4px 0; color: #666; font-size: 14px;">🕒 ${place.hours}</p>` : ''}
        ${place.opening_hours?.open_now ? '<p style="margin: 4px 0; color: #27AE60; font-size: 14px;">✅ Đang mở cửa</p>' : ''}
        <div style="margin-top: 10px;">
          <button onclick="window.selectPlace('${place.id}')" style="
            background: #3498DB; 
            color: white; 
            border: none; 
            padding: 8px 16px; 
            border-radius: 4px; 
            cursor: pointer;
            font-size: 14px;
          ">Xem chi tiết</button>
        </div>
      </div>
    `;

    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(mapInstanceRef.current, marker);

    // Add global function for button click
    (window as any).selectPlace = (placeId: string) => {
      const place = places.find(p => p.id === placeId);
      if (place && onPlaceSelect) {
        onPlaceSelect(place);
      }
    };
  };

  // Load places when map is ready
  useEffect(() => {
    if (mapInstanceRef.current && !loading) {
      fetchPlaces();
    }
  }, [fetchPlaces, loading]);

  // Reload places when filters change
  useEffect(() => {
    if (mapInstanceRef.current && !loading) {
      fetchPlaces();
    }
  }, [placeType, minRating, radius]);

  // Handle map center change
  const handleMapCenterChanged = useCallback(() => {
    if (mapInstanceRef.current) {
      const newCenter = mapInstanceRef.current.getCenter();
      if (newCenter) {
        // Debounce the search
        setTimeout(() => {
          fetchPlaces();
        }, 1000);
      }
    }
  }, [fetchPlaces]);

  // Add center changed listener
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.addListener('center_changed', handleMapCenterChanged);
      mapInstanceRef.current.addListener('idle', handleMapCenterChanged);
    }
  }, [handleMapCenterChanged]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bản đồ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-96 bg-red-50 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Places List Container */}
      <div className="w-full h-96 rounded-lg shadow-lg bg-gray-50 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Đang tải địa điểm...</p>
            </div>
          </div>
        ) : places.length > 0 ? (
          <div className="p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {placeType === 'coffee' ? 'Quán cà phê' : 
               placeType === 'restaurants' ? 'Nhà hàng' :
               placeType === 'hotels' ? 'Khách sạn' : 'Điểm tham quan'}
            </h3>
            {places.map((place) => (
              <div
                key={place.id}
                onClick={() => {
                  setSelectedPlace(place);
                  if (onPlaceSelect) onPlaceSelect(place);
                }}
                className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{place.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{place.address}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500">⭐</span>
                      <span className="ml-1 text-sm font-medium">{place.rating}/5</span>
                      <span className="ml-2 text-xs text-gray-500">({place.reviews_count} đánh giá)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-gray-400 text-4xl mb-2">📍</div>
              <p className="text-gray-600">Không tìm thấy địa điểm nào</p>
            </div>
          </div>
        )}
      </div>

      {/* Place Details Panel */}
      {selectedPlace && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{selectedPlace.name}</h3>
            <button
              onClick={() => setSelectedPlace(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{selectedPlace.address}</p>
          
          <div className="flex items-center mb-2">
            <span className="text-yellow-500">⭐</span>
            <span className="ml-1 font-semibold">{selectedPlace.rating}/5</span>
            <span className="ml-2 text-sm text-gray-500">({selectedPlace.reviews_count} đánh giá)</span>
          </div>
          
          {selectedPlace.phone && (
            <p className="text-sm text-gray-600 mb-1">📞 {selectedPlace.phone}</p>
          )}
          
          {selectedPlace.hours && (
            <p className="text-sm text-gray-600 mb-1">🕒 {selectedPlace.hours}</p>
          )}
          
          {selectedPlace.opening_hours?.open_now && (
            <p className="text-sm text-green-600 mb-2">✅ Đang mở cửa</p>
          )}
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onPlaceSelect?.(selectedPlace)}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
            >
              Xem chi tiết
            </button>
            {selectedPlace.website && (
              <a
                href={selectedPlace.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
              >
                Website
              </a>
            )}
          </div>
        </div>
      )}

      {/* Places Counter */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-3 py-2">
        <p className="text-sm text-gray-600">
          Tìm thấy <span className="font-semibold text-blue-600">{places.length}</span> địa điểm
        </p>
      </div>
    </div>
  );
};

export default MapComponent;
