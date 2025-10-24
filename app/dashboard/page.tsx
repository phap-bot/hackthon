'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import Layout from '../components/Layout'
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

  return (
    <Layout>
      {/* Header */}
      <header className="relative z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between lg:justify-end h-20">
            <button className="lg:hidden p-2 text-gray-600 dark:text-gray-300">
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
            <UserMenu />
          </div>
        </div>
      </header>

        {/* Main Content */}
        <main className="flex-grow">
          {/* Welcome Section */}
          <div className="bg-gray-50 dark:bg-gray-900/50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Chào mừng trở lại, {user?.full_name || user?.username || 'An'}!</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Bảng điều khiển cá nhân của bạn đã sẵn sàng. Hãy khám phá ngay!</p>
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
  )
}
