'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon,
  HomeIcon,
  MapIcon,
  StarIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline'

interface SummaryBarProps {
  currentPage?: string
  showBackButton?: boolean
}

export default function SummaryBar({ currentPage = 'Dashboard', showBackButton = true }: SummaryBarProps) {
  const router = useRouter()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/dashboard')
    }
  }

  const features = [
    {
      icon: HomeIcon,
      name: 'Trang chủ',
      description: 'Dashboard chính',
      color: 'text-blue-500',
      route: '/dashboard'
    },
    {
      icon: StarIcon,
      name: 'Tạo lịch trình',
      description: 'AI tạo lịch trình',
      color: 'text-purple-500',
      route: '/planner'
    },
    {
      icon: MapIcon,
      name: 'Bản đồ',
      description: 'Khám phá địa điểm',
      color: 'text-green-500',
      route: '/map-demo'
    },
    {
      icon: MagnifyingGlassIcon,
      name: 'Khám phá',
      description: 'Tìm điểm đến',
      color: 'text-orange-500',
      route: '/map-demo'
    },
    {
      icon: DocumentTextIcon,
      name: 'Lịch trình',
      description: 'Quản lý chuyến đi',
      color: 'text-indigo-500',
      route: '/itinerary'
    },
    {
      icon: CalendarDaysIcon,
      name: 'Booking',
      description: 'Đặt chỗ',
      color: 'text-pink-500',
      route: '/booking'
    },
    {
      icon: QrCodeIcon,
      name: 'Scan địa điểm',
      description: 'Quét QR code',
      color: 'text-cyan-500',
      route: '/scan-location'
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Back Button */}
          {showBackButton && (
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Quay lại
            </button>
          )}

          {/* Current Page */}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentPage}
            </h1>
          </div>

          {/* Features Summary */}
          <div className="hidden lg:flex items-center gap-1">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <button
                  key={index}
                  onClick={() => router.push(feature.route)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                  title={`${feature.name}: ${feature.description}`}
                >
                  <IconComponent className={`w-4 h-4 ${feature.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 hidden xl:block">
                    {feature.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Mobile Features Summary */}
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {features.slice(0, 4).map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <button
                  key={index}
                  onClick={() => router.push(feature.route)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  title={`${feature.name}: ${feature.description}`}
                >
                  <IconComponent className={`w-4 h-4 ${feature.color}`} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {feature.name}
                  </span>
                </button>
              )
            })}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              +{features.length - 4} chức năng khác
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
