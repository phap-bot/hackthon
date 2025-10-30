'use client'
import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  HomeIcon,
  MapIcon,
  StarIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  QrCodeIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)

  const navigationItems = [
    {
      icon: HomeIcon,
      label: 'Trang chủ',
      href: '/dashboard',
      isActive: pathname === '/dashboard'
    },
    {
      icon: StarIcon,
      label: 'Tạo lịch trình',
      href: '/planner',
      isActive: pathname === '/planner',
      isHighlight: true // Điểm nhấn AI chính
    },
    {
      icon: MapIcon,
      label: 'Bản đồ',
      href: '/map-demo',
      isActive: pathname === '/map-demo'
    },
    {
      icon: MagnifyingGlassIcon,
      label: 'Khám phá',
      href: '/explore',
      isActive: pathname === '/explore'
    },
    {
      icon: DocumentTextIcon,
      label: 'Lịch trình của tôi',
      href: '/itinerary',
      isActive: pathname === '/itinerary'
    },
    {
      icon: CalendarDaysIcon,
      label: 'Booking',
      href: '/booking',
      isActive: pathname === '/booking'
    },
    {
      icon: QrCodeIcon,
      label: 'Scan địa điểm',
      href: '/scan-location',
      isActive: pathname === '/scan-location'
    },
    {
      icon: Cog6ToothIcon,
      label: 'Sở thích',
      href: '/preferences',
      isActive: pathname === '/preferences'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      label: 'Phản hồi',
      href: '/feedback',
      isActive: pathname === '/feedback'
    }
  ]

  const handleItemClick = (href: string) => {
    router.push(href)
  }

  const isExpanded = isHovered || !isCollapsed

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out z-30 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          {isExpanded ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Wanderlust</h1>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigationItems.map((item, index) => {
            const IconComponent = item.icon
            const isActive = item.isActive
            const isHighlight = item.isHighlight

            return (
              <button
                key={index}
                onClick={() => handleItemClick(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${
                  isHighlight ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
                }`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-5 h-5 ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                }`}>
                  <IconComponent />
                </div>

                {/* Label */}
                {isExpanded && (
                  <span className={`text-sm font-medium truncate ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {item.label}
                  </span>
                )}

                {/* AI Badge for "Tạo lịch trình" */}
                {isHighlight && isExpanded && (
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      AI
                    </span>
                  </div>
                )}

                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                    {isHighlight && (
                      <span className="ml-1 text-purple-300">AI</span>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          {isExpanded ? (
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Travel Explorer
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Powered by NPT-Team
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
