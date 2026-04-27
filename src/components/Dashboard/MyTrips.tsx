'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Trip {
  id: string
  destination: string
  start_date: string
  end_date: string
  status: string
  total_cost?: number
}

export default function MyTrips() {
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserTrips()
  }, [])

  const fetchUserTrips = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch('/api/trips', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTrips(data.trips || [])
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTrip = () => {
    router.push('/planner')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành'
      case 'in_progress':
        return 'Đang diễn ra'
      case 'pending':
        return 'Chờ xử lý'
      default:
        return status
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Trip 1 - Upcoming */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <div className="h-48 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLlkn6MWAPtIz3u4PBxZ2VZ8PiL6GQbGbWvRM7hTHZ6getLruvhtt-p8_wRhCGExQvhbEVIcawHTE6EdCaGzP_Cqs5pJq3eYCaeXgJlJVA5NIps4mcnZOG7SKAyFSusPjPObOpkloWHDsJJA0QMb-dJpNuD6o8hBSFoCAGO1AKGHXLkAvHH1TmOCmvgJ6bgggwknxdtrLfKA_ZUgV2QMbkZBPeYzCTJb6B0_If48PFh1XaqDka7VPSSEkX2XgSMVm-GJy1HylViss')"}}></div>
        <div className="p-6">
          <h4 className="text-xl font-bold text-gray-800 dark:text-white">Khám phá Paris</h4>
          <p className="text-gray-600 dark:text-gray-300 mt-2">15 tháng 10 - 22 tháng 10, 2023</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">Sắp diễn ra</span>
            <a className="text-primary hover:underline font-semibold" href="#">Xem chi tiết</a>
          </div>
        </div>
      </div>

      {/* Trip 2 - Saved */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <div className="h-48 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLlkn6MWAPtIz3u4PBxZ2VZ8PiL6GQbGbWvRM7hTHZ6getLruvhtt-p8_wRhCGExQvhbEVIcawHTE6EdCaGzP_Cqs5pJq3eYCaeXgJlJVA5NIps4mcnZOG7SKAyFSusPjPObOpkloWHDsJJA0QMb-dJpNuD6o8hBSFoCAGO1AKGHXLkAvHH1TmOCmvgJ6bgggwknxdtrLfKA_ZUgV2QMbkZBPeYzCTJb6B0_If48PFh1XaqDka7VPSSEkX2XgSMVm-GJy1HylViss')"}}></div>
        <div className="p-6">
          <h4 className="text-xl font-bold text-gray-800 dark:text-white">Phiêu lưu tại Tokyo</h4>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Đã lưu: 3 ngày trước</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">Đã lưu</span>
            <a className="text-primary hover:underline font-semibold" href="#">Xem chi tiết</a>
          </div>
        </div>
      </div>

      {/* Trip 3 - Create New */}
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer" onClick={handleCreateTrip}>
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl">add_circle</span>
          <p className="mt-2 font-semibold">Tạo Chuyến Đi Mới</p>
        </div>
      </div>
    </div>
  )
}
