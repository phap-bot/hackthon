'use client'
import React, { useState, useRef } from 'react'
import { 
  XMarkIcon,
  CameraIcon,
  PhotoIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface AvatarUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File) => Promise<void>
  currentAvatar?: string
}

export default function AvatarUploadModal({ 
  isOpen, 
  onClose, 
  onUpload, 
  currentAvatar 
}: AvatarUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB')
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleCameraInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      await onUpload(selectedFile)
      handleClose()
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cập nhật ảnh đại diện
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {currentAvatar && !previewUrl && (
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Ảnh hiện tại:
              </p>
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden">
                <img 
                  src={currentAvatar} 
                  alt="Current avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {previewUrl && (
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Xem trước:
              </p>
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PhotoIcon className="w-5 h-5" />
              Chọn từ thư viện ảnh
            </button>

            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <CameraIcon className="w-5 h-5" />
              Chụp ảnh mới
            </button>
          </div>

          {selectedFile && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                <CheckIcon className="w-5 h-5" />
                {isUploading ? 'Đang tải lên...' : 'Xác nhận tải lên'}
              </button>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraInputChange}
        className="hidden"
      />
    </div>
  )
}
