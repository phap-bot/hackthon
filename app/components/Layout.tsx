'use client'
import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Sidebar from './Sidebar'
import ProtectedRoute from './ProtectedRoute'

interface LayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
  const { isLoggedIn } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar 
            isCollapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
        )}

        {/* Main Content */}
        <div className={`flex flex-col flex-grow transition-all duration-300 ease-in-out ${
          showSidebar ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''
        }`}>
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}
