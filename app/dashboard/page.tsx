'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import Layout from '../components/Layout'
import SurveyCheckRoute from '../components/SurveyCheckRoute'
import UserMenu from '../components/UserMenu'
import QuickActions from '../components/Dashboard/QuickActions'
import MyTrips from '../components/Dashboard/MyTrips'
import PersonalizedRecommendations from '../components/Dashboard/PersonalizedRecommendations'
import DiscoverPosts from '../components/Dashboard/DiscoverPosts'
import AIPlannerHighlight from '../components/Dashboard/AIPlannerHighlight'

interface Recommendation {
  destination_suggestions: Array<{
    name: string
    country: string
    rating: number
    price_range: string
  }>
  activity_recommendations: Array<{
    name: string
    type: string
    duration: string
  }>
  budget_estimation: {
    low: { min: number; max: number; currency: string }
    medium: { min: number; max: number; currency: string }
    high: { min: number; max: number; currency: string }
  }
  itinerary_suggestions: Array<{
    day: number
    title: string
    activities: string[]
    estimated_cost: number
  }>
  accommodation_suggestions: Array<{
    type: string
    price_range: string
    amenities: string[]
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const { isLoggedIn, user, isLoading } = useAuth()
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null)
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const [preferences, setPreferences] = useState<any>(null)
  const [loadingPreferences, setLoadingPreferences] = useState(false)

  // Remove duplicate auth check since Layout component handles it

  const fetchRecommendations = async () => {
    setLoadingRecommendations(true)
    try {
      const token = localStorage.getItem('access_token')
      console.log('🔍 Fetching recommendations...')
      console.log('Token exists:', !!token)
      
      if (!token) {
        console.log('❌ No token found')
        alert('Vui lòng đăng nhập lại')
        router.push('/login')
        return
      }

      console.log('📡 Calling API...')
      const response = await fetch('/api/survey/recommendations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('📊 Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Recommendations data:', data)
        setRecommendations(data.recommendations)
      } else {
        const errorText = await response.text()
        console.log('❌ API error:', errorText)
        console.log('No recommendations available yet')
      }
    } catch (error) {
      console.error('❌ Error fetching recommendations:', error)
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const fetchPreferences = async () => {
    setLoadingPreferences(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        alert('Vui lòng đăng nhập lại')
        router.push('/login')
        return
      }

      const response = await fetch('/api/preferences', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPreferences(data.preferences)
        console.log('Preferences loaded:', data.preferences)
      } else {
        console.log('No preferences available yet')
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
    } finally {
      setLoadingPreferences(false)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecommendations()
      fetchPreferences()
    }
  }, [isLoggedIn])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  // Auth check is handled by Layout component
  // SurveyCheckRoute must be outside Layout to check before rendering

  return (
    <SurveyCheckRoute>
      <Layout>
        {/* Header */}
        <header className="relative z-10 bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 text-gray-800 dark:text-white">
              <span className="material-symbols-outlined text-primary text-3xl">travel_explore</span>
              <h1 className="text-2xl font-bold">Wanderlust</h1>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2 border-r border-gray-200 dark:border-gray-700 pr-2">
                <a className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-gray-600 dark:text-gray-300 font-medium" href="#">
                  <span className="material-symbols-outlined">add_circle</span>
                  <span>Tạo lịch trình</span>
                </a>
                <a className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-gray-600 dark:text-gray-300 font-medium" href="#">
                  <span className="material-symbols-outlined">explore</span>
                  <span>Khám phá</span>
                </a>
                <a className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-gray-600 dark:text-gray-300 font-medium" href="#">
                  <span className="material-symbols-outlined">map</span>
                  <span>Bản đồ</span>
                </a>
              </div>

              {/* Search & Notifications */}
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <span className="material-symbols-outlined">search</span>
              </button>
              <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
              </button>

              {/* User Menu */}
              <UserMenu />
            </div>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="flex-grow">
          {/* Welcome Section with Background */}
          <div className="relative bg-gray-50 dark:bg-gray-900/50 py-16 overflow-hidden">
            <img 
              alt="Vịnh Hạ Long" 
              className="absolute inset-0 w-full h-full object-cover object-center opacity-20 dark:opacity-10" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIsiIZwyIGammpDtlwvti5ki1CZY83-NeURJ50c77xoZQQ3pw_E106fjhhhES8hqeeC2AK17Lq7vp5_h2ohq4eIxsgtMrmWLNku7d0Auvwdq8LqPE7oQIbDGflxMXJHnBnNbMQ5ulOKTVY7-GmmhNOS9iQwW3FsvQvrxHzLWOl1ex2Yzb8A7VkguPmYwvXEnRpi1zp2dazKJeSaTZWGjC34zUfZW9oIeZVesomUDP4ebvfriQPoQCAnJoZuce1sCL-MGypFft3wxI" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Chào mừng trở lại, {user?.full_name || user?.username || 'An'}!</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Khám phá vẻ đẹp Việt Nam ngay từ đây. Bảng điều khiển của bạn đã sẵn sàng!</p>
            </div>
          </div>

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* AI Planner Highlight Section */}
      <section className="mb-12">
        <AIPlannerHighlight />
      </section>

          {/* Quick Actions Section */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Truy cập nhanh</h3>
            <QuickActions />
          </section>

            {/* My Trips Section */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Chuyến đi của bạn</h3>
              <MyTrips />
            </section>

            {/* Personalized Recommendations Section */}
            <section className="mb-16">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Đề xuất dành riêng cho bạn</h3>
              <PersonalizedRecommendations 
                recommendations={recommendations}
                loading={loadingRecommendations}
                onRefresh={fetchRecommendations}
                preferences={preferences}
                loadingPreferences={loadingPreferences}
              />
            </section>

      {/* Discover Posts Section */}
      <section>
        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Khám phá Việt Nam qua những bài viết</h3>
        <DiscoverPosts />
      </section>
    </div>
    </main>

    {/* Floating Support Button */}
    <button className="fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-transform hover:scale-110">
      <span className="material-symbols-outlined text-3xl">support_agent</span>
    </button>
      </Layout>
    </SurveyCheckRoute>
  )
}
