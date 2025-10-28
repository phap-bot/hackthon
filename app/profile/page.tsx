'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import Layout from '../components/Layout'
import AvatarUploadModal from '../components/AvatarUpload/AvatarUploadModal'
import { 
  UserIcon,
  EnvelopeIcon,
  CameraIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    bio: '',
    phone: '',
    date_of_birth: '',
    location: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      console.log('User data loaded:', user)
      setFormData({
        full_name: user.full_name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        location: user.location || ''
      })
      // 设置头像URL với cache busting
      if (user.avatar_url) {
        const avatarWithCacheBust = `${user.avatar_url}?t=${Date.now()}`
        setAvatarUrl(avatarWithCacheBust)
        console.log('Avatar URL set from user data:', avatarWithCacheBust)
      }
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token')
      if (!token) {
        alert('Vui lòng đăng nhập lại')
        return
      }
      
      console.log('Profile update - Token found:', !!token)

      // Chuẩn bị dữ liệu để gửi
      const updateData = {
        full_name: formData.full_name,
        username: formData.username,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        location: formData.location,
        bio: formData.bio
      }

      // Gọi API cập nhật profile
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Profile update error:', errorData)
        
        if (response.status === 401) {
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
          // Redirect to login
          window.location.href = '/login'
          return
        }
        
        throw new Error(errorData.error || 'Có lỗi xảy ra khi cập nhật thông tin')
      }

      const result = await response.json()
      
      // Cập nhật state với dữ liệu mới từ server
      if (result.user) {
        setFormData(prev => ({
          ...prev,
          full_name: result.user.full_name || '',
          username: result.user.username || '',
          email: result.user.email || '',
          phone: result.user.phone || '',
          date_of_birth: result.user.date_of_birth || '',
          location: result.user.location || '',
          bio: result.user.bio || ''
        }))
        
        // Cập nhật avatar nếu có với cache busting
        if (result.user.avatar_url) {
          const newAvatarUrl = `${result.user.avatar_url}?t=${Date.now()}`
          setAvatarUrl(newAvatarUrl)
          console.log('Avatar updated from profile save:', newAvatarUrl)
        }
      }
      
      setIsEditing(false)
      alert(result.message || 'Cập nhật thông tin thành công!')
      
    } catch (error) {
      console.error('Error saving profile:', error)
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu thông tin')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        location: user.location || ''
      })
    }
    setIsEditing(false)
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      console.log('Starting avatar upload...', file.name)
      
      // 创建FormData对象
      const formData = new FormData()
      formData.append('avatar', file)

      // 调用API上传头像
      const token = localStorage.getItem('token') || localStorage.getItem('access_token')
      const response = await fetch('/api/auth/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      console.log('Avatar upload response:', result)
      
      // 更新本地头像URL với cache busting
      const newAvatarUrl = result.avatar_url ? `${result.avatar_url}?t=${Date.now()}` : null
      setAvatarUrl(newAvatarUrl)
      
      // Cập nhật user state nếu có
      if (user) {
        // Trigger re-render bằng cách cập nhật một state khác
        setFormData(prev => ({ ...prev }))
      }
      
      console.log('Avatar URL updated:', newAvatarUrl)
      
      // 显示成功消息
      alert('Cập nhật ảnh đại diện thành công!')
      
    } catch (error) {
      console.error('Avatar upload error:', error)
      alert(`Có lỗi xảy ra khi tải lên ảnh đại diện: ${error instanceof Error ? error.message : 'Unknown error'}`)
      throw error
    }
  }

  const getUserInitials = () => {
    if (formData.full_name) {
      return formData.full_name
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (formData.username) {
      return formData.username.charAt(0).toUpperCase()
    }
    return 'U'
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hồ sơ cá nhân</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Quản lý thông tin tài khoản của bạn</p>
              </div>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Quay lại
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="text-center">
                    {/* Avatar */}
                    <div className="relative inline-block">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 overflow-hidden">
                        {avatarUrl ? (
                          <img 
                            key={avatarUrl} // Force re-render khi avatarUrl thay đổi
                            src={avatarUrl} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log('Avatar load error, falling back to initials');
                              setAvatarUrl(null);
                            }}
                            onLoad={() => {
                              console.log('Avatar loaded successfully:', avatarUrl);
                            }}
                          />
                        ) : (
                          getUserInitials()
                        )}
                      </div>
                      <button 
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="absolute bottom-2 right-2 w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <CameraIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>

                    {/* User Info */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {formData.full_name || formData.username || 'User'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {formData.email}
                    </p>

                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Plus Member</span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Chuyến đi</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Điểm đến</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông tin cá nhân</h3>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <span className="material-symbols-outlined">edit</span>
                        Chỉnh sửa
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          <CheckIcon className="w-4 h-4" />
                          {isSaving ? 'Đang lưu...' : 'Lưu'}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                          Hủy
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                        placeholder="Nhập họ và tên"
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tên người dùng
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                        placeholder="Nhập tên người dùng"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                        placeholder="Nhập email"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Địa điểm
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                        placeholder="Nhập địa điểm hiện tại"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Giới thiệu bản thân
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                        placeholder="Viết vài dòng về bản thân..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onUpload={handleAvatarUpload}
        currentAvatar={avatarUrl || undefined}
      />
    </Layout>
  )
}
