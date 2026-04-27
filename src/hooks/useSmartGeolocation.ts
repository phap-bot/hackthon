import { useState, useEffect, useRef } from "react";

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

// 计算两点之间的距离（米）
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3; // 地球半径（米）
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

export function useSmartGeolocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRealGPS, setIsRealGPS] = useState<boolean>(false);
  
  // 🔄 使用 ref 存储上次更新的位置和时间
  const lastUpdateRef = useRef<{ location: Location; timestamp: number } | null>(null);
  const throttledLocationRef = useRef<Location | null>(null);
  
  // ⏱️ 防抖和节流参数
  const MIN_DISTANCE = 10; // 最小移动距离（米）- 只有移动超过10米才更新
  const MIN_UPDATE_INTERVAL = 2000; // 最小更新间隔（毫秒）- 至少2秒更新一次

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Trình duyệt của bạn không hỗ trợ định vị GPS.");
      setLoading(false);
      return;
    }

    // ✅ Hàm xử lý khi lấy được vị trí thành công（带节流）
    const handleSuccess = (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      const newLocation = { lat: latitude, lng: longitude };
      const now = Date.now();
      
      console.log("📍 GPS收到位置:", { lat: latitude, lng: longitude });

      // 如果是第一次获取位置，直接更新
      if (!lastUpdateRef.current) {
        console.log("✅ 首次获取GPS位置");
        setLocation(newLocation);
        setError(null);
        setLoading(false);
        setIsRealGPS(true);
        lastUpdateRef.current = { location: newLocation, timestamp: now };
        throttledLocationRef.current = newLocation;
        return;
      }

      // 计算移动距离
      const distance = calculateDistance(
        lastUpdateRef.current.location.lat,
        lastUpdateRef.current.location.lng,
        latitude,
        longitude
      );

      // 计算时间间隔
      const timeSinceLastUpdate = now - lastUpdateRef.current.timestamp;

      console.log(`📍 移动距离: ${distance.toFixed(2)}m, 时间间隔: ${timeSinceLastUpdate}ms`);

      // ✅ 只有移动距离超过阈值或时间间隔足够长才更新
      if (distance >= MIN_DISTANCE || timeSinceLastUpdate >= MIN_UPDATE_INTERVAL) {
        console.log(`✅ 更新位置 (距离: ${distance.toFixed(2)}m)`);
        setLocation(newLocation);
        setIsRealGPS(true);
        lastUpdateRef.current = { location: newLocation, timestamp: now };
        throttledLocationRef.current = newLocation;
      } else {
        console.log(`⏭️ 跳过微小GPS变化 (${distance.toFixed(2)}m)`);
      }

      // 更新错误和加载状态
      setError(null);
      setLoading(false);
    };

    // ⚠️ Hàm xử lý khi có lỗi
    const handleError = (err: GeolocationPositionError) => {
      console.warn("⚠️ Lỗi GPS:", err);
      if (err.code === 1) {
        setError("Bạn đã từ chối quyền truy cập vị trí. Vui lòng bật GPS.");
      } else if (err.code === 2) {
        setError("Không thể xác định vị trí. Kiểm tra kết nối mạng hoặc GPS.");
      } else if (err.code === 3) {
        setError("Yêu cầu định vị mất quá nhiều thời gian. Thử lại sau.");
      } else {
        setError("Không thể lấy thông tin vị trí.");
      }
      setLoading(false);
      setIsRealGPS(false);
    };

    // 🚀 Lấy vị trí lần đầu tiên
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    // 🔄 Theo dõi vị trí realtime khi di chuyển
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      maximumAge: 10000, // 使用缓存数据避免过于频繁
      timeout: 20000,
    });

    // 🧹 Dọn dẹp khi component unmount
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { location, error, loading, isRealGPS };
}
