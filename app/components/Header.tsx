'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const router = useRouter()
  const { isLoggedIn, user, logout } = useAuth()
  const [avatarKey, setAvatarKey] = useState(0)

  // Force re-render khi user data thay đổi
  useEffect(() => {
    if (user?.avatar_url) {
      setAvatarKey(prev => prev + 1)
    }
  }, [user?.avatar_url])

  const handleLogin = () => {
    router.push('/login')
  }

  const handleRegister = () => {
    router.push('/register')
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🌍</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">TravelPlaner</h1>
          </div>

          {/* Navigation */}
          {isLoggedIn ? (
            // Logged in state
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600">🔔</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.avatar_url ? (
                    <img 
                      key={`header-avatar-${avatarKey}-${user.avatar_url}`}
                      src={`${user.avatar_url}?t=${Date.now()}`}
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Header avatar load error, falling back to initials');
                        // Fallback sẽ được xử lý bởi parent div
                      }}
                    />
                  ) : (
                    <span className="text-white font-medium text-xs">
                      {(user?.full_name || user?.username || 'A').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{user?.full_name || user?.username || 'User'}</p>
                  <p className="text-xs text-gray-500">Nhà thám hiểm</p>
                </div>
                <div className="relative group">
                  <span className="text-gray-400 cursor-pointer">▼</span>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => router.push('/preferences')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Sở thích
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Logged out state
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogin}
                className="text-gray-600 font-medium hover:text-blue-600 transition-colors duration-200"
              >
                Đăng nhập
              </button>
              <button
                onClick={handleRegister}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
