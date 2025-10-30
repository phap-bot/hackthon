'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  HomeIcon,
  MapIcon,
  StarIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  QrCodeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const router = useRouter()

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

  const handleFeatureClick = (route: string) => {
    router.push(route)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chức năng
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Features List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <button
                    key={index}
                    onClick={() => handleFeatureClick(feature.route)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-left"
                  >
                    <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-700`}>
                      <IconComponent className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {feature.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Wanderlust Travel Explorer
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
