'use client'
import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface AdvancedFiltersProps {
  onFiltersChange: (filters: AdvancedFiltersData) => void
}

export interface AdvancedFiltersData {
  tripType: string[]
  transportation: string[]
  travelStyle: string[]
  season: string[]
  activityLevel: string[]
  specialPreferences: string[]
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<AdvancedFiltersData>({
    tripType: [],
    transportation: [],
    travelStyle: [],
    season: [],
    activityLevel: [],
    specialPreferences: []
  })

  const handleFilterChange = (category: keyof AdvancedFiltersData, value: string, checked: boolean) => {
    const newFilters = { ...filters }
    
    if (checked) {
      newFilters[category] = [...newFilters[category], value]
    } else {
      newFilters[category] = newFilters[category].filter(item => item !== value)
    }
    
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const filterGroups = [
    {
      id: 'tripType' as keyof AdvancedFiltersData,
      title: 'Loại chuyến đi',
      icon: '🎯',
      description: 'AI chọn gợi ý phù hợp',
      options: [
        { value: 'relaxation', label: 'Nghỉ dưỡng', icon: '🏖️' },
        { value: 'adventure', label: 'Phiêu lưu', icon: '⛰️' },
        { value: 'culture', label: 'Văn hoá', icon: '🏛️' },
        { value: 'cuisine', label: 'Ẩm thực', icon: '🍜' },
        { value: 'romantic', label: 'Lãng mạn', icon: '❤️' },
        { value: 'business', label: 'Công tác', icon: '💼' }
      ]
    },
    {
      id: 'transportation' as keyof AdvancedFiltersData,
      title: 'Phương tiện di chuyển',
      icon: '🚗',
      description: 'AI tính quãng đường + thời gian',
      options: [
        { value: 'motorbike', label: 'Xe máy', icon: '🛵' },
        { value: 'car', label: 'Ô tô', icon: '🚗' },
        { value: 'airplane', label: 'Máy bay', icon: '✈️' },
        { value: 'train', label: 'Tàu hoả', icon: '🚂' }
      ]
    },
    {
      id: 'travelStyle' as keyof AdvancedFiltersData,
      title: 'Phong cách du lịch',
      icon: '🎨',
      description: 'Ảnh hưởng lịch trình chi tiết',
      options: [
        { value: 'self-guided', label: 'Tự túc', icon: '🗺️' },
        { value: 'tour', label: 'Theo tour', icon: '👥' },
        { value: 'combined', label: 'Kết hợp', icon: '🔄' }
      ]
    },
    {
      id: 'season' as keyof AdvancedFiltersData,
      title: 'Mùa / thời gian',
      icon: '🌤️',
      description: 'AI chọn địa điểm phù hợp mùa',
      options: [
        { value: 'spring', label: 'Xuân', icon: '🌸' },
        { value: 'summer', label: 'Hè', icon: '☀️' },
        { value: 'autumn', label: 'Thu', icon: '🍂' },
        { value: 'winter', label: 'Đông', icon: '❄️' }
      ]
    },
    {
      id: 'activityLevel' as keyof AdvancedFiltersData,
      title: 'Mức độ hoạt động',
      icon: '⚡',
      description: 'Cân bằng tham quan và nghỉ ngơi',
      options: [
        { value: 'relaxed', label: 'Thư giãn', icon: '😌' },
        { value: 'moderate', label: 'Trung bình', icon: '⚖️' },
        { value: 'active', label: 'Năng động', icon: '🏃' }
      ]
    },
    {
      id: 'specialPreferences' as keyof AdvancedFiltersData,
      title: 'Ưu tiên đặc biệt',
      icon: '⭐',
      description: 'AI lọc theo preference thực tế',
      options: [
        { value: 'beach', label: 'Có biển', icon: '🏖️' },
        { value: 'local-food', label: 'Có đồ ăn địa phương', icon: '🍜' },
        { value: 'less-crowded', label: 'Ít đông', icon: '🤫' },
        { value: 'family-friendly', label: 'Phù hợp gia đình', icon: '👨‍👩‍👧‍👦' }
      ]
    }
  ]

  const getSelectedCount = () => {
    return Object.values(filters).reduce((total, group) => total + group.length, 0)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎛️</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bộ lọc nâng cao</h2>
              <p className="text-sm text-gray-600">Tùy chỉnh chi tiết để AI hiểu rõ hơn</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getSelectedCount() > 0 && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {getSelectedCount()} đã chọn
              </span>
            )}
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="space-y-6 pt-6">
            {filterGroups.map((group) => (
              <div key={group.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{group.icon}</span>
                  <h3 className="font-semibold text-gray-900">{group.title}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {group.description}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {group.options.map((option) => (
                    <label
                      key={option.value}
                      className={`relative cursor-pointer group transition-all duration-200 ${
                        filters[group.id].includes(option.value)
                          ? 'ring-2 ring-blue-500 ring-offset-1'
                          : 'hover:ring-1 hover:ring-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={filters[group.id].includes(option.value)}
                        onChange={(e) => handleFilterChange(group.id, option.value, e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                        filters[group.id].includes(option.value)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                        <div className="text-2xl mb-1">{option.icon}</div>
                        <div className="text-xs font-medium text-gray-700 leading-tight">
                          {option.label}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Reset Button */}
          {getSelectedCount() > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  const resetFilters: AdvancedFiltersData = {
                    tripType: [],
                    transportation: [],
                    travelStyle: [],
                    season: [],
                    activityLevel: [],
                    specialPreferences: []
                  }
                  setFilters(resetFilters)
                  onFiltersChange(resetFilters)
                }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                🔄 Đặt lại tất cả
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdvancedFilters
