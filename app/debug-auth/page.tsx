'use client'

import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { debugAPI } from '../lib/debug'
import { apiRequest } from '../lib/auth'

export default function DebugAuthPage() {
  const { user, isLoggedIn, isLoading } = useAuth()
  const [testResult, setTestResult] = useState<any>(null)
  const [isTesting, setIsTesting] = useState(false)

  const testAPI = async () => {
    setIsTesting(true)
    try {
      console.log('🧪 Testing API call...')
      const response = await apiRequest('/api/auth/me')
      const data = await response.json()
      setTestResult({ success: true, data })
    } catch (error) {
      console.error('Test failed:', error)
      setTestResult({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const clearTokens = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('token')
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          🔧 Auth Debug Page
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📊 Current Status
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-medium">Loading:</span>
                <span className={`px-2 py-1 rounded text-sm ${isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {isLoading ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="font-medium">Logged In:</span>
                <span className={`px-2 py-1 rounded text-sm ${isLoggedIn ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isLoggedIn ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="font-medium">User:</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user ? `${user.username} (${user.email})` : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🛠️ Actions
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={debugAPI.checkLocalStorage}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Check LocalStorage
              </button>
              
              <button
                onClick={testAPI}
                disabled={isTesting}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isTesting ? 'Testing...' : 'Test API Call'}
              </button>
              
              <button
                onClick={clearTokens}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear Tokens & Reload
              </button>
            </div>
          </div>

          {/* Test Results */}
          {testResult && (
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                📋 Test Results
              </h2>
              
              <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* LocalStorage Info */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              💾 LocalStorage Info
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Access Token</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 break-all">
                  {localStorage.getItem('access_token') ? 
                    `${localStorage.getItem('access_token')?.substring(0, 50)}...` : 
                    'None'
                  }
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Refresh Token</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 break-all">
                  {localStorage.getItem('refresh_token') ? 
                    `${localStorage.getItem('refresh_token')?.substring(0, 50)}...` : 
                    'None'
                  }
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Old Token</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 break-all">
                  {localStorage.getItem('token') ? 
                    `${localStorage.getItem('token')?.substring(0, 50)}...` : 
                    'None'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
