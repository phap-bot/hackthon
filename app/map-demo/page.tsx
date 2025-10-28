'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SummaryBar from '../components/SummaryBar';
import MandatoryGPSMapWrapper from '../components/Map/MandatoryGPSMapWrapper';
import LoginModal from '../components/Auth/LoginModal';
import { useAuth } from '../hooks/useAuth';

interface Place {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviews_count: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const MapDemoPage: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('catering.restaurant');
  const [radius, setRadius] = useState(5000);
  const [places, setPlaces] = useState<Place[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  const handlePlacesUpdate = (newPlaces: Place[]) => {
    setPlaces(newPlaces);
  };

  const categories = [
    { value: 'catering.restaurant', label: '🍽️ Nhà hàng' },
    { value: 'catering.cafe', label: '☕ Quán cà phê' },
    { value: 'accommodation.hotel', label: '🏨 Khách sạn' },
    { value: 'entertainment.museum', label: '🏛️ Bảo tàng' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SummaryBar currentPage="Bản đồ" showBackButton={true} />
      
      {/* Header Controls */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bản đồ địa điểm</h1>
              <p className="text-sm text-gray-600">Tìm kiếm và khám phá các địa điểm xung quanh</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={getCurrentLocation}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
              >
                📍 Vị trí của tôi
              </button>
              <button
                onClick={() => {
                  // Optional: Future implementation to manually set location
                  console.log('Hà Nội selected');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                🏛️ Hà Nội
              </button>
              <button
                onClick={() => {
                  // Optional: Future implementation to manually set location
                  console.log('TP.HCM selected');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                🏙️ TP.HCM
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

      {/* Main Content - Mandatory GPS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <MandatoryGPSMapWrapper
            zoom={13}
            categories={selectedCategory}
            radius={radius}
            onPlacesUpdate={handlePlacesUpdate}
            height="600px"
          />
        </div>

        {/* Places List */}
        {places.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Địa điểm gần đây ({places.length})
              </h3>
            </div>
            <div className="overflow-y-auto max-h-96">
              {places.map((place) => (
                <div key={place.id} className="p-4 border-b hover:bg-gray-50">
                  <h4 className="font-medium text-gray-900">{place.name}</h4>
                  <p className="text-sm text-gray-600">{place.address}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 text-sm">⭐</span>
                    <span className="ml-1 text-sm font-medium">{place.rating.toFixed(1)}</span>
                    <span className="ml-2 text-xs text-gray-500">({place.reviews_count})</span>
                  </div>
                </div>
              ))}
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

export default MapDemoPage;
