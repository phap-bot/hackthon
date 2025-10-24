'use client'
import React, { useState, useRef, useEffect } from 'react'

export default function FloatingSupport() {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 24, y: 24 }) // bottom-6 right-6 equivalent
  const [isMinimized, setIsMinimized] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })
  const dragRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0 })
  const hasMoved = useRef(false)

  // Handle drag start - more flexible detection
  const handleMouseDown = (e: React.MouseEvent) => {
    // Allow dragging from anywhere on the button or container
    setIsDragging(true)
    hasMoved.current = false
    setDragStartPos({ x: e.clientX, y: e.clientY })
    startPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
    e.preventDefault()
    e.stopPropagation()
  }

  // Handle drag move - ultra smooth following
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    // Check if mouse has moved significantly
    const deltaX = Math.abs(e.clientX - dragStartPos.x)
    const deltaY = Math.abs(e.clientY - dragStartPos.y)
    if (deltaX > 5 || deltaY > 5) {
      hasMoved.current = true
    }

    // Calculate new position following mouse cursor exactly
    const newX = e.clientX - startPos.current.x
    const newY = e.clientY - startPos.current.y

    // Very flexible boundary handling - allow more freedom
    const buttonSize = 56
    const maxX = window.innerWidth - buttonSize
    const maxY = window.innerHeight - buttonSize

    // Allow more overshoot for natural feel
    const constrainedX = Math.max(-20, Math.min(newX, maxX + 20))
    const constrainedY = Math.max(-20, Math.min(newY, maxY + 20))

    // Smooth position update
    setPosition({
      x: constrainedX,
      y: constrainedY
    })
  }

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch support for mobile devices - ultra smooth
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    startPos.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    }
    e.preventDefault()
    e.stopPropagation()
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    const touch = e.touches[0]
    
    const newX = touch.clientX - startPos.current.x
    const newY = touch.clientY - startPos.current.y

    const buttonSize = 56
    const maxX = window.innerWidth - buttonSize
    const maxY = window.innerHeight - buttonSize

    // Same flexible boundary as mouse
    const constrainedX = Math.max(-20, Math.min(newX, maxX + 20))
    const constrainedY = Math.max(-20, Math.min(newY, maxY + 20))

    setPosition({
      x: constrainedX,
      y: constrainedY
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Add event listeners for drag (mouse and touch)
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging])

  // Auto-hide when scrolling
  useEffect(() => {
    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        setIsMinimized(true)
        setTimeout(() => setIsMinimized(false), 2000)
      }
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <div
      ref={dragRef}
      className={`fixed z-50 transition-all duration-300 ${
        isMinimized ? 'opacity-50 scale-90' : 'opacity-100 scale-100'
      } ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      style={{
        left: `${position.x}px`,
        bottom: `${position.y}px`,
        transform: 'translateY(0)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Chat Window */}
      {isChatOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">support_agent</span>
              <span className="font-semibold">Hỗ trợ khách hàng</span>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-64 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm">support_agent</span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                  <p className="text-sm text-gray-800">
                    Xin chào! Tôi có thể giúp gì cho bạn? 😊
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 justify-end">
                <div className="bg-primary text-white p-3 rounded-lg shadow-sm max-w-xs">
                  <p className="text-sm">
                    Tôi cần hỗ trợ về việc đặt vé
                  </p>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-600 text-sm">person</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`chat-button bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-all duration-200 ${
          isDragging ? 'scale-110' : 'hover:scale-110'
        }`}
      >
        <span className="material-symbols-outlined text-3xl">
          {isChatOpen ? 'close' : 'support_agent'}
        </span>
      </button>

      {/* Drag Indicator */}
      {isDragging && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">drag_indicator</span>
            Kéo để di chuyển
          </div>
        </div>
      )}
    </div>
  )
}
