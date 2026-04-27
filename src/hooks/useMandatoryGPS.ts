'use client';

import { useState, useEffect, useCallback } from 'react';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface UseMandatoryGPSReturn {
  location: Location | null;
  loading: boolean;
  error: string | null;
  permission: 'granted' | 'denied' | 'prompt' | 'unknown';
  permissionDenied: boolean;
  requestLocation: () => void;
  retryLocation: () => void;
}

export const useMandatoryGPS = (): UseMandatoryGPSReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');

  const getAddressFromCoordinates = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/maps/reverse?lat=${lat}&lng=${lng}`);
      if (!response.ok) {
        console.log('Reverse geocoding failed, using coordinates');
        return null;
      }
      const data = await response.json();
      const address = data.address || data.address_line1 || `${data.city || ''}, ${data.country || ''}`.trim();
      console.log('Got address:', address);
      return address;
    } catch (err) {
      console.error('Error getting address:', err);
      return null;
    }
  }, []);

  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if geolocation is supported
      if (!("geolocation" in navigator)) {
        setError("Trình duyệt không hỗ trợ định vị.");
        setPermission('denied');
        return;
      }

      // Check permissions API if available
      if ('permissions' in navigator) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          console.log('Permission status:', permissionStatus.state);
          
          setPermission(permissionStatus.state as 'granted' | 'denied' | 'prompt');
          
          // Listen for permission changes
          permissionStatus.onchange = () => {
            console.log('Permission changed to:', permissionStatus.state);
            setPermission(permissionStatus.state as 'granted' | 'denied' | 'prompt');
            
            // If permission granted, try to get location
            if (permissionStatus.state === 'granted') {
              requestLocation();
            }
          };

          // If already denied, don't try to get location
          if (permissionStatus.state === 'denied') {
            setLoading(false);
            return;
          }
        } catch (permError) {
          console.log('Permissions API not supported, proceeding with geolocation');
        }
      }

      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      console.log('✅ Got real GPS location:', { lat, lng });

      // Get address via reverse geocoding (non-blocking)
      let address: string | null = null;
      try {
        address = await getAddressFromCoordinates(lat, lng);
      } catch (e) {
        console.log('⚠️ Reverse geocoding failed, but GPS location is valid');
      }

      setLocation({
        lat,
        lng,
        address: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      });

      setPermission('granted');
      setError(null);
      
    } catch (err: any) {
      console.log('❌ GPS access denied or failed');
      console.log('Error details:', err);

      // Determine error type
      let errorMessage = 'Không thể lấy vị trí hiện tại.';

      switch (err.code) {
        case GeolocationPositionError?.PERMISSION_DENIED:
        case 1:
          setPermission('denied');
          errorMessage = 'Bạn đã từ chối quyền truy cập vị trí.';
          console.log('❌ PERMISSION_DENIED: Người dùng từ chối GPS');
          break;
        case GeolocationPositionError?.POSITION_UNAVAILABLE:
        case 2:
          setPermission('prompt');
          errorMessage = 'Không thể xác định vị trí. Bật Wi-Fi hoặc thử lại.';
          console.log('❌ POSITION_UNAVAILABLE: Không có tín hiệu GPS');
          break;
        case GeolocationPositionError?.TIMEOUT:
        case 3:
          setPermission('prompt');
          errorMessage = 'Quá thời gian chờ định vị. Hãy thử lại.';
          console.log('❌ TIMEOUT: GPS timeout');
          break;
        default:
          setPermission('prompt');
          errorMessage = 'Lỗi GPS. Vui lòng thử lại.';
          console.log('❌ Unknown GPS error:', err);
      }

      setLocation(null);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getAddressFromCoordinates]);

  const retryLocation = useCallback(() => {
    requestLocation();
  }, [requestLocation]);

  // Initial load
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    location,
    loading,
    error,
    permission,
    permissionDenied: permission === 'denied',
    requestLocation,
    retryLocation
  };
};