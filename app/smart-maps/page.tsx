'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SummaryBar from '@/components/SummaryBar';
import SmartSuggestionsMap from '@/components/Map/SmartSuggestionsMap';
import LoginModal from '@/components/Auth/LoginModal';
import { useAuth } from '@/hooks/useAuth';
import { useMandatoryGPS } from '@/hooks/useMandatoryGPS';

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

const SmartMapsPage: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const { location, loading: gpsLoading, error: gpsError, permissionDenied } = useMandatoryGPS();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('catering.restaurant');
  const [selectedPlace, setSelectedPlace] = useState<SmartPlace | null>(null);
  const [radius, setRadius] = useState(5000);
  const [suggestions, setSuggestions] = useState<SmartSuggestionsData | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const categories = [
    { value: 'catering.restaurant', label: '🍽️ Nhà hàng', icon: '🍽️' },
    { value: 'catering.cafe', label: '☕ Quán cà phê', icon: '☕' },
    { value: 'accommodation.hotel', label: '🏨 Khách sạn', icon: '🏨' },
    { value: 'entertainment.museum', label: '🏛️ Bảo tàng', icon: '🏛️' },
    { value: 'entertainment.night_club', label: '🎉 Quán bar', icon: '🎉' },
    { value: 'tourist_attraction', label: '🎯 Điểm tham quan', icon: '🎯' },
  ];

  const handlePlaceSelect = (place: SmartPlace) => {
    setSelectedPlace(place);
  };

  const handleSuggestionsUpdate = (newSuggestions: SmartSuggestionsData) => {
    setSuggestions(newSuggestions);
  };

  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  // Manual location refresh (reload page)
  const getCurrentLocation = () => {
    window.location.reload();
  };

  // Show loading if GPS is loading
  if (gpsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <SummaryBar currentPage="Bản đồ thông minh" showBackButton={true} />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang lấy vị trí GPS của bạn...</p>
            <p className="text-sm text-gray-500 mt-2">Vui lòng cho phép truy cập vị trí</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if GPS failed
  if (gpsError || !location) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <SummaryBar currentPage="Bản đồ thông minh" showBackButton={true} />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 text-6xl mb-4">📍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {permissionDenied ? 'Cần quyền truy cập vị trí' : 'Lỗi định vị GPS'}
            </h3>
            <p className="text-gray-600 mb-4">
              {permissionDenied 
                ? 'Bạn cần cho phép truy cập vị trí để sử dụng tính năng này.'
                : gpsError
              }
            </p>
            
            {permissionDenied && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-blue-900 mb-2">Cách bật lại quyền:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Click vào biểu tượng 🔒 hoặc 📍 trên thanh địa chỉ</li>
                  <li>2. Chọn "Cho phép" trong phần Location</li>
                  <li>3. Refresh trang này</li>
                </ol>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={getCurrentLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                🔄 Thử lại
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                🔄 Refresh trang
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SummaryBar currentPage="Bản đồ thông minh" showBackButton={true} />
      
      {/* Header Controls */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🌟 Bản đồ địa điểm nổi bật</h1>
              <p className="text-sm text-gray-600">Gợi ý thông minh từ Geoapify + SerpAPI</p>
            </div>
            
            {/* Location Controls */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={getCurrentLocation}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
              >
                📍 Vị trí của tôi
              </button>
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
              <SmartSuggestionsMap
                center={location}
                zoom={13}
                categories={selectedCategory}
                radius={radius}
                onPlaceSelect={handlePlaceSelect}
                onSuggestionsUpdate={handleSuggestionsUpdate}
                height="600px"
              />
            </div>
          </div>

          {/* Suggestions List Sidebar */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                🌟 Địa điểm nổi bật
              </h3>
              {suggestions && (
                <p className="text-sm text-gray-600">
                  {suggestions.high_rated.length} nổi bật / {suggestions.total_found} tổng cộng
                </p>
              )}
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
              {suggestions && suggestions.suggestions.length > 0 ? (
                <div className="divide-y">
                  {suggestions.suggestions.map((place) => {
                    const isHighRated = place.rating >= 4.5;
                    const isGoodRated = place.rating >= 4.0;
                    
                    return (
                      <div
                        key={place.id}
                        onClick={() => handlePlaceSelect(place)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition relative ${
                          selectedPlace?.id === place.id ? 'bg-blue-50' : ''
                        } ${isHighRated ? 'border-l-4 border-yellow-400' : isGoodRated ? 'border-l-4 border-teal-400' : ''}`}
                      >
                        {isHighRated && (
                          <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            🌟 Nổi bật
                          </div>
                        )}
                        
                        <div className="flex items-start gap-3">
                          {place.thumbnail && (
                            <img
                              src={place.thumbnail}
                              alt={place.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{place.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{place.address}</p>

                            <div className="flex items-center gap-2">
                              <span className="text-yellow-500 text-sm">⭐</span>
                              <span className="text-sm font-medium">{place.rating.toFixed(1)}</span>
                              <span className="text-xs text-gray-500">({place.reviews_count} đánh giá)</span>
                            </div>

                            {place.opening_hours?.open_now !== undefined && (
                              <p className={`text-xs font-medium mt-1 ${
                                place.opening_hours.open_now ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {place.opening_hours.open_now ? '✅ Đang mở cửa' : '❌ Đã đóng cửa'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">🌟</div>
                  <p className="text-gray-600">Đang tìm địa điểm nổi bật...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Place Details Modal */}
        {selectedPlace && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
              
              <div className="flex items-start gap-4 mb-4">
                {selectedPlace.thumbnail && (
                  <img
                    src={selectedPlace.thumbnail}
                    alt={selectedPlace.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedPlace.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedPlace.address}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500 text-lg">⭐</span>
                    <span className="font-semibold text-lg">{selectedPlace.rating.toFixed(1)}/5</span>
                    <span className="text-sm text-gray-500">({selectedPlace.reviews_count} đánh giá)</span>
                    {selectedPlace.rating >= 4.5 && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        🌟 Nổi bật
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {selectedPlace.phone && (
                <p className="text-sm text-gray-600 mb-1">📞 {selectedPlace.phone}</p>
              )}
              {selectedPlace.website && (
                <p className="text-sm text-gray-600 mb-1">🌐 <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedPlace.website}</a></p>
              )}
              {selectedPlace.opening_hours?.hours_text && (
                <p className="text-sm text-gray-600 mb-1">🕒 {selectedPlace.opening_hours.hours_text}</p>
              )}
              {selectedPlace.opening_hours?.open_now !== undefined && (
                <p className={`text-sm font-medium mb-4 ${selectedPlace.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedPlace.opening_hours.open_now ? '✅ Đang mở cửa' : '❌ Đã đóng cửa'}
                </p>
              )}

              <div className="flex gap-3">
                {selectedPlace.gmap_link && (
                  <a
                    href={selectedPlace.gmap_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition text-center"
                  >
                    Xem trên Google Maps
                  </a>
                )}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedPlace.address);
                    alert('Đã copy địa chỉ vào clipboard!');
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition"
                >
                  Copy địa chỉ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default SmartMapsPage;
