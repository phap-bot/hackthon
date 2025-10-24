'use client'
import React from 'react'

export default function HeroSection() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-3">
          Chào mừng trở lại, Nhà thám hiểm!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Hành trình tiếp theo của bạn đang chờ đợi.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input 
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm" 
              placeholder="Tìm kiếm điểm đến..." 
              type="search"
            />
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors text-sm whitespace-nowrap">
            Lập kế hoạch chuyến đi mới
          </button>
        </div>
      </div>
    </div>
  )
}
