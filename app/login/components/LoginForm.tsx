'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import { loginUser } from '../../lib/auth'
import toast from 'react-hot-toast'

export default function LoginForm() {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Địa chỉ email không hợp lệ'
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      const response = await loginUser(formData.email, formData.password)
      
      if (response.access_token) {
        // Store tokens in localStorage
        localStorage.setItem('access_token', response.access_token)
        if ('refresh_token' in response && response.refresh_token && typeof response.refresh_token === 'string') {
          localStorage.setItem('refresh_token', response.refresh_token)
        }
        
        // Kiểm tra xem người dùng đã hoàn thành khảo sát chưa
        try {
          console.log('Login: Checking user preferences...')
          const prefResponse = await fetch('/api/preferences', {
            headers: {
              'Authorization': `Bearer ${response.access_token}`
            }
          })
          
          console.log('Login: Preferences response status:', prefResponse.status)
          
          // Nếu không có preferences (404) hoặc lỗi, chuyển đến trang khảo sát
          if (!prefResponse.ok || prefResponse.status === 404) {
            console.log('Login: Người dùng chưa hoàn thành khảo sát, chuyển đến trang khảo sát')
            window.location.href = '/preferences'
          } else {
            console.log('Login: Người dùng đã hoàn thành khảo sát, chuyển đến dashboard')
            window.location.href = '/dashboard'
          }
        } catch (prefError) {
          console.error('Login: Lỗi khi kiểm tra preferences:', prefError)
          // Nếu kiểm tra thất bại, mặc định chuyển đến trang khảo sát
          console.log('Login: Chuyển đến trang khảo sát do lỗi kiểm tra')
          window.location.href = '/preferences'
        }
      } else {
        setErrors({ general: 'Đăng nhập thất bại' })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: error instanceof Error ? error.message : 'Có lỗi xảy ra khi đăng nhập' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Logo */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary text-xl">travel_explore</span>
          <h1 className="text-lg font-bold text-gray-900">Travel Co.</h1>
        </div>
      </div>

      {/* Title and Description */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Đăng nhập</h2>
        <p className="text-gray-600 text-sm">
          Chào mừng bạn trở lại! Đăng nhập để tiếp tục khám phá thế giới.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Nhập địa chỉ email"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <span className="material-symbols-outlined text-gray-400 text-lg">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        {/* Forgot Password */}
        <div className="flex items-center justify-end">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        
        {/* General Error Message */}
        {errors.general && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}
      </form>

      {/* Divider */}
      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
          </div>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
        <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
      </div>

      {/* Register Link */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
