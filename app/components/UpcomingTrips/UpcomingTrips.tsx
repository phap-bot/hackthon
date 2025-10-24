'use client'
import React from 'react'

interface Trip {
  id: string
  title: string
  date: string
  status: 'planned' | 'pending'
  statusText: string
  statusColor: string
  image: string
}

const trips: Trip[] = [
  {
    id: '1',
    title: 'Khám phá Paris',
    date: '15 tháng 10 - 22 tháng 10, 2023',
    status: 'planned',
    statusText: 'Đã lên kế hoạch',
    statusColor: 'text-green-600 dark:text-green-400',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLlkn6MWAPtIz3u4PBxZ2VZ8PiL6GQbGbWvRM7hTHZ6getLruvhtt-p8_wRhCGExQvhbEVIcawHTE6EdCaGzP_Cqs5pJq3eYCaeXgJlJVA5NIps4mcnZOG7SKAyFSusPjPObOpkloWHDsJJA0QMb-dJpNuD6o8hBSFoCAGO1AKGHXLkAvHH1TmOCmvgJ6bgggwknxdtrLfKA_ZUgV2QMbkZBPeYzCTJb6B0_If48PFh1XaqDka7VPSSEkX2XgSMVm-GJy1HylViss'
  },
  {
    id: '2',
    title: 'Phiêu lưu tại Tokyo',
    date: '5 tháng 11 - 15 tháng 11, 2023',
    status: 'pending',
    statusText: 'Đang chờ xử lý',
    statusColor: 'text-yellow-600 dark:text-yellow-400',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLlkn6MWAPtIz3u4PBxZ2VZ8PiL6GQbGbWvRM7hTHZ6getLruvhtt-p8_wRhCGExQvhbEVIcawHTE6EdCaGzP_Cqs5pJq3eYCaeXgJlJVA5NIps4mcnZOG7SKAyFSusPjPObOpkloWHDsJJA0QMb-dJpNuD6o8hBSFoCAGO1AKGHXLkAvHH1TmOCmvgJ6bgggwknxdtrLfKA_ZUgV2QMbkZBPeYzCTJb6B0_If48PFh1XaqDka7VPSSEkX2XgSMVm-GJy1HylViss'
  }
]

export default function UpcomingTrips() {
  return (
    <section>
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Chuyến đi sắp tới
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <div 
            key={trip.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
          >
            <div 
              className="h-48 bg-cover bg-center" 
              style={{ backgroundImage: `url('${trip.image}')` }}
            ></div>
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                {trip.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {trip.date}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-sm font-medium ${trip.statusColor}`}>
                  {trip.statusText}
                </span>
                <a className="text-primary hover:underline" href="#">
                  Xem chi tiết
                </a>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add new trip card */}
        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl">add_circle</span>
            <p className="mt-2 font-semibold">Tạo Chuyến Đi Mới</p>
          </div>
        </div>
      </div>
    </section>
  )
}
