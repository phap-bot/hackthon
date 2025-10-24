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
      {/* Modal Overlay */}
      <div 
        aria-hidden="true" 
        className="fixed inset-0 z-50 bg-gray-900/50 dark:bg-black/60"
        onClick={onClose}
      />
      
      {/* Modal Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative mx-auto w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 shadow-2xl p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              <span className="material-symbols-outlined text-4xl text-blue-500 dark:text-blue-400">
                logout
              </span>
            </div>
            
            {/* Headline */}
            <h3 className="text-gray-900 dark:text-gray-50 tracking-tight text-2xl font-bold leading-tight pb-2">
              Đăng xuất tài khoản?
            </h3>
            
            {/* Body Text */}
            <p className="text-gray-600 dark:text-gray-300 text-base font-normal leading-normal pb-8">
              Bạn có chắc chắn muốn kết thúc phiên làm việc hiện tại không?
            </p>
            
            {/* Button Group */}
            <div className="flex w-full flex-col-reverse sm:flex-row gap-3">
              <button 
                onClick={onClose}
                className="flex flex-1 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-50 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                <span className="truncate">Ở lại</span>
              </button>
              <button 
                onClick={onConfirm}
                className="flex flex-1 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-blue-500 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors"
              >
                <span className="truncate">Đăng xuất</span>
              </button>
            </div>
          </div>
          
          {/* Close Button */}
          <button 
            aria-label="Close" 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
    </>
  )
}
