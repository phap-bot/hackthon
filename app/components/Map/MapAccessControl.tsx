'use client';

import React, { useState } from 'react';
import GeoapifyMapWrapper from './GeoapifyMapWrapper';

interface MapAccessControlProps {
  isLoggedIn: boolean;
  onLoginRequired: () => void;
  className?: string;
}

const MapAccessControl: React.FC<MapAccessControlProps> = ({
  isLoggedIn,
  onLoginRequired,
  className = ''
}) => {
  const [showMap, setShowMap] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleExploreClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setShowMap(true);
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    onLoginRequired();
  };

  const handleCloseMap = () => {
    setShowMap(false);
  };

  if (showMap) {
    return (
      <div className={`fixed inset-0 z-50 bg-white ${className}`}>
        {/* Header with close button */}
        <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Khám phá địa điểm</h2>
          <button
            onClick={handleCloseMap}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Map Component */}
        <div className="h-[calc(100vh-80px)]">
          <GeoapifyMapWrapper
            zoom={13}
            categories="catering.restaurant"
            radius={5000}
            height="100%"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Explore Button */}
      <button
        onClick={handleExploreClick}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        Khám Phá Thêm
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Yêu cầu đăng nhập</h3>
                  <p className="text-sm text-gray-600">Để sử dụng tính năng này</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Vui lòng đăng nhập để tiếp tục
                </h4>
                
                <p className="text-gray-600 mb-6">
                  Để sử dụng tính năng khám phá địa điểm và lập kế hoạch du lịch, 
                  bạn cần đăng nhập vào tài khoản của mình.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h5 className="font-medium text-blue-900 mb-2">Tính năng sau khi đăng nhập:</h5>
                  <ul className="text-sm text-blue-800 space-y-1 text-left">
                    <li>• Khám phá địa điểm với bản đồ tương tác</li>
                    <li>• Tìm kiếm quán cà phê, nhà hàng, khách sạn</li>
                    <li>• Lọc theo đánh giá và khoảng cách</li>
                    <li>• Lưu địa điểm yêu thích</li>
                    <li>• Lập kế hoạch du lịch cá nhân</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleLogin}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MapAccessControl;
