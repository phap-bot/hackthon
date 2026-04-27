'use client'

import { debugAPI } from './debug'

export interface User {
  id: string
  username: string
  email: string
  full_name: string
  avatar_url?: string
  phone?: string
  date_of_birth?: string
  location?: string
  bio?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface TokenPair {
  access_token: string
  refresh_token?: string
}

export interface AuthResponse {
  status: string
  message: string
  access_token?: string
  token_type?: string
  user?: User
}

// Token management
export const getValidAccessToken = async (): Promise<string | null> => {
  try {
    const token = localStorage.getItem('access_token')
    console.log('Getting access token:', { hasToken: !!token })
    
    if (!token) {
      console.log('No access token found')
      return null
    }

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      const isExpired = payload.exp < now
      
      console.log('Token validation:', {
        exp: payload.exp,
        now,
        isExpired,
        timeLeft: payload.exp - now
      })
      
      if (isExpired) {
        console.log('Token expired, attempting refresh...')
        // Token expired, try to refresh
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          try {
            const newTokens = await refreshAccessToken(refreshToken)
            console.log('Token refreshed successfully')
            return newTokens.access_token
          } catch (error) {
            console.error('Token refresh failed:', error)
            clearTokens()
            return null
          }
        } else {
          console.log('No refresh token available')
          clearTokens()
          return null
        }
      }
      
      console.log('Token is valid')
      return token
    } catch (parseError) {
      console.error('Token parsing error:', parseError)
      clearTokens()
      return null
    }
  } catch (error) {
    console.error('Token validation error:', error)
    clearTokens()
    return null
  }
}

export const saveTokens = (tokens: TokenPair) => {
  localStorage.setItem('access_token', tokens.access_token)
  if (tokens.refresh_token) {
    localStorage.setItem('refresh_token', tokens.refresh_token)
  }
}

export const clearTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('token')
}

export const refreshAccessToken = async (refreshToken: string): Promise<TokenPair> => {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${refreshToken}`
    }
  })

  if (!response.ok) {
    throw new Error('Token refresh failed')
  }

  const data = await response.json()
  return {
    access_token: data.access_token,
    refresh_token: refreshToken
  }
}

// API request helper with automatic token refresh
export const apiRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
  try {
    const token = await getValidAccessToken()
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { 'Authorization': `Bearer ${token}` })
    }

    debugAPI.logRequest(url, options, token || undefined)

    const response = await fetch(url, {
      ...options,
      headers
    })

    // Parse response data for debugging
    let responseData = null
    try {
      const clone = response.clone()
      responseData = await clone.json()
    } catch (e) {
      // Response might not be JSON
    }

    debugAPI.logResponse(url, response, responseData)

    // If token expired, try to refresh and retry once
    if (response.status === 401 && token) {
      console.log('Token expired, attempting refresh...')
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const newTokens = await refreshAccessToken(refreshToken)
          saveTokens(newTokens)
          
          console.log('Token refreshed successfully, retrying request...')
          
          // Retry with new token
          const retryHeaders = {
            ...headers,
            'Authorization': `Bearer ${newTokens.access_token}`
          }
          
          const retryResponse = await fetch(url, {
            ...options,
            headers: retryHeaders
          })
          
          debugAPI.logResponse(url, retryResponse)
          return retryResponse
        }
      } catch (error) {
        debugAPI.logError(url, error)
        clearTokens()
      }
    }

    return response
  } catch (error) {
    debugAPI.logError(url, error)
    throw error
  }
}

// Login function
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Login failed')
  }

  return response.json()
}

// Register function
export const registerUser = async (userData: {
  username: string
  email: string
  password: string
  full_name: string
}): Promise<AuthResponse> => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Registration failed')
  }

  return response.json()
}
