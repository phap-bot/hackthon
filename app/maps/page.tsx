'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SummaryBar from '@/components/SummaryBar';
import GeoapifyMapWrapper from '@/components/Map/GeoapifyMapWrapper';
import LoginModal from '@/components/Auth/LoginModal';
import { useAuth } from '@/hooks/useAuth';

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

const MapsPage: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('catering.restaurant');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedPlaces, setSelectedPlaces] = useState<Array<{ id: string; name: string; coordinates: { lat: number; lng: number } }>>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [radius, setRadius] = useState(5000);
  const [places, setPlaces] = useState<Place[]>([]);
  const [showRoute, setShowRoute] = useState(false);

  const categories = [
    { value: 'catering.restaurant', label: '🍽️ Nhà hàng', icon: '🍽️' },
    { value: 'catering.cafe', label: '☕ Quán cà phê', icon: '☕' },
    { value: 'accommodation.hotel', label: '🏨 Khách sạn', icon: '🏨' },
    { value: 'entertainment.museum', label: '🏛️ Bảo tàng', icon: '🏛️' },
    { value: 'entertainment.night_club', label: '🎉 Quán bar', icon: '🎉' },
    { value: 'tourist_attraction', label: '🎯 Điểm tham quan', icon: '🎯' },
  ];

  // Manual location refresh (reload page)
  const getCurrentLocation = () => {
    window.location.reload();
  };

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    
    // 添加到已选择的列表（多选）
    if (!selectedPlaces.find(p => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, {
        id: place.id,
        name: place.name,
        coordinates: place.coordinates
      }]);
    }
  };
  
  const handleRouteToggle = () => {
    setShowRoute(!showRoute);
  };
  
  const clearSelectedPlaces = () => {
    setSelectedPlaces([]);
    setShowRoute(false);
  };

  const handlePlacesUpdate = (newPlaces: Place[]) => {
    setPlaces(newPlaces);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SummaryBar currentPage="Bản đồ thông minh" showBackButton={true} />
      
      {/* Header Controls */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bản đồ địa điểm</h1>
              <p className="text-sm text-gray-600">Khám phá các địa điểm xung quanh bạn</p>
            </div>
            
            {/* Location Controls */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={getCurrentLocation}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
              >
                📍 Vị trí của tôi
              </button>
              {/* Optional location buttons (future feature) */}
              {selectedPlaces.length >= 2 && (
                <>
                  <button
                    onClick={handleRouteToggle}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                      showRoute
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {showRoute ? '📍 Ẩn đường đi' : '📍 Vẽ đường đi'}
                  </button>
                  <button
                    onClick={clearSelectedPlaces}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    🗑️ Xóa tất cả
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="pb-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedCategory === cat.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Radius Control */}
          <div className="pb-4 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Bán kính: {radius / 1000}km
            </label>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <GeoapifyMapWrapper
                zoom={13}
                categories={selectedCategory}
                radius={radius}
                onPlaceSelect={handlePlaceSelect}
                onPlacesUpdate={handlePlacesUpdate}
                selectedPlaces={selectedPlaces}
                showRoute={showRoute}
                height="600px"
              />
            </div>
          </div>

          {/* Places List Sidebar */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Địa điểm gần đây ({places.length})
              </h3>
            </div>
            
            <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
              {places.length > 0 ? (
                <div className="divide-y">
                  {places.map((place) => {
                    const isSelected = selectedPlaces.find(p => p.id === place.id);
                    return (
                      <div
                        key={place.id}
                        onClick={() => {
                          setSelectedPlace(place);
                          handlePlaceSelect(place);
                        }}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition relative ${
                          selectedPlace?.id === place.id ? 'bg-blue-50' : ''
                        } ${isSelected ? 'border-l-4 border-green-500' : ''}`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            ✓
                          </div>
                        )}
                        <h4 className="font-medium text-gray-900 mb-1">{place.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{place.address}</p>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500 text-sm">⭐</span>
                          <span className="text-sm font-medium">{place.rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-500">({place.reviews_count} đánh giá)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">📍</div>
                  <p className="text-gray-600">Chưa có địa điểm nào</p>
                </div>
              )}
            </div>
            
            {/* Selected Places Info */}
            {selectedPlaces.length > 0 && (
              <div className="p-4 bg-blue-50 border-t">
                <p className="text-sm font-semibold text-blue-900 mb-2">
                  Đã chọn: {selectedPlaces.length} địa điểm
                </p>
                {selectedPlaces.length >= 2 && (
                  <p className="text-xs text-blue-700">
                    Click "Vẽ đường đi" để xem đường đi tối ưu
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        </div>

      </div>
  );
};

export default MapsPage;

