import { useEffect, useState } from "react";

interface Location {
  lat: number;
  lon: number;
}

export function useUserLocation(defaultLocation: Location = { lat: 13.782, lon: 109.219 }) {
  const [location, setLocation] = useState<Location>(defaultLocation);
  const [isGranted, setGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setGranted(true);
        setError(null);
        setLoading(false);
        console.log("✅ GPS thành công:", { lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        console.warn("⚠️ GPS lỗi:", err.message);
        setError(err.message);
        setGranted(false);
        setLoading(false);
        console.log("❌ Không thể lấy vị trí GPS thực tế");
        // Không sử dụng fallback - user phải cấp quyền GPS
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [defaultLocation]);

  return { location, isGranted, error, loading };
}
