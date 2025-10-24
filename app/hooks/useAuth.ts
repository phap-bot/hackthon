'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    isLoading: true
  });

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is logged in by verifying token
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.log('No token found, user not logged in');
        setAuthState({
          isLoggedIn: false,
          user: null,
          isLoading: false
        });
        return;
      }

      console.log('Token found, verifying with backend...');

      // Verify token with backend
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('User authenticated:', responseData);
        
        // Extract user data from response
        const userData = responseData.user || responseData;
        console.log('Extracted user data:', userData);
        
        setAuthState({
          isLoggedIn: true,
          user: userData,
          isLoading: false
        });
      } else {
        // Token is invalid, remove it
        console.log('Token invalid, removing from localStorage');
        localStorage.removeItem('access_token');
        setAuthState({
          isLoggedIn: false,
          user: null,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        isLoggedIn: false,
        user: null,
        isLoading: false
      });
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        
        // Extract user data from response
        const userData = data.user || data;
        console.log('Login user data:', userData);
        
        setAuthState({
          isLoggedIn: true,
          user: userData,
          isLoading: false
        });
        
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.detail };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Đăng nhập thất bại' };
    }
  };

  const logout = () => {
    console.log('Logging out user...');
    localStorage.removeItem('access_token');
    setAuthState({
      isLoggedIn: false,
      user: null,
      isLoading: false
    });
  };

  const clearAuth = () => {
    console.log('Clearing authentication state...');
    localStorage.removeItem('access_token');
    setAuthState({
      isLoggedIn: false,
      user: null,
      isLoading: false
    });
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
  }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Register response:', responseData);
        
        // Registration successful - don't auto-login
        // User must verify email and login separately
        console.log('Registration successful, user must verify email and login separately');
        
        return { success: true, data: responseData };
      } else {
        const error = await response.json();
        return { success: false, error: error.detail };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: 'Đăng ký thất bại' };
    }
  };

  return {
    ...authState,
    login,
    logout,
    register,
    checkAuthStatus,
    clearAuth
  };
};
