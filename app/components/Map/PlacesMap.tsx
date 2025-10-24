'use client';

import React, { useState } from 'react';
import MapComponent from './MapComponent';
import MapFilters from './MapFilters';
import MapSearch from './MapSearch';
import PlacesList from './PlacesList';

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

interface PlacesMapProps {
  initialCenter?: {
    lat: number;
    lng: number;
  };
  initialZoom?: number;
  className?: string;
}

const PlacesMap: React.FC<PlacesMapProps> = ({
  initialCenter = { lat: 21.0285, lng: 105.8542 }, // Hà Nội
  initialZoom = 13,
  className = ''
}) => {
  const [placeType, setPlaceType] = useState<'coffee' | 'restaurants' | 'hotels' | 'attractions'>('coffee');
  const [minRating, setMinRating] = useState(4.0);
  const [radius, setRadius] = useState(5000);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showList, setShowList] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [currentCenter, setCurrentCenter] = useState(initialCenter);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
  };

  const handlePlaceTypeChange = (type: 'coffee' | 'restaurants' | 'hotels' | 'attractions') => {
    setPlaceType(type);
    setSelectedPlace(null); // Clear selection when changing type
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(rating);
    setSelectedPlace(null);
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    setSelectedPlace(null);
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setCurrentCenter({ lat: location.lat, lng: location.lng });
    setSearchQuery(location.address);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // The MapComponent will handle the search
  };

  const handlePlacesUpdate = (newPlaces: Place[]) => {
    setPlaces(newPlaces);
  };

  return (
    <div className={`flex gap-4 ${className}`}>
      {/* Left Panel - Filters and List */}
      <div className="w-80 flex-shrink-0 space-y-4">
        {/* Search */}
        <MapSearch
          onLocationSelect={handleLocationSelect}
          onSearch={handleSearch}
        />

        {/* Filters Panel */}
        {showFilters && (
          <MapFilters
            placeType={placeType}
            minRating={minRating}
            radius={radius}
            onPlaceTypeChange={handlePlaceTypeChange}
            onRatingChange={handleRatingChange}
            onRadiusChange={handleRadiusChange}
          />
        )}

        {/* Places List */}
        {showList && places.length > 0 && (
          <PlacesList
            places={places}
            onPlaceSelect={handlePlaceSelect}
            selectedPlaceId={selectedPlace?.id}
          />
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Control Buttons */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
          
          <button
            onClick={() => setShowList(!showList)}
            className="bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {showList ? 'Ẩn danh sách' : 'Hiện danh sách'}
          </button>
        </div>

        {/* Map Component */}
        <MapComponent
          center={currentCenter}
          zoom={initialZoom}
          placeType={placeType}
          minRating={minRating}
          radius={radius}
          onPlaceSelect={handlePlaceSelect}
          onPlacesUpdate={handlePlacesUpdate}
          className="h-full min-h-[500px]"
        />

        {/* Selected Place Details */}
        {selectedPlace && (
          <div className="absolute bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{selectedPlace.name}</h3>
              <button
                onClick={() => setSelectedPlace(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">📍 Địa chỉ</p>
                <p className="text-sm text-gray-800">{selectedPlace.address}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-yellow-500 text-lg">⭐</span>
                  <span className="ml-1 font-semibold text-lg">{selectedPlace.rating}/5</span>
                  <span className="ml-2 text-sm text-gray-500">({selectedPlace.reviews_count} đánh giá)</span>
                </div>
                <div className="text-sm text-gray-600">
                  {selectedPlace.price_level > 0 && '💰'.repeat(selectedPlace.price_level)}
                </div>
              </div>
              
              {selectedPlace.phone && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">📞 Điện thoại</p>
                  <a 
                    href={`tel:${selectedPlace.phone}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {selectedPlace.phone}
                  </a>
                </div>
              )}
              
              {selectedPlace.hours && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">🕒 Giờ mở cửa</p>
                  <p className="text-sm text-gray-800">{selectedPlace.hours}</p>
                </div>
              )}
              
              {selectedPlace.opening_hours?.open_now !== undefined && (
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${
                    selectedPlace.opening_hours.open_now ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedPlace.opening_hours.open_now ? '✅ Đang mở cửa' : '❌ Đã đóng cửa'}
                  </span>
                </div>
              )}
              
              {selectedPlace.types && selectedPlace.types.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">🏷️ Loại</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedPlace.types.map((type, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-3 border-t">
                {selectedPlace.website && (
                  <a
                    href={selectedPlace.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 text-center transition-colors"
                  >
                    Xem website
                  </a>
                )}
                <button
                  onClick={() => {
                    // Copy address to clipboard
                    navigator.clipboard.writeText(selectedPlace.address);
                    alert('Đã copy địa chỉ vào clipboard!');
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  Copy địa chỉ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacesMap;
