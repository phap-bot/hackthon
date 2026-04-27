'use client';

import React from 'react';

interface MapFiltersProps {
  placeType: 'coffee' | 'restaurants' | 'hotels' | 'attractions';
  minRating: number;
  radius: number;
  onPlaceTypeChange: (type: 'coffee' | 'restaurants' | 'hotels' | 'attractions') => void;
  onRatingChange: (rating: number) => void;
  onRadiusChange: (radius: number) => void;
  className?: string;
}

const MapFilters: React.FC<MapFiltersProps> = ({
  placeType,
  minRating,
  radius,
  onPlaceTypeChange,
  onRatingChange,
  onRadiusChange,
  className = ''
}) => {
  const placeTypes = [
    { value: 'coffee', label: 'Quán cà phê', icon: '☕', color: 'bg-amber-100 text-amber-800' },
    { value: 'restaurants', label: 'Nhà hàng', icon: '🍽️', color: 'bg-red-100 text-red-800' },
    { value: 'hotels', label: 'Khách sạn', icon: '🏨', color: 'bg-blue-100 text-blue-800' },
    { value: 'attractions', label: 'Điểm tham quan', icon: '🎯', color: 'bg-green-100 text-green-800' }
  ];

  const ratingOptions = [
    { value: 3.0, label: '3.0+ (kém)' },
    { value: 3.5, label: '3.5+ (tệ)' },
    { value: 4.0, label: '4.0+ (Khá )' },
    { value: 4.5, label: '4.5+ (Xuất sắc)' }
  ];

  const radiusOptions = [
    { value: 1000, label: '1 km' },
    { value: 2000, label: '2 km' },
    { value: 5000, label: '5 km' },
    { value: 10000, label: '10 km' }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc tìm kiếm</h3>
      
      {/* Place Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loại địa điểm
        </label>
        <div className="grid grid-cols-2 gap-2">
          {placeTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onPlaceTypeChange(type.value as any)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                placeType === type.value
                  ? `border-blue-500 ${type.color}`
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Đánh giá tối thiểu
        </label>
        <div className="space-y-2">
          {ratingOptions.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="rating"
                value={option.value}
                checked={minRating === option.value}
                onChange={(e) => onRatingChange(parseFloat(e.target.value))}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Radius Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bán kính tìm kiếm
        </label>
        <div className="space-y-2">
          {radiusOptions.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="radius"
                value={option.value}
                checked={radius === option.value}
                onChange={(e) => onRadiusChange(parseInt(e.target.value))}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Current Selection Summary */}
      <div className="bg-gray-50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Bộ lọc hiện tại:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>
            <span className="font-medium">Loại:</span> {
              placeTypes.find(t => t.value === placeType)?.label
            }
          </div>
          <div>
            <span className="font-medium">Đánh giá:</span> {minRating}+ sao
          </div>
          <div>
            <span className="font-medium">Bán kính:</span> {radius / 1000} km
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapFilters;
