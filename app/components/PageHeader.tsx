'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  backButtonText?: string
  onBack?: () => void
}

export default function PageHeader({ 
  title, 
  subtitle, 
  showBackButton = true, 
  backButtonText = "Quay lại",
  onBack 
}: PageHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left side - Back button and title */}
          <div className="flex items-center gap-3">
            {showBackButton && (
              <>
                <button 
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="material-symbols-outlined text-xl">arrow_back</span>
                  <span className="font-medium">{backButtonText}</span>
                </button>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              </>
            )}
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          
          {/* Right side - Empty for future content */}
          <div className="flex items-center gap-2">
            {/* Có thể thêm các action buttons ở đây */}
          </div>
        </div>
      </div>
    </div>
  )
}
