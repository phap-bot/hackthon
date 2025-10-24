'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  StarIcon, 
  HeartIcon, 
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface FeedbackData {
  tripId: string
  destination: string
  totalDays: number
  startDate: string
  endDate: string
}

interface FeedbackForm {
  overallRating: number
  valueForMoney: number
  itineraryQuality: number
  accommodationRating: number
  foodRating: number
  transportationRating: number
  attractionsRating: number
  wouldRecommend: boolean
  favoriteActivity: string
  leastFavoriteActivity: string
  suggestions: string
  additionalComments: string
}

const FeedbackPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tripId = searchParams.get('tripId')
  
  const [tripData, setTripData] = useState<FeedbackData | null>(null)
  const [feedback, setFeedback] = useState<FeedbackForm>({
    overallRating: 0,
    valueForMoney: 0,
    itineraryQuality: 0,
    accommodationRating: 0,
    foodRating: 0,
    transportationRating: 0,
    attractionsRating: 0,
    wouldRecommend: false,
    favoriteActivity: '',
    leastFavoriteActivity: '',
    suggestions: '',
    additionalComments: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (tripId) {
      fetchTripData(tripId)
    }
  }, [tripId])

  const fetchTripData = async (id: string) => {
    try {
      const response = await fetch(`/api/trip/${id}`)
      if (response.ok) {
        const data = await response.json()
        setTripData(data)
      } else {
        // Mock data for demo
        setTripData({
          tripId: id,
          destination: 'Tokyo, Nhật Bản',
          totalDays: 5,
          startDate: '2024-03-15',
          endDate: '2024-03-19'
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleRatingChange = (field: keyof FeedbackForm, rating: number) => {
    setFeedback(prev => ({
      ...prev,
      [field]: rating
    }))
  }

  const handleInputChange = (field: keyof FeedbackForm, value: string | boolean) => {
    setFeedback(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId,
          feedback
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        throw new Error('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const RatingStars = ({ 
    rating, 
    onRatingChange, 
    label 
  }: { 
    rating: number
    onRatingChange: (rating: number) => void
    label: string 
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`w-8 h-8 transition-colors ${
              star <= rating
                ? 'text-warm'
                : 'text-gray-300 hover:text-warm/50'
            }`}
          >
            <StarIcon className="w-full h-full fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm text-neutral">
          {rating > 0 ? `${rating}/5` : 'Chưa đánh giá'}
        </span>
      </div>
    </div>
  )

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <CheckCircleIcon className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Cảm ơn bạn!</h2>
          <p className="text-neutral mb-4">
            Đánh giá của bạn đã được gửi thành công. Chúng tôi sẽ sử dụng phản hồi này để cải thiện dịch vụ.
          </p>
          <p className="text-sm text-neutral">
            Sẽ chuyển về trang chủ trong 3 giây...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-neutral" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-primary">Đánh giá chuyến đi</h1>
              <p className="text-neutral">
                {tripData ? `${tripData.destination} • ${tripData.totalDays} ngày` : 'Đang tải...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Overall Rating */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-dark mb-6">Đánh giá tổng thể</h2>
            <div className="text-center">
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange('overallRating', star)}
                    className={`w-12 h-12 transition-colors ${
                      star <= feedback.overallRating
                        ? 'text-warm'
                        : 'text-gray-300 hover:text-warm/50'
                    }`}
                  >
                    <StarIcon className="w-full h-full fill-current" />
                  </button>
                ))}
              </div>
              <p className="text-lg font-medium text-dark">
                {feedback.overallRating > 0 
                  ? `${feedback.overallRating}/5 - ${getRatingText(feedback.overallRating)}`
                  : 'Chọn số sao để đánh giá'
                }
              </p>
            </div>
          </div>

          {/* Detailed Ratings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-dark mb-6">Đánh giá chi tiết</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RatingStars
                rating={feedback.valueForMoney}
                onRatingChange={(rating) => handleRatingChange('valueForMoney', rating)}
                label="Giá trị đồng tiền"
              />
              <RatingStars
                rating={feedback.itineraryQuality}
                onRatingChange={(rating) => handleRatingChange('itineraryQuality', rating)}
                label="Chất lượng lịch trình"
              />
              <RatingStars
                rating={feedback.accommodationRating}
                onRatingChange={(rating) => handleRatingChange('accommodationRating', rating)}
                label="Chỗ ở"
              />
              <RatingStars
                rating={feedback.foodRating}
                onRatingChange={(rating) => handleRatingChange('foodRating', rating)}
                label="Ẩm thực"
              />
              <RatingStars
                rating={feedback.transportationRating}
                onRatingChange={(rating) => handleRatingChange('transportationRating', rating)}
                label="Phương tiện di chuyển"
              />
              <RatingStars
                rating={feedback.attractionsRating}
                onRatingChange={(rating) => handleRatingChange('attractionsRating', rating)}
                label="Điểm tham quan"
              />
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-dark mb-4">Bạn có giới thiệu chuyến đi này không?</h2>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="recommend"
                  checked={feedback.wouldRecommend === true}
                  onChange={() => handleInputChange('wouldRecommend', true)}
                  className="text-primary"
                />
                <HandThumbUpIcon className="w-5 h-5 text-primary" />
                <span>Có, tôi sẽ giới thiệu</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="recommend"
                  checked={feedback.wouldRecommend === false}
                  onChange={() => handleInputChange('wouldRecommend', false)}
                  className="text-primary"
                />
                <HandThumbUpIcon className="w-5 h-5 text-gray-400 rotate-180" />
                <span>Không, tôi không giới thiệu</span>
              </label>
            </div>
          </div>

          {/* Activities Feedback */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-dark mb-6">Hoạt động yêu thích</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Hoạt động bạn thích nhất
                </label>
                <input
                  type="text"
                  value={feedback.favoriteActivity}
                  onChange={(e) => handleInputChange('favoriteActivity', e.target.value)}
                  placeholder="Ví dụ: Tham quan Senso-ji Temple..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Hoạt động bạn ít thích nhất
                </label>
                <input
                  type="text"
                  value={feedback.leastFavoriteActivity}
                  onChange={(e) => handleInputChange('leastFavoriteActivity', e.target.value)}
                  placeholder="Ví dụ: Chờ đợi quá lâu tại nhà hàng..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-dark mb-4">Góp ý cải thiện</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Bạn có gợi ý gì để cải thiện dịch vụ?
                </label>
                <textarea
                  value={feedback.suggestions}
                  onChange={(e) => handleInputChange('suggestions', e.target.value)}
                  placeholder="Chia sẻ ý kiến của bạn để chúng tôi có thể cải thiện dịch vụ..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Bình luận thêm
                </label>
                <textarea
                  value={feedback.additionalComments}
                  onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                  placeholder="Bất kỳ điều gì khác bạn muốn chia sẻ..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting || feedback.overallRating === 0}
              className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-ocean transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang gửi đánh giá...
                </>
              ) : (
                <>
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                  Gửi đánh giá
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const getRatingText = (rating: number): string => {
  switch (rating) {
    case 1: return 'Rất tệ'
    case 2: return 'Tệ'
    case 3: return 'Bình thường'
    case 4: return 'Tốt'
    case 5: return 'Tuyệt vời'
    default: return ''
  }
}

export default FeedbackPage
