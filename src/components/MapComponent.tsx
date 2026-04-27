"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapComponentProps {
  center: { lat: number; lon: number };
  className?: string;
  height?: string;
  onCenterChange?: (lat: number, lon: number) => void;
  draggable?: boolean; // Cho phép kéo marker
}

export default function MapComponent({ center, className = "", height = "600px", onCenterChange, draggable = true }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [places, setPlaces] = useState<any[]>([]);

  // Fetch nearby places
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        // Call backend API instead of direct Geoapify
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const categories = encodeURIComponent("catering.restaurant,catering.cafe,tourism.attraction");
        const url = `${backendUrl}/api/maps/nearby?lat=${center.lat}&lng=${center.lon}&categories=${categories}&radius=5000&limit=10`;
        
        console.log('Fetching places from backend...', url);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Places fetched:', data?.length || 0);
        setPlaces(data || []);
      } catch (error) {
        console.error("Error fetching places:", error);
        setPlaces([]); // Set empty array instead of showing error
      }
    };

    fetchPlaces();
  }, [center.lat, center.lon]);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      mapRef.current = L.map("map").setView([center.lat, center.lon], 13);

      // Add tile layer
      L.tileLayer(
        `https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`,
        { 
          attribution: "© OpenStreetMap, Geoapify",
          maxZoom: 18
        }
      ).addTo(mapRef.current);

      // Add draggable user location marker
      const marker = L.marker([center.lat, center.lon], {
        draggable: draggable,
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })
      })
        .addTo(mapRef.current)
        .bindPopup("📍 Vị trí của bạn (kéo để di chuyển)")
        .openPopup();

      markerRef.current = marker;

      // Handle marker drag event
      if (draggable && onCenterChange) {
        marker.on('dragend', (e: any) => {
          const newPos = e.target.getLatLng();
          onCenterChange(newPos.lat, newPos.lng);
        });
      }
    } else {
      // Update map center
      mapRef.current.setView([center.lat, center.lon], 13);
      
      // Update marker position
      if (markerRef.current) {
        markerRef.current.setLatLng([center.lat, center.lon]);
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [center, draggable, onCenterChange]);

  // Add places markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing place markers (keep tile layers)
    const layersToRemove: L.Layer[] = [];
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer !== markerRef.current) {
        layersToRemove.push(layer);
      }
    });
    layersToRemove.forEach(layer => mapRef.current?.removeLayer(layer));

    // Don't add user marker here if already exists
    if (markerRef.current) {
      markerRef.current.setLatLng([center.lat, center.lon]);
    }

    // Add places markers
    places.forEach((place) => {
      if (place.geometry?.coordinates) {
        const [lon, lat] = place.geometry.coordinates;
        L.marker([lat, lon])
          .addTo(mapRef.current!)
          .bindPopup(`
            <div class="min-w-[200px]">
              <h3 class="font-semibold text-gray-900 mb-1">${place.properties.name || "Không tên"}</h3>
              <p class="text-sm text-gray-600 mb-2">${place.properties.address_line2 || place.properties.address_line1 || ""}</p>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-yellow-500">⭐</span>
                <span class="text-sm font-medium">${place.properties.rating || "Chưa có đánh giá"}</span>
              </div>
              <p class="text-xs text-gray-500">Loại: ${place.properties.categories?.[0] || "Không xác định"}</p>
            </div>
          `);
      }
    });
  }, [places, center]);

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div id="map" className="w-full h-full rounded-xl shadow-md" />
      
      {/* Places counter */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2 z-[1000]">
        <p className="text-sm text-gray-600">
          Tìm thấy <span className="font-semibold text-blue-600">{places.length}</span> địa điểm
        </p>
      </div>
    </div>
  );
}
