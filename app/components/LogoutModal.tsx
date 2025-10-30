'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Modal Overlay - Clean và đẹp */}
      <div 
        aria-hidden="true" 
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Panel - Đồng bộ với design system */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="relative mx-auto w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-xl p-8 border border-gray-200 dark:border-gray-700 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              <span className="material-symbols-outlined text-3xl text-blue-500 dark:text-blue-400">
                logout
              </span>
            </div>
            
            {/* Headline */}
            <h3 className="text-gray-900 dark:text-gray-50 text-xl font-semibold mb-2">
              Đăng xuất tài khoản?
            </h3>
            
            {/* Body Text */}
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Bạn có chắc chắn muốn kết thúc phiên làm việc hiện tại không?
            </p>
            
            {/* Button Group */}
            <div className="flex w-full gap-3">
              <button 
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Ở lại
              </button>
              <button 
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Đăng xuất
              </button>
            </div>
          </div>
          
          {/* Close Button */}
          <button 
            aria-label="Close" 
            onClick={onClose}
            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </div>
    </>
  )
}
