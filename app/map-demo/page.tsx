'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import SummaryBar from '../components/SummaryBar';
import PlacesMap from '../components/Map/PlacesMap';
import MapAccessControl from '../components/Map/MapAccessControl';
import LoginModal from '../components/Auth/LoginModal';
import { useAuth } from '../hooks/useAuth';

const MapDemoPage: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Không thể lấy vị trí hiện tại. Vui lòng cho phép truy cập vị trí.');
        }
      );
    } else {
      alert('Trình duyệt không hỗ trợ định vị địa lý.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SummaryBar currentPage="Bản đồ" showBackButton={true} />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bản đồ địa điểm</h1>
              <p className="text-sm text-gray-600">Tìm kiếm và khám phá các địa điểm xung quanh</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={getCurrentLocation}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                📍 Vị trí của tôi
              </button>
              <button
                onClick={() => setCurrentLocation({ lat: 21.0285, lng: 105.8542 })}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                🏛️ Hà Nội
              </button>
              <button
                onClick={() => setCurrentLocation({ lat: 10.8231, lng: 106.6297 })}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                🏙️ TP.HCM
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Hướng dẫn sử dụng</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Chọn loại địa điểm bạn muốn tìm kiếm (quán cà phê, nhà hàng, khách sạn, điểm tham quan)</li>
            <li>• Điều chỉnh đánh giá tối thiểu và bán kính tìm kiếm</li>
            <li>• Click vào các marker trên bản đồ để xem thông tin chi tiết</li>
            <li>• Sử dụng nút &quot;Vị trí của tôi&quot; để tìm kiếm xung quanh vị trí hiện tại</li>
          </ul>
        </div>

        {/* Map Access Control */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mở khóa hành trình hoàn hảo
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Tận dụng tối đa các công cụ lập kế hoạch tiên tiến của chúng tôi và khám phá những viên ngọc ẩn với bản đồ thời gian thực.
            </p>
            
            <MapAccessControl
              isLoggedIn={isLoggedIn}
              onLoginRequired={handleLoginRequired}
            />
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">☕</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quán cà phê</h3>
            <p className="text-sm text-gray-600">
              Tìm kiếm các quán cà phê chất lượng cao với đánh giá tốt xung quanh bạn
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">🍽️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nhà hàng</h3>
            <p className="text-sm text-gray-600">
              Khám phá các nhà hàng ngon với menu đa dạng và dịch vụ tốt
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">🏨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Khách sạn</h3>
            <p className="text-sm text-gray-600">
              Tìm kiếm khách sạn phù hợp với ngân sách và nhu cầu của bạn
            </p>
          </div>
        </div>

        {/* API Info */}
        <div className="mt-6 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin API</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Backend API:</strong> Tích hợp với SerpAPI để lấy dữ liệu địa điểm thực tế</p>
            <p><strong>Google Maps:</strong> Sử dụng Google Maps API để hiển thị bản đồ và marker</p>
            <p><strong>Tính năng:</strong> Lọc theo rating, bán kính, loại địa điểm</p>
            <p><strong>Dữ liệu:</strong> Tên, địa chỉ, rating, số đánh giá, giờ mở cửa, website</p>
          </div>
        </div>
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
