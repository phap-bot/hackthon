'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface DayPlan {
  day: number
  date: string
  activities: Activity[]
  estimatedCost: number
}

interface Activity {
  id: string
  name: string
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport'
  time: string
  duration: string
  cost: number
  description: string
  location: string
  rating: number
  image?: string
}

interface ItineraryData {
  tripId: string
  destination: string
  totalDays: number
  totalCost: number
  startDate: string
  endDate: string
  days: DayPlan[]
  summary: {
    totalAttractions: number
    totalRestaurants: number
    totalHotels: number
    averageRating: number
  }
}

const ItineraryResultPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tripId = searchParams.get('tripId')
  
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeDay, setActiveDay] = useState(0)
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (tripId) {
      fetchItinerary(tripId)
    }
  }, [tripId])

  const fetchItinerary = async (id: string) => {
    try {
      const response = await fetch(`/api/itinerary/${id}`)
      if (response.ok) {
        const data = await response.json()
        setItinerary(data)
      } else {
        throw new Error('Failed to fetch itinerary')
      }
    } catch (error) {
      console.error('Error:', error)
      // Mock data for demo
      setItinerary(getMockItinerary())
    } finally {
      setIsLoading(false)
    }
  }

  const getMockItinerary = (): ItineraryData => ({
    tripId: tripId || 'demo-123',
    destination: 'Tokyo, Nhật Bản',
    totalDays: 5,
    totalCost: 12500000,
    startDate: '2024-03-15',
    endDate: '2024-03-19',
    days: [
      {
        day: 1,
        date: '2024-03-15',
        estimatedCost: 2500000,
        activities: [
          {
            id: '1',
            name: 'Sân bay Narita → Khách sạn',
            type: 'transport',
            time: '08:00',
            duration: '2h',
            cost: 500000,
            description: 'Đón taxi từ sân bay đến khách sạn ở Shibuya',
            location: 'Narita → Shibuya',
            rating: 4.5
          },
          {
            id: '2',
            name: 'Khách sạn Shibuya Sky',
            type: 'hotel',
            time: '10:00',
            duration: 'Check-in',
            cost: 800000,
            description: 'Khách sạn 4 sao với view đẹp ra thành phố',
            location: 'Shibuya, Tokyo',
            rating: 4.8
          },
          {
            id: '3',
            name: 'Tham quan Shibuya Crossing',
            type: 'attraction',
            time: '14:00',
            duration: '2h',
            cost: 0,
            description: 'Ngã tư đông đúc nhất thế giới',
            location: 'Shibuya, Tokyo',
            rating: 4.7
          },
          {
            id: '4',
            name: 'Ăn tối tại Ramen Nagi',
            type: 'restaurant',
            time: '18:00',
            duration: '1h',
            cost: 200000,
            description: 'Ramen ngon nhất Tokyo',
            location: 'Shibuya, Tokyo',
            rating: 4.9
          }
        ]
      },
      {
        day: 2,
        date: '2024-03-16',
        estimatedCost: 2800000,
        activities: [
          {
            id: '5',
            name: 'Tham quan Senso-ji Temple',
            type: 'attraction',
            time: '09:00',
            duration: '3h',
            cost: 0,
            description: 'Ngôi chùa cổ nhất Tokyo',
            location: 'Asakusa, Tokyo',
            rating: 4.6
          },
          {
            id: '6',
            name: 'Ăn trưa tại Tsukiji Market',
            type: 'restaurant',
            time: '12:00',
            duration: '2h',
            cost: 300000,
            description: 'Chợ cá tươi sống nổi tiếng',
            location: 'Tsukiji, Tokyo',
            rating: 4.8
          },
          {
            id: '7',
            name: 'Tham quan Tokyo Skytree',
            type: 'attraction',
            time: '15:00',
            duration: '3h',
            cost: 400000,
            description: 'Tháp truyền hình cao nhất Nhật Bản',
            location: 'Sumida, Tokyo',
            rating: 4.5
          }
        ]
      }
    ],
    summary: {
      totalAttractions: 8,
      totalRestaurants: 6,
      totalHotels: 1,
      averageRating: 4.7
    }
  })

  const toggleLike = (activityId: string) => {
    setLikedActivities(prev => {
      const newSet = new Set(prev)
      if (newSet.has(activityId)) {
        newSet.delete(activityId)
      } else {
        newSet.add(activityId)
      }
      return newSet
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attraction': return '🏛️'
      case 'restaurant': return '🍜'
      case 'hotel': return '🏨'
      case 'transport': return '🚗'
      default: return '📍'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-neutral">Đang tạo lịch trình du lịch...</p>
        </div>
      </div>
    )
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-neutral">Không tìm thấy lịch trình</p>
          <button
            onClick={() => router.push('/planner')}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg"
          >
            Tạo lịch trình mới
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-neutral" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-primary">Lịch trình du lịch</h1>
                <p className="text-neutral">{itinerary.destination} • {itinerary.totalDays} ngày</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                <ShareIcon className="w-4 h-4" />
                Chia sẻ
              </button>
              <button
                onClick={() => router.push(`/feedback?tripId=${itinerary.tripId}`)}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
              >
                <StarIcon className="w-4 h-4" />
                Đánh giá
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Trip Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-dark mb-4">Tóm tắt chuyến đi</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">{itinerary.destination}</div>
                    <div className="text-sm text-neutral">{itinerary.startDate} - {itinerary.endDate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CurrencyDollarIcon className="w-5 h-5 text-accent" />
                  <div>
                    <div className="font-medium">{formatCurrency(itinerary.totalCost)}</div>
                    <div className="text-sm text-neutral">Tổng chi phí</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StarIcon className="w-5 h-5 text-warm" />
                  <div>
                    <div className="font-medium">{itinerary.summary.averageRating}/5</div>
                    <div className="text-sm text-neutral">Đánh giá trung bình</div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-primary">{itinerary.summary.totalAttractions}</div>
                      <div className="text-neutral">Điểm tham quan</div>
                    </div>
                    <div>
                      <div className="font-medium text-primary">{itinerary.summary.totalRestaurants}</div>
                      <div className="text-neutral">Nhà hàng</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Daily Itinerary */}
          <div className="lg:col-span-3">
            {/* Day Navigation */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex gap-2 overflow-x-auto">
                {itinerary.days.map((day, index) => (
                  <button
                    key={day.day}
                    onClick={() => setActiveDay(index)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors ${
                      activeDay === index
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-neutral hover:bg-gray-200'
                    }`}
                  >
                    Ngày {day.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Day Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-dark">
                    Ngày {itinerary.days[activeDay].day}
                  </h2>
                  <p className="text-neutral">{itinerary.days[activeDay].date}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-accent">
                    {formatCurrency(itinerary.days[activeDay].estimatedCost)}
                  </div>
                  <div className="text-sm text-neutral">Chi phí ước tính</div>
                </div>
              </div>

              <div className="space-y-4">
                {itinerary.days[activeDay].activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-dark">{activity.name}</h3>
                          <p className="text-sm text-neutral mt-1">{activity.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-neutral">
                            <span className="flex items-center gap-1">
                              <ClockIcon className="w-4 h-4" />
                              {activity.time} ({activity.duration})
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4" />
                              {activity.location}
                            </span>
                            {activity.cost > 0 && (
                              <span className="flex items-center gap-1">
                                <CurrencyDollarIcon className="w-4 h-4" />
                                {formatCurrency(activity.cost)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-4 h-4 text-warm" />
                            <span className="text-sm font-medium">{activity.rating}</span>
                          </div>
                          <button
                            onClick={() => toggleLike(activity.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              likedActivities.has(activity.id)
                                ? 'text-red-500 bg-red-50'
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                            }`}
                          >
                            <HeartIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItineraryResultPage
