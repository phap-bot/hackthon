'use client'
import React from 'react'

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-blue-600">Wanderlust</h1>
      <div className="flex gap-4">
        <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Trang chủ</a>
        <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Tính năng</a>
        <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Liên hệ</a>
      </div>
    </nav>
  )
}
