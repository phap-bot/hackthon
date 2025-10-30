'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '../PageHeader'
// GPS scan disabled per request: do not import/use geolocation

interface Activity {
  name: string
  time?: string
  cost?: string
  note?: string
}

interface LocationInfo {
  địa_chỉ?: string
  giờ_mở_cửa?: string
  giá_vé?: string
  lưu_ý?: string
}

interface LocationData {
  name: string
  description: string
  image?: string
  history?: string
  activities?: string | Activity[] | any
  info?: string | LocationInfo | any
  image_suggestion?: string
}

const ScanLocation = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('history')
  const [isScanning, setIsScanning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [detailedHistory, setDetailedHistory] = useState<string>('')
  const [historyLoadedFor, setHistoryLoadedFor] = useState<string>('')
  // Removed GPS-based scanning and nearby fetch in Scan screen
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const isDescriptionJsonLike = useMemo(() => {
    const text = locationData?.description || ''
    if (!text) return false
    const trimmed = text.trim()
    return trimmed.startsWith('{') || trimmed.startsWith('[')
  }, [locationData?.description])

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
    image: 'https://www.vietnamairlines.com/~/media/SEO-images/2025%20SEO/Traffic%20TV/chua-mot-cot/chua-mot-cot-thumb.jpg',
    history: 'Thông tin lịch sử sẽ hiển thị ở đây...',
    activities: 'Các hoạt động có thể tham gia sẽ liệt kê ở đây...',
    info: 'Thông tin chi tiết như địa chỉ, giờ mở cửa...'
  }

  const startCamera = async () => {
    try {
      setError(null)
      setCameraError(null)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Thiết bị không hỗ trợ truy cập camera (getUserMedia).')
      }
      const media = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'environment' } }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = media as any
        // Một số trình duyệt cần onloadedmetadata trước khi play
        await new Promise<void>((resolve) => {
          if (!videoRef.current) return resolve()
          videoRef.current.onloadedmetadata = () => resolve()
        })
        try {
          await videoRef.current.play()
        } catch {}
      }
      setStream(media)
      setIsScanning(true)
    } catch (e: any) {
      const message = e?.name === 'NotAllowedError'
        ? 'Quyền camera bị từ chối. Hãy cấp quyền trong trình duyệt.'
        : e?.name === 'NotFoundError'
          ? 'Không tìm thấy camera trên thiết bị.'
          : e?.message || 'Không thể truy cập camera.'
      setCameraError(message)
      setError(message)
    }
  }

  const stopCamera = () => {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setIsScanning(false)
  }

  const captureAndAnalyze = async () => {
    if (!videoRef.current) return
    try {
      setIsLoading(true)
      setError(null)
      const video = videoRef.current
      const w = video.videoWidth || 640
      const h = video.videoHeight || 480
      const canvas = canvasRef.current || document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(video, 0, 0, w, h)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92)

      const resp = await fetch('/api/gemini/image-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: dataUrl })
      })
      const result = await resp.json()
      if (!resp.ok) throw new Error(result?.error || 'Phân tích ảnh thất bại')

      if (result?.success && result?.data) {
        setLocationData(result.data)
        setActiveTab('history')
        setDetailedHistory('')
        setHistoryLoadedFor('')
        setSearchQuery(result.data?.name || '')
      } else {
        setError('Không nhận diện được nội dung ảnh')
      }
    } catch (e: any) {
      setError(e?.message || 'Lỗi phân tích ảnh')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePickImage = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setIsLoading(true)
      setError(null)
      const reader = new FileReader()
      const dataUrl: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Đọc ảnh thất bại'))
        reader.readAsDataURL(file)
      })
      const resp = await fetch('/api/gemini/image-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: dataUrl })
      })
      const result = await resp.json()
      if (!resp.ok) throw new Error(result?.error || 'Phân tích ảnh thất bại')
      if (result?.success && result?.data) {
        setLocationData(result.data)
        setActiveTab('history')
        setDetailedHistory('')
        setHistoryLoadedFor('')
        setSearchQuery(result.data?.name || '')
      }
    } catch (err: any) {
      setError(err?.message || 'Lỗi phân tích ảnh')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      // cleanup khi rời trang
      stream?.getTracks().forEach(t => t.stop())
    }
  }, [stream])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setError('Vui lòng nhập tên địa điểm để tìm kiếm.')
      return
    }

    setIsLoading(true)
    setError(null)
    setLocationData(null)

    try {
      const response = await fetch('/api/ollama/location-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locationName: searchQuery }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Không thể lấy thông tin địa điểm từ AI.')
      }

      const result = await response.json()
      console.log('API Response:', result)
      
      if (result.success) {
        setLocationData(result.data)
        setDetailedHistory('')
        setHistoryLoadedFor('')
      } else {
        // API trả về data ngay cả khi có error
        if (result.data) {
          setLocationData(result.data)
          setError(result.error || 'Có lỗi xảy ra')
        } else {
          throw new Error(result.error || 'Không thể lấy thông tin địa điểm')
        }
      }
    } catch (err: any) {
      console.error('Search error:', err)
      const errorMsg = err.message || 'Đã xảy ra lỗi khi tìm kiếm địa điểm. Vui lòng thử lại.'
      setError(errorMsg)
      
      // Fallback data khi API lỗi
      setLocationData({
        name: searchQuery,
        description: `Xin lỗi, không thể kết nối đến dịch vụ AI. Chi tiết: ${errorMsg}`,
        image: 'https://via.placeholder.com/400x300?text=No+Image+Available',
        history: 'Thông tin lịch sử tạm thời không khả dụng.',
        activities: 'Danh sách hoạt động sẽ được cập nhật khi dịch vụ khôi phục.',
        info: 'Thông tin chi tiết tạm thời không khả dụng.',
      })
    } finally {
      setIsLoading(false)
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
    setError(null)
    setActiveTab('history')
  }

  const handleGoBack = () => {
    router.back()
  }

  // Lazy-load lịch sử chi tiết khi chuyển sang tab "history"
  useEffect(() => {
    const shouldLoadHistory =
      activeTab === 'history' &&
      locationData?.name &&
      historyLoadedFor !== locationData.name &&
      !historyLoading

    if (!shouldLoadHistory) return

    const fetchHistory = async () => {
      try {
        setHistoryLoading(true)
        const res = await fetch('/api/ollama/location-research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locationName: locationData?.name, searchType: 'history' })
        })
        const data = await res.json()
        if (data?.success && data?.data?.history) {
          setDetailedHistory(data.data.history)
          setHistoryLoadedFor(locationData!.name)
        }
      } catch (e) {
        // ignore, keep fallback
      } finally {
        setHistoryLoading(false)
      }
    }

    fetchHistory()
  }, [activeTab, locationData?.name, historyLoadedFor, historyLoading])

  // Nearby fetch removed; only AI suggestions remain in Activities

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      <div className="layout-container flex h-full grow flex-col">
        {/* Page Header */}
        <PageHeader 
          title="Khám Phá Địa Điểm" 
          subtitle="Tìm kiếm và khám phá thông tin chi tiết về các địa điểm"
        />
        
        <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Main Content */}
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
                  onClick={isScanning ? stopCamera : startCamera}
                  disabled={isLoading}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-16 w-16 bg-primary text-white gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-white text-4xl">{isScanning ? 'close' : 'photo_camera'}</span>
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
                          placeholder="Nhập tên địa danh, ví dụ: Chùa Một Cột" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          disabled={isLoading || isScanning}
                        />
                        <button
                          type="submit"
                          disabled={isLoading || isScanning || !searchQuery.trim()}
                          className="flex items-center justify-center px-4 rounded-r-lg bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <span className="material-symbols-outlined">send</span>
                          )}
                        </button>
                      </div>
                    </label>
                  </div>
                </form>
                
                {/* Camera Preview */}
                {isScanning && (
                  <div className="w-full max-w-md">
                    <div className="rounded-xl overflow-hidden border">
                      <video ref={videoRef} className="w-full bg-black" playsInline autoPlay muted />
                    </div>
                    <div className="flex justify-center mt-3">
                      <button
                        type="button"
                        onClick={captureAndAnalyze}
                        disabled={isLoading}
                        className="flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
                      >
                        {isLoading ? 'Đang phân tích…' : 'Chụp & phân tích'}
                      </button>
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                )}

                {/* Fallback: chọn ảnh từ thư viện / chụp ảnh mặc định của trình duyệt */}
                {!isScanning && (
                  <div className="flex flex-col items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePickImage}
                      className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                      Chọn ảnh từ thiết bị
                    </button>
                    <p className="text-xs text-gray-500 text-center max-w-sm">
                      Hoặc nhập tên địa điểm ở trên để tìm kiếm thông tin
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileSelected}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="w-full p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Location Details Section */}
            {locationData && (
              <div className="p-4 @container w-full">
                <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start shadow-[0_0_10px_rgba(0,0,0,0.05)] bg-white dark:bg-slate-800">
                  {/* Image */}
                  <div 
                    className="w-full @xl:w-1/3 bg-center bg-no-repeat aspect-video @xl:aspect-auto @xl:h-full bg-cover rounded-t-xl @xl:rounded-l-xl @xl:rounded-r-none relative overflow-hidden" 
                    style={{ 
                      backgroundImage: `url("${locationData.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'})` 
                    }}
                  >
                    {/* Overlay gradient để text dễ đọc hơn */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                  
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
                      {!isDescriptionJsonLike && (
                        <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal">
                          {locationData.description || 'Mô tả địa điểm sẽ hiển thị ở đây...'}
                        </p>
                      )}
                      
                      {activeTab === 'history' && (
                        <div className="relative">
                          {historyLoading ? (
                            <p className="text-slate-500 dark:text-slate-400">Đang tải lịch sử chi tiết...</p>
                          ) : (
                            <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal whitespace-pre-line">
                              {detailedHistory || locationData.history || 'Thông tin lịch sử sẽ hiển thị ở đây...'}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {activeTab === 'activities' && (
                        <div className="space-y-4">
                          {Array.isArray(locationData.activities) && locationData.activities.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gợi ý từ AI</p>
                              <ol className="space-y-3">
                                {locationData.activities.map((activity: any, index: number) => (
                                  <li key={`ai_${index}`} className="flex gap-3">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white flex items-center justify-center font-bold">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{activity.name || `Hoạt động ${index + 1}`}</h4>
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        {activity.time && (<p><span className="font-medium">⏰ Thời gian:</span> {activity.time}</p>)}
                                        {activity.cost && (<p><span className="font-medium">💰 Chi phí:</span> {activity.cost}</p>)}
                                        {activity.note && (<p className="sm:col-span-3"><span className="font-medium">📝 Lưu ý:</span> {activity.note}</p>)}
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {activeTab === 'info' && (
                        <div className="space-y-3">
                          {typeof locationData.info === 'object' && locationData.info ? (
                            <>
                              {locationData.info.địa_chỉ && (
                                <div className="flex items-start gap-2">
                                  <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                                  <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">Địa chỉ:</p>
                                    <p className="text-slate-600 dark:text-slate-300">{locationData.info.địa_chỉ}</p>
                                  </div>
                                </div>
                              )}
                              {locationData.info.giờ_mở_cửa && (
                                <div className="flex items-start gap-2">
                                  <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                                  <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">Giờ mở cửa:</p>
                                    <p className="text-slate-600 dark:text-slate-300">{locationData.info.giờ_mở_cửa}</p>
                                  </div>
                                </div>
                              )}
                              {locationData.info.giá_vé && (
                                <div className="flex items-start gap-2">
                                  <span className="material-symbols-outlined text-primary text-xl">local_atm</span>
                                  <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">Giá vé:</p>
                                    <p className="text-slate-600 dark:text-slate-300">{locationData.info.giá_vé}</p>
                                  </div>
                                </div>
                              )}
                              {locationData.info.lưu_ý && (
                                <div className="flex items-start gap-2">
                                  <span className="material-symbols-outlined text-primary text-xl">info</span>
                                  <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">Lưu ý:</p>
                                    <p className="text-slate-600 dark:text-slate-300">{locationData.info.lưu_ý}</p>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal">
                              {typeof locationData.info === 'string' ? locationData.info : 'Thông tin chi tiết như địa chỉ, giờ mở cửa...'}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4">
                      <button 
                        onClick={handleShare}
                        disabled={isLoading || isScanning}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined">share</span>
                        <span className="truncate">Chia sẻ</span>
                      </button>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={handleClear}
                          disabled={isLoading || isScanning}
                          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined">arrow_back</span>
                          <span className="truncate">Quay lại</span>
                        </button>
                        <button 
                          onClick={handleAddToItinerary}
                          disabled={isLoading || isScanning}
                          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined">add</span>
                          <span className="truncate">Thêm vào Lịch Trình</span>
                        </button>
                      </div>
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
