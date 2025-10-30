'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import UserMenu from '../components/UserMenu'
import AdvancedFilters, { AdvancedFiltersData } from '../components/Planner/AdvancedFilters'
import DestinationAutocomplete, { SuggestionItem } from '../components/Planner/DestinationAutocomplete'
import NearbySuggestions from '../components/Planner/NearbySuggestions'
import OllamaLocationResearch from '../components/Planner/OllamaLocationResearch'

interface PlannerFormData {
  budget: string
  people: number
  days: number
  destination: string
  destinationLat?: number
  destinationLng?: number
  startDate: string
  travelStyle: string
  interests: string[]
  advancedFilters: AdvancedFiltersData
}

const PlannerPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<PlannerFormData>({
    budget: '',
    people: 1,
    days: 3,
    destination: '',
    startDate: '',
    travelStyle: '',
    interests: [],
    advancedFilters: {
      tripType: [],
      transportation: [],
      travelStyle: [],
      season: [],
      activityLevel: [],
      specialPreferences: []
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  const budgetOptions = [
    { 
      value: 'low', 
      label: 'Tiết kiệm', 
      icon: '💰', 
      description: 'Dưới 5 triệu VNĐ',
      gradient: 'from-yellow-400 to-orange-500'
    },
    { 
      value: 'medium', 
      label: 'Trung bình', 
      icon: '🏨', 
      description: '5-15 triệu VNĐ',
      gradient: 'from-blue-400 to-indigo-500'
    },
    { 
      value: 'high', 
      label: 'Cao cấp', 
      icon: '✨', 
      description: 'Trên 15 triệu VNĐ',
      gradient: 'from-purple-400 to-pink-500'
    }
  ]

  const handleInputChange = (field: keyof PlannerFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAdvancedFiltersChange = (filters: AdvancedFiltersData) => {
    setFormData(prev => ({
      ...prev,
      advancedFilters: filters
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Map form data to AI backend format
      const preferences = {
        budget: formData.budget === 'low' ? 'Tiết kiệm' : formData.budget === 'medium' ? 'Trung bình' : 'Cao cấp',
        days: formData.days,
        region: formData.destination || 'Quy Nhơn',
        theme: formData.advancedFilters.travelStyle.join(', ') || 'phong cách',
        transport: formData.advancedFilters.transportation.join(', ') || 'xe máy',
        people: formData.people,
      }

      // Call internal planner API (proxy to backend)
      const response = await fetch(`/api/travel-planner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budget: formData.budget,
          people: formData.people,
          days: formData.days,
          destination: preferences.region,
          startDate: formData.startDate || new Date().toISOString().slice(0,10),
          travelStyle: formData.advancedFilters.travelStyle[0] || 'tự túc',
          interests: formData.advancedFilters.tripType,
          location: { lat: formData.destinationLat || 13.782, lon: formData.destinationLng || 109.219 }
        }),
      })

      if (response.ok) {
        const result = await response.json()
        // 暂存输入，用于 detail 页面再拉取 tripId 详情
        localStorage.setItem('lastPlannerInput', JSON.stringify({
          budget: formData.budget,
          people: formData.people,
          days: formData.days,
          destination: preferences.region,
          lat: formData.destinationLat,
          lng: formData.destinationLng
        }))
        router.push(`/itinerary/detail/${result.tripId || 'temp'}`)
      } else {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error('Failed to generate itinerary')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra khi tạo lịch trình. Vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout showSidebar={false}>
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-gray-800 dark:text-white">
              <span className="material-symbols-outlined text-primary text-3xl">travel_explore</span>
              </div>
              <h1 className="text-2xl font-bold">Wanderlust</h1>
              
            </div>

            {/* Menu Items */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Trang chủ</a>
              <a href="/planner" className="text-blue-600 font-semibold">Tạo lịch trình</a>
              <a href="/map" className="text-gray-600 hover:text-gray-900 transition-colors">Bản đồ</a>
              <a href="/explore" className="text-gray-600 hover:text-gray-900 transition-colors">Khám phá</a>
              <a href="/itinerary" className="text-gray-600 hover:text-gray-900 transition-colors">Lịch trình</a>
              <a href="/booking" className="text-gray-600 hover:text-gray-900 transition-colors">Booking</a>
            </div>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <PageHeader 
        title="Tạo lịch trình" 
        subtitle="Cá nhân hóa chuyến đi của bạn với trí tuệ nhân tạo"
      />

      {/* Subheader with Context */}
      <div className="bg-blue-50/50 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 font-['Inter']">
              Tạo lịch trình với AI
            </h1>
            <p className="text-gray-500 text-lg">
              Cá nhân hóa chuyến đi của bạn với trí tuệ nhân tạo
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Budget Section */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">$</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Ngân sách</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {budgetOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative cursor-pointer group transition-all duration-300 ${
                    formData.budget === option.value
                      ? 'ring-2 ring-blue-500 ring-offset-2'
                      : 'hover:ring-1 hover:ring-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="budget"
                    value={option.value}
                    checked={formData.budget === option.value}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    formData.budget === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${option.gradient} rounded-xl flex items-center justify-center text-white text-xl`}>
                        {option.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{option.label}</h3>
                        <p className="text-gray-600 text-sm">{option.description}</p>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin cơ bản</h2>
            
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Destination autocomplete */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">📍</span>
              </div>
              Điểm đến (tỉnh/thành phố)
            </label>
            <DestinationAutocomplete
              value={formData.destination}
              onSelect={(item: SuggestionItem) => {
                handleInputChange('destination', item.name)
                handleInputChange('destinationLat', item.lat)
                handleInputChange('destinationLng', item.lng)
              }}
            />
          </div>

              {/* Number of People */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">👥</span>
                  </div>
                  Số người
                </label>
                <select
                  value={formData.people}
                  onChange={(e) => handleInputChange('people', parseInt(e.target.value))}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} người</option>
                  ))}
                </select>
              </div>

              {/* Number of Days */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">📅</span>
                  </div>
                  Số ngày
                </label>
                <select
                  value={formData.days}
                  onChange={(e) => handleInputChange('days', parseInt(e.target.value))}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 10, 14, 21].map(days => (
                    <option key={days} value={days}>{days} ngày</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Advanced Filters Section */}
          <AdvancedFilters onFiltersChange={handleAdvancedFiltersChange} />

      {/* AI research based on user's searched destination (no GPS) */}
      {formData.destination && (
        <OllamaLocationResearch locationName={formData.destination} />
      )}

      {/* Map-based nearby (optional) still available if lat/lng chosen) */}
      {formData.destinationLat && formData.destinationLng && (
        <NearbySuggestions
          lat={formData.destinationLat}
          lng={formData.destinationLng}
          categories={formData.advancedFilters.tripType.includes('Ẩm thực') ? 'catering.restaurant' : 'tourist_attraction'}
          onSelect={(p) => {
            alert(`Đã chọn địa điểm: ${p.name}`)
          }}
        />
      )}

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={isLoading || !formData.budget}
              className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Đang tạo lịch trình...
                </>
              ) : (
                <>
                  <span className="text-xl">✨</span>
                  Tạo lịch trình ngay
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default PlannerPage
