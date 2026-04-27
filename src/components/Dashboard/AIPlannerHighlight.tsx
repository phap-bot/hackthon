'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function AIPlannerHighlight() {
  const router = useRouter()

  const handleCreateItinerary = () => {
    router.push('/planner')
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold mb-4">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              AI-Powered
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
              Tạo lịch trình thông minh
            </h2>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 max-w-2xl">
              Để AI phân tích sở thích và tạo ra lịch trình du lịch hoàn hảo, 
              được tối ưu hóa theo ngân sách, thời gian và phong cách của bạn.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Phân tích sở thích cá nhân
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                Tối ưu hóa ngân sách
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Gợi ý địa điểm thông minh
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleCreateItinerary}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              Bắt đầu tạo lịch trình
            </button>
          </div>

          {/* Visual Element */}
          <div className="hidden lg:block ml-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-white text-4xl shadow-2xl">
                <span className="material-symbols-outlined">travel_explore</span>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
