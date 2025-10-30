'use client';

import React, { useEffect, useState } from 'react';
import GeoapifyMap from './GeoapifyMap';
import { useSmartGeolocation } from '../../hooks/useSmartGeolocation';

interface GeoapifyMapWrapperProps {
  zoom?: number;
  categories?: string;
  radius?: number;
  onPlaceSelect?: (place: any) => void;
  onPlacesUpdate?: (places: any[]) => void;
  onRouteSelect?: (route: any) => void;
  selectedPlaces?: Array<{ id: string; name: string; coordinates: { lat: number; lng: number } }>;
  showRoute?: boolean;
  className?: string;
  height?: string;
  centerOverride?: { lat: number; lng: number } | null;
}

const GeoapifyMapWrapper: React.FC<GeoapifyMapWrapperProps> = ({
  zoom = 13,
  categories = 'catering.restaurant',
  radius = 5000,
  onPlaceSelect,
  onPlacesUpdate,
  onRouteSelect,
  selectedPlaces = [],
  showRoute = false,
  className = '',
  height = '80vh',
  centerOverride = null
}) => {
  const { location, loading, error, isRealGPS } = useSmartGeolocation();
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    if (location) {
      setUserAddress(location.address || '');
    }
  }, [location]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-[80vh] ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang lấy vị trí của bạn...</p>
        </div>
      </div>
    );
  }
  
  if (!location) {
    return (
      <div className={`flex items-center justify-center h-[80vh] ${className}`}>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600">Không thể lấy vị trí. Vui lòng refresh trang.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const effectiveCenter = centerOverride || location;

  return (
    <div className={`relative ${className}`}>
      {/* GPS Status Indicator */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg px-4 py-3 max-w-sm">
        <div className="flex items-start gap-3">
          <div className={`text-2xl ${isRealGPS ? 'text-green-500' : 'text-orange-500'}`}>
            {isRealGPS ? '📍' : '⚠️'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {isRealGPS ? 'Vị trí của bạn' : 'Vị trí giả định'}
            </p>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {userAddress || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}
            </p>
            {!isRealGPS && error && (
              <p className="text-xs text-orange-600 mt-1">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Map */}
      <GeoapifyMap
        center={effectiveCenter as any}
        zoom={zoom}
        categories={categories}
        radius={radius}
        onPlaceSelect={onPlaceSelect}
        onPlacesUpdate={onPlacesUpdate}
        onRouteSelect={onRouteSelect}
        selectedPlaces={selectedPlaces}
        showRoute={showRoute}
        height={height}
      />

      {/* Error Toast (optional, can be replaced with toast library) */}
      {!loading && error && (
        <div className="absolute top-4 right-4 z-[1000] bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 max-w-sm animate-slide-down">
          <div className="flex items-center gap-2">
            <span className="text-orange-500">⚠️</span>
            <p className="text-sm text-orange-800">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoapifyMapWrapper;

