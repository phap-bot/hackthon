'use client';

import React, { useState } from 'react';
import MapAccessControl from '../components/Map/MapAccessControl';
import LoginModal from '../components/Auth/LoginModal';
import { useAuth } from '../hooks/useAuth';

const AuthDemoPage: React.FC = () => {
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Demo Authentication</h1>
              <p className="text-sm text-gray-600">Test tính năng đăng nhập và bản đồ</p>
            </div>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                  <p className="text-xs text-gray-500">@{user?.username}</p>
                </div>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Trạng thái đăng nhập</h2>
          
          {isLoggedIn ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-green-900">Đã đăng nhập</h3>
                  <p className="text-sm text-green-700">
                    Bạn có thể sử dụng tất cả tính năng của ứng dụng
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-yellow-900">Chưa đăng nhập</h3>
                  <p className="text-sm text-yellow-700">
                    Bạn cần đăng nhập để sử dụng tính năng bản đồ
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map Access Control Demo */}
        <div className="bg-white rounded-lg shadow-lg p-8">
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

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Hướng dẫn test</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <span className="font-medium">1.</span>
              <p>Nếu chưa đăng nhập, click &quot;Đăng nhập&quot; ở góc phải trên để tạo tài khoản hoặc đăng nhập</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-medium">2.</span>
              <p>Click &quot;Khám Phá Thêm&quot; để test tính năng bản đồ</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-medium">3.</span>
              <p>Nếu chưa đăng nhập, sẽ hiện modal yêu cầu đăng nhập</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-medium">4.</span>
              <p>Nếu đã đăng nhập, sẽ mở giao diện bản đồ đầy đủ</p>
            </div>
          </div>
        </div>

        {/* API Info */}
        <div className="mt-6 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin API</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Authentication:</strong> JWT token-based authentication</p>
            <p><strong>Backend:</strong> FastAPI với MongoDB</p>
            <p><strong>Frontend:</strong> Next.js với TypeScript</p>
            <p><strong>Maps:</strong> Google Maps API + SerpAPI</p>
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

export default AuthDemoPage;
