'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import SummaryBar from '../components/SummaryBar'

interface Preferences {
  travelTypes: string[]
  dreamDestinations: string[]
  activities: string[]
  budgetLevel: string
  tripDuration: string
  groupSize: string
  accommodation: string
  transportation: string
}

const travelTypes = [
  { id: 'relaxation', label: 'Nghỉ dưỡng', icon: '🏖️', description: 'Thư giãn, tận hưởng' },
  { id: 'exploration', label: 'Khám phá', icon: '🧭', description: 'Điểm đến mới lạ' },
  { id: 'adventure', label: 'Phiêu lưu', icon: '🚣', description: 'Cảm giác mạnh' },
  { id: 'culture', label: 'Văn hóa', icon: '🏛️', description: 'Lịch sử, nghệ thuật' }
]

const dreamDestinations = [
  { id: 'beach', label: 'Bãi biển', icon: '🏖️', description: 'Biển xanh, cát trắng' },
  { id: 'mountains', label: 'Vùng núi', icon: '🏔️', description: 'Không khí trong lành' },
  { id: 'city', label: 'Thành phố', icon: '🏙️', description: 'Sôi động, hiện đại' },
  { id: 'countryside', label: 'Miền quê', icon: '🌾', description: 'Yên bình, mộc mạc' }
]

const activities = [
  { id: 'food', label: 'Ẩm thực', icon: '🍴', description: 'Thưởng thức món ngon' },
  { id: 'shopping', label: 'Mua sắm', icon: '🛍️', description: 'Săn đồ độc lạ' },
  { id: 'trekking', label: 'Trekking', icon: '🥾', description: 'Leo núi, đi bộ' },
  { id: 'diving', label: 'Lặn biển', icon: '🤿', description: 'Khám phá đại dương' },
  { id: 'photography', label: 'Chụp ảnh', icon: '📸', description: 'Lưu giữ khoảnh khắc' }
]

// Mapping functions to convert frontend format to backend format
const mapTravelType = (type: string) => {
  const mapping: { [key: string]: string } = {
    'relaxation': 'nghỉ_dưỡng',
    'exploration': 'khám_phá', 
    'adventure': 'phiêu_lưu',
    'culture': 'văn_hóa'
  }
  return mapping[type] || 'khám_phá'
}

const mapDreamDestination = (destination: string) => {
  const mapping: { [key: string]: string } = {
    'beach': 'bãi_biển',
    'mountains': 'vùng_núi',
    'city': 'thành_phố',
    'countryside': 'miền_quê'
  }
  return mapping[destination] || 'bãi_biển'
}

const mapActivities = (activities: string[]) => {
  const mapping: { [key: string]: string } = {
    'food': 'ẩm_thực',
    'shopping': 'mua_sắm',
    'trekking': 'trekking',
    'diving': 'lặn_biển',
    'photography': 'chụp_ảnh'
  }
  return activities.map(activity => mapping[activity] || activity)
}

const mapBudgetLevel = (level: string) => {
  const mapping: { [key: string]: string } = {
    'low': 'thấp',
    'medium': 'trung_bình',
    'high': 'cao'
  }
  return mapping[level] || 'trung_bình'
}

const mapTravelStyle = (budgetLevel: string) => {
  const mapping: { [key: string]: string } = {
    'low': 'tiết_kiệm',
    'medium': 'thoải_mái',
    'high': 'sang_trọng'
  }
  return mapping[budgetLevel] || 'thoải_mái'
}

const mapAccommodation = (accommodation: string) => {
  const mapping: { [key: string]: string } = {
    'hotel': 'khách_sạn',
    'homestay': 'homestay',
    'resort': 'resort',
    'camping': 'camping'
  }
  return mapping[accommodation] || 'khách_sạn'
}

const mapDuration = (duration: string) => {
  const mapping: { [key: string]: string } = {
    'short': 'ngắn_hạn',
    'medium': 'trung_hạn',
    'long': 'dài_hạn'
  }
  return mapping[duration] || 'trung_hạn'
}

export default function PreferencesPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [preferences, setPreferences] = useState<Preferences>({
    travelTypes: [],
    dreamDestinations: [],
    activities: [],
    budgetLevel: '',
    tripDuration: '',
    groupSize: '',
    accommodation: '',
    transportation: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const toggleSelection = (category: keyof Preferences, value: string) => {
    setPreferences(prev => {
      const currentArray = prev[category] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      
      return {
        ...prev,
        [category]: newArray
      }
    })
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      console.log('Preferences Submit: Starting...')
      
      if (!token) {
        console.error('Preferences Submit: No token found')
        alert('Vui lòng đăng nhập lại')
        router.push('/login')
        return
      }

      // Map frontend preferences to backend survey format
      const surveyData = {
        travel_type: mapTravelType(preferences.travelTypes[0] || preferences.travelTypes[0]),
        dream_destination: mapDreamDestination(preferences.dreamDestinations[0] || 'beach'),
        activities: mapActivities(preferences.activities),
        budget_range: mapBudgetLevel(preferences.budgetLevel || 'medium'),
        travel_style: mapTravelStyle(preferences.budgetLevel || 'medium'),
        accommodation_type: mapAccommodation(preferences.accommodation || 'hotel'),
        group_size: parseInt(preferences.groupSize || '2'),
        duration_preference: mapDuration(preferences.tripDuration || 'medium')
      }

      console.log('Preferences Submit: Sending data to backend:', surveyData)

      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(surveyData)
      })

      console.log('Preferences Submit: Response status:', response.status)

      const data = await response.json()
      console.log('Preferences Submit: Response data:', data)

      if (response.ok) {
        console.log('Preferences saved successfully:', data)
        alert('Sở thích đã được lưu thành công!')
        // Hiển thị recommendations nếu có
        if (data.recommendations) {
          console.log('Recommendations:', data.recommendations)
        }
        // Redirect to dashboard
        console.log('Preferences Submit: Redirecting to dashboard...')
        window.location.href = '/dashboard'
      } else {
        console.error('Preferences save failed:', data)
        alert('Có lỗi xảy ra: ' + (data.error || 'Không thể lưu sở thích'))
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      alert('Có lỗi xảy ra khi lưu sở thích')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Bạn thích loại hình du lịch nào?
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {travelTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => toggleSelection('travelTypes', type.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              preferences.travelTypes.includes(type.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{type.icon}</div>
              <h4 className="font-medium text-gray-800">{type.label}</h4>
              <p className="text-sm text-gray-600">{type.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Đâu là địa điểm mơ ước của bạn?
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {dreamDestinations.map((destination) => (
          <div
            key={destination.id}
            onClick={() => toggleSelection('dreamDestinations', destination.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              preferences.dreamDestinations.includes(destination.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{destination.icon}</div>
              <h4 className="font-medium text-gray-800">{destination.label}</h4>
              <p className="text-sm text-gray-600">{destination.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Hoạt động nào bạn không thể bỏ lỡ?
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            onClick={() => toggleSelection('activities', activity.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              preferences.activities.includes(activity.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{activity.icon}</div>
              <h4 className="font-medium text-gray-800">{activity.label}</h4>
              <p className="text-sm text-gray-600">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SummaryBar currentPage="Khảo sát sở thích" showBackButton={true} />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Hãy cho chúng tôi biết sở thích của bạn!
            </h1>
            <p className="text-gray-600 mb-4">
              Điều này sẽ giúp chúng tôi gợi ý những chuyến đi hoàn hảo dành riêng cho bạn.
            </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">Tiến độ: {Math.round((currentStep / 3) * 100)}%</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Quay lại
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Bỏ qua
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Tiếp theo
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  {isLoading ? 'Đang lưu...' : 'Hoàn thành'}
                </button>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
