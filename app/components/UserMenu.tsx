'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import LogoutModal from './LogoutModal'

export default function UserMenu() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [avatarKey, setAvatarKey] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  // Force re-render khi user data thay đổi
  useEffect(() => {
    if (user?.avatar_url) {
      setAvatarKey(prev => prev + 1)
    }
  }, [user?.avatar_url])

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Menu closes on click outside
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    setShowLogoutModal(true)
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
  }

  // Get display name
  const getDisplayName = () => {
    return user?.full_name || user?.username || 'User'
  }

  return (
    <div className="relative group" ref={menuRef}>
        {/* User Avatar & Info */}
        <button
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
      >
        <img 
          key={`avatar-${avatarKey}-${user?.avatar_url}`}
          alt="User Avatar" 
          className="h-10 w-10 rounded-full object-cover"
          src={user?.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(getDisplayName())}
                onError={(e) => {
                  console.log('UserMenu avatar load error, falling back to initials');
          }}
        />
        <div className="hidden sm:block">
          <p className="font-semibold text-gray-800 dark:text-white">{getDisplayName()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Nhà thám hiểm</p>
        </div>
        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 group-hover:rotate-180 transition-transform duration-300">expand_more</span>
      </button>

      {/* User Menu Dropdown */}
      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-20">
          <div className="py-2">
          <a
              onClick={handleProfile}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <span className="material-symbols-outlined mr-3 !text-xl">person</span>
            Xem Profile
          </a>
          <a
            onClick={() => router.push('/dashboard')}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <span className="material-symbols-outlined mr-3 !text-xl">route</span>
            Kiểm tra Lịch trình
          </a>
          <a
            onClick={() => router.push('/preferences')}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <span className="material-symbols-outlined mr-3 !text-xl">confirmation_number</span>
            Kiểm tra Lịch Booking
          </a>
          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
          <a
              onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
          >
            <span className="material-symbols-outlined mr-3 !text-xl">logout</span>
            Đăng xuất
          </a>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
      />
    </div>
  )
}
