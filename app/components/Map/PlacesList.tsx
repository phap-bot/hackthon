'use client';

import React from 'react';

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

interface PlacesListProps {
  places: Place[];
  onPlaceSelect: (place: Place) => void;
  selectedPlaceId?: string;
  className?: string;
}

const PlacesList: React.FC<PlacesListProps> = ({
  places,
  onPlaceSelect,
  selectedPlaceId,
  className = ''
}) => {
  const getTypeIcon = (types: string[]) => {
    const type = types[0] || '';
    switch (type) {
      case 'cafe':
      case 'coffee_shop':
        return '☕';
      case 'restaurant':
      case 'food':
        return '🍽️';
      case 'lodging':
      case 'hotel':
        return '🏨';
      case 'tourist_attraction':
        return '🎯';
      default:
        return '📍';
    }
  };

  const getTypeColor = (types: string[]) => {
    const type = types[0] || '';
    switch (type) {
      case 'cafe':
      case 'coffee_shop':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'restaurant':
      case 'food':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'lodging':
      case 'hotel':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'tourist_attraction':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatPriceLevel = (priceLevel: number) => {
    if (priceLevel === 0) return 'Miễn phí';
    return '💰'.repeat(priceLevel);
  };

  const formatDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  if (places.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🔍</div>
          <p>Không tìm thấy địa điểm nào</p>
          <p className="text-sm">Thử thay đổi bộ lọc hoặc vị trí tìm kiếm</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Danh sách địa điểm ({places.length})
        </h3>
        <p className="text-sm text-gray-600">
          Sắp xếp theo đánh giá từ cao xuống thấp
        </p>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {places.map((place, index) => (
          <div
            key={place.id}
            onClick={() => onPlaceSelect(place)}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedPlaceId === place.id ? 'bg-blue-50 border-blue-200' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getTypeIcon(place.types)}</span>
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {place.name}
                  </h4>
                  {place.opening_hours?.open_now && (
                    <span className="text-xs text-green-600 font-medium">Mở</span>
                  )}
                </div>
                
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {place.address}
                </p>
                
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-medium">{place.rating}</span>
                    <span>({place.reviews_count})</span>
                  </div>
                  
                  {place.price_level > 0 && (
                    <div className="flex items-center gap-1">
                      <span>{formatPriceLevel(place.price_level)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <span>📍</span>
                    <span>{place.vicinity}</span>
                  </div>
                </div>
                
                {place.types && place.types.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {place.types.slice(0, 2).map((type, typeIndex) => (
                      <span
                        key={typeIndex}
                        className={`px-2 py-1 text-xs rounded-full border ${getTypeColor([type])}`}
                      >
                        {type.replace('_', ' ')}
                      </span>
                    ))}
                    {place.types.length > 2 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{place.types.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-1 ml-2">
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {place.rating}
                  </div>
                  <div className="text-xs text-gray-500">/5</div>
                </div>
                
                {place.phone && (
                  <a
                    href={`tel:${place.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    📞
                  </a>
                )}
                
                {place.website && (
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    🌐
                  </a>
                )}
              </div>
            </div>
            
            {place.hours && (
              <div className="mt-2 text-xs text-gray-500">
                🕒 {place.hours}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-gray-50 text-center">
        <p className="text-xs text-gray-500">
          Click vào địa điểm để xem chi tiết trên bản đồ
        </p>
      </div>
    </div>
  );
};

export default PlacesList;
