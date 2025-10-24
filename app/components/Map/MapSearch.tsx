'use client';

import React, { useState, useRef, useEffect } from 'react';

interface MapSearchProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  onSearch: (query: string) => void;
  className?: string;
}

const MapSearch: React.FC<MapSearchProps> = ({
  onLocationSelect,
  onSearch,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  // Initialize Google Places services
  useEffect(() => {
    if (window.google && window.google.maps) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input: query,
          types: ['establishment'],
          componentRestrictions: { country: 'vn' } // Restrict to Vietnam
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.description);
    setShowSuggestions(false);
    
    // Get place details
    if (window.google && window.google.maps) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ placeId: suggestion.place_id }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          onLocationSelect({
            lat: location.lat(),
            lng: location.lng(),
            address: suggestion.description
          });
        }
      });
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Reverse geocode to get address
          if (window.google && window.google.maps) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                onLocationSelect({
                  lat,
                  lng,
                  address: results[0].formatted_address
                });
                setSearchQuery(results[0].formatted_address);
              } else {
                onLocationSelect({
                  lat,
                  lng,
                  address: `Vị trí hiện tại (${lat.toFixed(4)}, ${lng.toFixed(4)})`
                });
                setSearchQuery(`Vị trí hiện tại (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
              }
              setIsSearching(false);
            });
          } else {
            onLocationSelect({
              lat,
              lng,
              address: `Vị trí hiện tại (${lat.toFixed(4)}, ${lng.toFixed(4)})`
            });
            setSearchQuery(`Vị trí hiện tại (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
            setIsSearching(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Không thể lấy vị trí hiện tại. Vui lòng cho phép truy cập vị trí.');
          setIsSearching(false);
        }
      );
    } else {
      alert('Trình duyệt không hỗ trợ định vị địa lý.');
    }
  };

  // Quick location buttons
  const quickLocations = [
    { name: 'Hà Nội', lat: 21.0285, lng: 105.8542 },
    { name: 'TP.HCM', lat: 10.8231, lng: 106.6297 },
    { name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022 },
    { name: 'Hải Phòng', lat: 20.8449, lng: 106.6881 }
  ];

  const handleQuickLocation = (location: { name: string; lat: number; lng: number }) => {
    onLocationSelect({
      lat: location.lat,
      lng: location.lng,
      address: location.name
    });
    setSearchQuery(location.name);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm địa điểm, địa chỉ hoặc tuyến đường..."
            className="w-full px-4 py-3 pr-20 pl-12 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Action Buttons */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isSearching}
              className="p-2 text-gray-400 hover:text-blue-500 disabled:opacity-50"
              title="Vị trí hiện tại"
            >
              {isSearching ? (
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
            
            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            >
              Tìm
            </button>
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-gray-500">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Quick Location Buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-xs text-gray-500 self-center">Nhanh:</span>
        {quickLocations.map((location, index) => (
          <button
            key={index}
            onClick={() => handleQuickLocation(location)}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            {location.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MapSearch;
