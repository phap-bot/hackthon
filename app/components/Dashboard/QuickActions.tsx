'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  color: string
  route: string
}

const quickActions: QuickAction[] = [
  {
    id: 'ai-planner',
    title: 'Tạo lịch trình tự động',
    description: 'Để AI thiết kế chuyến đi hoàn hảo cho bạn.',
    icon: 'auto_awesome',
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    route: '/planner'
  },
  {
    id: 'real-time-map',
    title: 'Bản đồ thời gian thực',
    description: 'Dẫn đường và khám phá các địa điểm xung quanh.',
    icon: 'map',
    color: 'bg-green-500',
    route: '/map-demo'
  },
  {
    id: 'explore-places',
    title: 'Khám phá địa điểm',
    description: 'Tìm những điểm đến nổi tiếng và bí mật.',
    icon: 'explore',
    color: 'bg-purple-500',
    route: '/map-demo'
  },
  {
    id: 'ai-itinerary',
    title: 'Lịch trình AI đề xuất',
    description: 'Các kế hoạch được tạo sẵn cho bạn.',
    icon: 'tips_and_updates',
    color: 'bg-orange-500',
    route: '/itinerary'
  }
]

export default function QuickActions() {
  const router = useRouter()

  const handleActionClick = (route: string) => {
    router.push(route)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {quickActions.map((action, index) => (
        <a
          key={action.id}
          onClick={() => handleActionClick(action.route)}
          className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer relative ${
            action.id === 'ai-planner' ? 'ring-2 ring-purple-200 dark:ring-purple-800' : ''
          }`}
        >
          {/* AI Badge for first item */}
          {action.id === 'ai-planner' && (
            <div className="absolute -top-2 -right-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                AI
              </span>
            </div>
          )}
          
          <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white text-xl mb-3 ${
            action.id === 'ai-planner' ? 'shadow-lg' : ''
          }`}>
            <span className="material-symbols-outlined">{action.icon}</span>
          </div>
          <h4 className={`font-bold text-lg mb-2 ${
            action.id === 'ai-planner' 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' 
              : 'text-gray-800 dark:text-white'
          }`}>
            {action.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
        </a>
      ))}
    </div>
  )
}
