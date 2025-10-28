'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SurveyCheckRouteProps {
  children: React.ReactNode
}

export default function SurveyCheckRoute({ children }: SurveyCheckRouteProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(false)

  const checkSurveyStatus = async () => {
    try {
      const token = localStorage.getItem('access_token')
      console.log('SurveyCheck: Checking token...', !!token)
      
      if (!token) {
        console.log('SurveyCheck: No token found, redirecting to login')
        router.push('/login')
        return
      }

      console.log('SurveyCheck: Calling /api/preferences')
      const response = await fetch('/api/preferences', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('SurveyCheck: Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('SurveyCheck: User has preferences:', data)
        setHasCompletedSurvey(true)
      } else if (response.status === 404) {
        console.log('SurveyCheck: No preferences found, redirecting to survey')
        // Người dùng chưa hoàn thành khảo sát
        setHasCompletedSurvey(false)
        window.location.href = '/preferences'
      } else {
        console.log('SurveyCheck: Error response, redirecting to survey')
        setHasCompletedSurvey(false)
        window.location.href = '/preferences'
      }
    } catch (error) {
      console.error('SurveyCheck: Error checking survey status:', error)
      setHasCompletedSurvey(false)
      window.location.href = '/preferences'
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkSurveyStatus()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang kiểm tra...</p>
        </div>
      </div>
    )
  }

  if (!hasCompletedSurvey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chuyển đến trang khảo sát...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

