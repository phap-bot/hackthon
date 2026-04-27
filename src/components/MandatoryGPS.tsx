'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMandatoryGPS } from '@/hooks/useMandatoryGPS';

interface MandatoryGPSProps {
  children: React.ReactNode;
  className?: string;
}

const MandatoryGPS: React.FC<MandatoryGPSProps> = ({ children, className = '' }) => {
  const { location, loading, error, permission, requestLocation, retryLocation } = useMandatoryGPS();
  const [showDetailedGuide, setShowDetailedGuide] = useState(false);

  // Check if we're on localhost and reset permission if port changed
  useEffect(() => {
    const currentOrigin = window.location.origin;
    const savedOrigin = localStorage.getItem('gps_origin');
    
    if (savedOrigin && savedOrigin !== currentOrigin) {
      console.log('Port/origin changed, resetting GPS permission');
      localStorage.removeItem('gps_permission');
    }
    
    localStorage.setItem('gps_origin', currentOrigin);
  }, []);

  const openLocationSettings = () => {
    // Try to open browser location settings
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    
    if (isChrome) {
      window.open('chrome://settings/content/location', '_blank');
    } else if (isFirefox) {
      window.open('about:preferences#privacy', '_blank');
    } else {
      // Generic fallback
      alert('Vui lòng vào Cài đặt trình duyệt → Quyền riêng tư → Vị trí và bật lại quyền truy cập.');
    }
  };

  const handleRetry = () => {
    requestLocation();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl mb-4"
          >
            📍
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Đang xác định vị trí của bạn...</p>
            <p className="text-sm text-gray-500">Vui lòng cho phép truy cập vị trí</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Permission denied state
  if (permission === 'denied') {
    return (
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl mb-6 text-red-500"
            >
              ❌
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cần quyền truy cập vị trí
            </h2>
            
            <p className="text-gray-600 mb-6">
              Bạn cần cho phép truy cập vị trí để hiển thị các địa điểm xung quanh.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-3">Hướng dẫn chi tiết:</h3>
              <ol className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  <span>Click vào biểu tượng ổ khóa 🔒 trên thanh địa chỉ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <span>Chọn "Cho phép" trong phần Vị trí (Location)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <span>Sau đó bấm "Thử lại"</span>
                </li>
              </ol>
            </div>

            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRetry}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                🔄 Thử lại
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openLocationSettings}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                📘 Hướng dẫn chi tiết
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRefresh}
                className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                🔄 Refresh trang
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Permission prompt state
  if (permission === 'prompt') {
    return (
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl mb-6 text-blue-500"
            >
              📍
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cần quyền truy cập vị trí
            </h2>
            
            <p className="text-gray-600 mb-6">
              Bạn cần cho phép truy cập vị trí để hiển thị các địa điểm xung quanh.
            </p>

            {error && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-orange-800">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRetry}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                🔄 Cho phép và thử lại
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openLocationSettings}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                📘 Hướng dẫn chi tiết
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Other GPS errors
  if (error && !location) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl mb-6 text-orange-500"
            >
              ⚠️
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Lỗi định vị GPS
            </h2>
            
            <p className="text-gray-600 mb-6">{error}</p>
            
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRetry}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                🔄 Thử lại
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRefresh}
                className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                🔄 Refresh trang
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // No location (should not happen, but safety check)
  if (!location) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <p className="text-gray-600 mb-4">Không thể lấy vị trí. Vui lòng thử lại.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRetry}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 mx-auto"
          >
            🔄 Thử lại
          </motion.button>
        </div>
      </div>
    );
  }

  // Success - Render children with GPS location
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default MandatoryGPS;
