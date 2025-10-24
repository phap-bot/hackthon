'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import LogoutModal from './LogoutModal'
import { 
  UserIcon,
  BellIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function UserMenu() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    setShowLogoutModal(true)
    setIsOpen(false)
  }

  const confirmLogout = () => {
    logout()
    router.push('/')
    setShowLogoutModal(false)
  }

  const cancelLogout = () => {
    setShowLogoutModal(false)
  }

  const handleProfile = () => {
    router.push('/profile')
    setIsOpen(false)
  }

  const handleSettings = () => {
    router.push('/settings')
    setIsOpen(false)
  }

  const handleUpgrade = () => {
    router.push('/upgrade')
    setIsOpen(false)
  }

  const handleHelp = () => {
    router.push('/help')
    setIsOpen(false)
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.full_name) {
      return user.full_name
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase()
    }
    return 'U'
  }

  // Get display name
  const getDisplayName = () => {
    return user?.full_name || user?.username || 'User'
  }

  // Get user email
  const getUserEmail = () => {
    return user?.email || 'user@example.com'
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* User Info & Menu Trigger */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          onClick={toggleNotifications}
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
        </button>

        {/* User Avatar & Info */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {getUserInitials()}
          </div>
          <div className="hidden md:block text-left">
            <p className="font-semibold text-gray-800 dark:text-white text-sm">
              {getDisplayName()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Nhà thám hiểm
            </p>
          </div>
          <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Thông báo</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Gợi ý mới dành cho bạn
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Chúng tôi đã tìm thấy 3 điểm đến phù hợp với sở thích của bạn
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    2 phút trước
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CreditCardIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Ưu đãi đặc biệt
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Giảm 20% cho gói Premium trong tháng này
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    1 giờ trước
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Chào mừng bạn đến với Wanderlust!
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Hoàn thành hồ sơ để nhận gợi ý tốt hơn
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    1 ngày trước
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}

      {/* User Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {getUserInitials()}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {getDisplayName()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getUserEmail()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    Plus
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handleUpgrade}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Nâng cấp gói</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Mở khóa tính năng cao cấp</p>
              </div>
            </button>

            <button
              onClick={handleProfile}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Cá nhân hóa</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Chỉnh sửa hồ sơ cá nhân</p>
              </div>
            </button>

            <button
              onClick={handleSettings}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Cog6ToothIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Cài đặt</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Quản lý tài khoản</p>
              </div>
            </button>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          {/* Bottom Menu Items */}
          <div className="py-2">
            <button
              onClick={handleHelp}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <QuestionMarkCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Trợ giúp</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Hỗ trợ và FAQ</p>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <ArrowRightOnRectangleIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-medium text-red-600 dark:text-red-400">Đăng xuất</p>
                <p className="text-xs text-red-500 dark:text-red-500">Thoát khỏi tài khoản</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
      />
    </div>
  )
}
