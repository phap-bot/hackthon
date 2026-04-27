'use client'

// Debug utilities for API calls
export const debugAPI = {
  logRequest: (url: string, options: RequestInit, token?: string | null) => {
    console.group(`🚀 API Request: ${options.method || 'GET'} ${url}`)
    console.log('Options:', options)
    console.log('Token:', token ? `${token.substring(0, 20)}...` : 'None')
    console.log('Headers:', options.headers)
    console.groupEnd()
  },

  logResponse: (url: string, response: Response, data?: any) => {
    console.group(`📥 API Response: ${response.status} ${response.statusText}`)
    console.log('URL:', url)
    console.log('Status:', response.status)
    console.log('OK:', response.ok)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))
    if (data) {
      console.log('Data:', data)
    }
    console.groupEnd()
  },

  logError: (url: string, error: any) => {
    console.group(`❌ API Error: ${url}`)
    console.error('Error:', error)
    console.log('Error type:', typeof error)
    console.log('Error message:', error.message)
    console.log('Error stack:', error.stack)
    console.groupEnd()
  },

  checkToken: (token: string) => {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) {
        console.error('Invalid JWT format')
        return false
      }

      const payload = JSON.parse(atob(parts[1]))
      const now = Math.floor(Date.now() / 1000)
      const isExpired = payload.exp < now
      
      console.group('🔍 Token Analysis')
      console.log('Token:', `${token.substring(0, 20)}...`)
      console.log('Payload:', payload)
      console.log('Expires at:', new Date(payload.exp * 1000))
      console.log('Current time:', new Date(now * 1000))
      console.log('Is expired:', isExpired)
      console.log('Time left (seconds):', payload.exp - now)
      console.groupEnd()

      return !isExpired
    } catch (error) {
      console.error('Token analysis failed:', error)
      return false
    }
  },

  checkLocalStorage: () => {
    console.group('💾 LocalStorage Check')
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')
    const oldToken = localStorage.getItem('token')
    
    console.log('access_token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'None')
    console.log('refresh_token:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'None')
    console.log('token (old):', oldToken ? `${oldToken.substring(0, 20)}...` : 'None')
    
    if (accessToken) {
      debugAPI.checkToken(accessToken)
    }
    
    console.groupEnd()
  }
}

// Auto-check localStorage on import
if (typeof window !== 'undefined') {
  console.log('🔧 Debug utilities loaded')
  debugAPI.checkLocalStorage()
}
