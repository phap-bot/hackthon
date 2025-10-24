'use client'
import React from 'react'

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

interface PersonalizedRecommendationsProps {
  recommendations: Recommendation | null
  loading: boolean
  onRefresh: () => void
  preferences?: any
  loadingPreferences?: boolean
}

export default function PersonalizedRecommendations({ 
  recommendations, 
  loading, 
  onRefresh,
  preferences,
  loadingPreferences
}: PersonalizedRecommendationsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-72 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!recommendations || !recommendations.destination_suggestions) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-gray-400">travel_explore</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
          Chưa có gợi ý cá nhân hóa
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Hoàn thành khảo sát sở thích để nhận gợi ý phù hợp với bạn
        </p>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <span className="material-symbols-outlined">refresh</span>
          Làm mới
        </button>
      </div>
    )
  }

  const destinations = recommendations.destination_suggestions || []
  const activities = recommendations.activity_recommendations || []

  return (
    <div className="space-y-8">
      {/* Destination Recommendations */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          🏖️ Điểm đến phù hợp với bạn
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {destinations.slice(0, 4).map((destination, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-white">location_on</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute top-2 right-2 bg-primary/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined !text-sm">star</span>
                <span>{destination.rating}/5</span>
              </div>
              <div className="absolute bottom-0 left-0 p-4">
                <h4 className="text-lg font-bold text-white">{destination.name}</h4>
                <p className="text-white/80 text-sm">{destination.country}</p>
                <p className="text-white/70 text-xs mt-1">
                  {destination.price_range === 'thấp' ? '💰 Tiết kiệm' : 
                   destination.price_range === 'trung_bình' ? '💰 Trung bình' : '💰 Cao cấp'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Recommendations */}
      {activities.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            🎯 Hoạt động dành cho bạn
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.slice(0, 6).map((activity, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                      {activity.type === 'văn_hóa' ? 'museum' :
                       activity.type === 'thiên_nhiên' ? 'nature' :
                       activity.type === 'thể_thao' ? 'sports' :
                       activity.type === 'khám_phá' ? 'explore' : 'star'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800 dark:text-white">{activity.name}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{activity.type}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Information */}
      {recommendations.budget_estimation && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            💰 Ước tính ngân sách
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(recommendations.budget_estimation).map(([level, range]) => (
              <div key={level} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h5 className="font-semibold text-gray-800 dark:text-white capitalize mb-2">
                  {level === 'low' ? 'Tiết kiệm' : level === 'medium' ? 'Trung bình' : 'Cao cấp'}
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {range.min.toLocaleString()} - {range.max.toLocaleString()} {range.currency}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <span className="material-symbols-outlined">refresh</span>
          Làm mới gợi ý
        </button>
      </div>
    </div>
  )
}