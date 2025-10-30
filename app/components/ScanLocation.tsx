'use client'

import React, { useState } from 'react'

interface LocationData {
  name: string
  description: string
  image: string
  history?: string
  activities?: string
  info?: string
}

const ScanLocation = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('history')
  const [isScanning, setIsScanning] = useState(false)
  const [locationData, setLocationData] = useState<LocationData | null>(null)

  // Sample data - replace with actual data
  const sampleLocation: LocationData = {
    name: '', // Placeholder for location name
    description: '', // Placeholder for location description
    image: '', // Placeholder for location image
    history: '', // Placeholder for historical information
    activities: '', // Placeholder for activities
    info: '' // Placeholder for general information
  }

  // Example data for demonstration
  const exampleLocation: LocationData = {
    name: 'Ví dụ: Chùa Một Cột',
    description: 'Mô tả địa điểm sẽ hiển thị ở đây...',
    image: 'https://via.placeholder.com/400x300?text=Hinh+Anh+Dia+Diem',
    history: 'Thông tin lịch sử sẽ hiển thị ở đây...',
    activities: 'Các hoạt động có thể tham gia sẽ liệt kê ở đây...',
    info: 'Thông tin chi tiết như địa chỉ, giờ mở cửa...'
  }

  const handleScan = () => {
    setIsScanning(true)
    // Simulate scanning process
    setTimeout(() => {
      setLocationData(exampleLocation) // Use example data for demonstration
      setIsScanning(false)
    }, 2000)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Simulate search process
      setLocationData(exampleLocation) // Use example data for demonstration
    }
  }

  const handleAddToItinerary = () => {
    // Add to itinerary functionality
    alert('Đã thêm vào lịch trình!')
  }

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: locationData?.name,
        text: locationData?.description,
        url: window.location.href
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('Đã sao chép link!')
    }
  }

  const handleClear = () => {
    setLocationData(null)
    setSearchQuery('')
    setActiveTab('history')
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Header Section */}
            <div className="flex flex-col items-center justify-center p-4 gap-4">
              <div className="text-center">
                <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  Khám Phá Địa Điểm
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal mt-2">
                  Sử dụng camera để quét hoặc nhập tên địa điểm để khám phá thông tin chi tiết.
                </p>
              </div>
              
              {/* Scan and Search Section */}
              <div className="flex flex-col items-center gap-3 w-full max-w-md">
                {/* Camera Scan Button */}
                <button 
                  onClick={handleScan}
                  disabled={isScanning}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-16 w-16 bg-primary text-white gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isScanning ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  ) : (
                    <span className="material-symbols-outlined text-white text-4xl">photo_camera</span>
                  )}
                </button>
                
                <p className="text-slate-900 dark:text-white text-base font-normal leading-normal py-1 px-4 text-center">
                  hoặc
                </p>
                
                {/* Search Form */}
                <form onSubmit={handleSearch} className="w-full">
                  <div className="w-full">
                    <label className="flex flex-col min-w-40 h-12 w-full">
                      <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                        <div className="text-slate-500 dark:text-slate-400 flex border-none bg-white dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
                          <span className="material-symbols-outlined">search</span>
                        </div>
                        <input 
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-white dark:bg-slate-800 focus:border-none h-full placeholder:text-slate-500 dark:placeholder:text-slate-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" 
                          placeholder="Nhập tên địa danh..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </label>
                  </div>
                </form>
              </div>
            </div>

            {/* Location Details Section */}
            {locationData && (
              <div className="p-4 @container w-full">
                <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start shadow-[0_0_10px_rgba(0,0,0,0.05)] bg-white dark:bg-slate-800">
                  {/* Image */}
                  <div 
                    className="w-full @xl:w-1/3 bg-center bg-no-repeat aspect-video @xl:aspect-auto @xl:h-full bg-cover rounded-t-xl @xl:rounded-l-xl @xl:rounded-r-none" 
                    style={{ backgroundImage: `url("${locationData.image}")` }}
                  />
                  
                  {/* Content */}
                  <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-4 p-6">
                    <p className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
                      {locationData.name}
                    </p>
                    
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-slate-700">
                      <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 border-b-2 text-sm font-medium ${
                          activeTab === 'history' 
                            ? 'border-primary text-primary' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary'
                        }`}
                      >
                        Lịch sử
                      </button>
                      <button 
                        onClick={() => setActiveTab('activities')}
                        className={`px-4 py-2 border-b-2 text-sm font-medium ${
                          activeTab === 'activities' 
                            ? 'border-primary text-primary' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary'
                        }`}
                      >
                        Hoạt động
                      </button>
                      <button 
                        onClick={() => setActiveTab('info')}
                        className={`px-4 py-2 border-b-2 text-sm font-medium ${
                          activeTab === 'info' 
                            ? 'border-primary text-primary' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary'
                        }`}
                      >
                        Thông tin
                      </button>
                    </div>
                    
                    {/* Tab Content */}
                    <div className="flex flex-col gap-3">
                      <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal">
                        {locationData.description || 'Mô tả địa điểm sẽ hiển thị ở đây...'}
                      </p>
                      
                      {activeTab === 'history' && (
                        <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal">
                          {locationData.history || 'Thông tin lịch sử sẽ hiển thị ở đây...'}
                        </p>
                      )}
                      
                      {activeTab === 'activities' && (
                        <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal">
                          {locationData.activities || 'Các hoạt động có thể tham gia sẽ liệt kê ở đây...'}
                        </p>
                      )}
                      
                      {activeTab === 'info' && (
                        <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal">
                          {locationData.info || 'Thông tin chi tiết như địa chỉ, giờ mở cửa...'}
                        </p>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={handleShare}
                          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] gap-2"
                        >
                          <span className="material-symbols-outlined">share</span>
                          <span className="truncate">Chia sẻ</span>
                        </button>
                        <button 
                          onClick={handleClear}
                          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] gap-2"
                        >
                          <span className="material-symbols-outlined">clear</span>
                          <span className="truncate">Xóa</span>
                        </button>
                      </div>
                      <button 
                        onClick={handleAddToItinerary}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full sm:w-auto"
                      >
                        <span className="truncate">Thêm vào Lịch Trình</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScanLocation
