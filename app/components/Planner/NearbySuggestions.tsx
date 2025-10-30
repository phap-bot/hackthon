'use client'

import React, { useEffect, useState } from 'react'

interface SuggestPlace {
  id: string
  name: string
  address: string
  rating: number
  reviews_count: number
  coordinates: { lat: number; lng: number }
}

interface Props {
  lat?: number
  lng?: number
  categories?: string
  radius?: number
  onSelect?: (place: SuggestPlace) => void
}

const NearbySuggestions: React.FC<Props> = ({ lat, lng, categories = 'tourist_attraction', radius = 5000, onSelect }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [places, setPlaces] = useState<SuggestPlace[]>([])

  useEffect(() => {
    if (!lat || !lng) return
    const t = setTimeout(async () => {
      try {
        setLoading(true)
        setError(null)
        const resp = await fetch(`/api/maps/nearby?lat=${lat}&lng=${lng}&categories=${encodeURIComponent(categories)}&radius=${radius}&limit=10`)
        if (!resp.ok) throw new Error('fetch nearby failed')
        const data = await resp.json()
        const list: SuggestPlace[] = (Array.isArray(data) ? data : data.places || []).map((p: any) => ({
          id: p.id || `${p.coordinates?.lat}_${p.coordinates?.lng}`,
          name: p.name,
          address: p.address,
          rating: p.rating || 4.2,
          reviews_count: p.reviews_count || 0,
          coordinates: p.coordinates || { lat: p.lat, lng: p.lng },
        }))
        setPlaces(list)
      } catch (e) {
        setError('Không thể tải gợi ý địa điểm')
      } finally {
        setLoading(false)
      }
    }, 400)
    return () => clearTimeout(t)
  }, [lat, lng, categories, radius])

  if (!lat || !lng) return null

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Đề xuất địa điểm gần</h3>
      </div>
      {loading && <p className="text-gray-500">Đang tải gợi ý...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {places.slice(0, 8).map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => onSelect?.(p)}
              className="text-left p-4 border rounded-xl hover:bg-gray-50 transition"
            >
              <div className="font-medium text-gray-900">{p.name}</div>
              <div className="text-xs text-gray-600 line-clamp-2">{p.address}</div>
              <div className="text-xs text-gray-500 mt-1">⭐ {p.rating.toFixed(1)} · {p.reviews_count}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default NearbySuggestions


