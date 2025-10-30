'use client'

import React, { useEffect, useState } from 'react'

interface NearbyPlace {
  name: string
  category?: string
  approx_distance_km?: number
  short_description?: string
  suggested_activities?: string[]
}

interface LocationResearchData {
  name: string
  description?: string
  history?: string
  activities?: Array<{ name?: string; time?: string; cost?: string; note?: string } | string>
  info?: Record<string, any>
  image?: string
  image_suggestion?: string
  nearby_places?: NearbyPlace[]
}

interface Props {
  locationName: string
}

const OllamaLocationResearch: React.FC<Props> = ({ locationName }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<LocationResearchData | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchResearch() {
      if (!locationName || locationName.trim().length < 2) {
        setData(null)
        return
      }
      try {
        setLoading(true)
        setError(null)
        const resp = await fetch('/api/ollama/location-research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locationName, searchType: 'search' })
        })
        const result = await resp.json()
        if (!resp.ok) throw new Error(result?.error || 'Request failed')
        if (!cancelled) {
          setData(result?.data as LocationResearchData)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Không thể tải dữ liệu từ AI')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchResearch()
    return () => {
      cancelled = true
    }
  }, [locationName])

  if (!locationName) return null

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Gợi ý từ AI cho “{locationName}”</h3>
      </div>
      {loading && <p className="text-gray-500">Đang phân tích với AI…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {!loading && !error && data && (
        <div className="space-y-6">
          {/* Overview */}
          {(data.description || data.history) && (
            <div>
              <div className="text-gray-800">{data.description}</div>
              {data.history && (
                <details className="mt-2">
                  <summary className="text-sm text-blue-600 cursor-pointer">Xem lịch sử</summary>
                  <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{data.history}</div>
                </details>
              )}
            </div>
          )}

          {/* Activities */}
          {Array.isArray(data.activities) && data.activities.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Hoạt động đề xuất</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.activities.slice(0, 8).map((act, idx) => {
                  if (typeof act === 'string') {
                    return (
                      <li key={idx} className="p-3 border rounded-xl text-gray-800">{act}</li>
                    )
                  }
                  const title = act.name || act.note || 'Hoạt động'
                  const meta: string[] = []
                  if (act.time) meta.push(act.time)
                  if (act.cost) meta.push(act.cost)
                  return (
                    <li key={idx} className="p-3 border rounded-xl">
                      <div className="font-medium text-gray-900">{title}</div>
                      {meta.length > 0 && <div className="text-xs text-gray-600 mt-0.5">{meta.join(' · ')}</div>}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Nearby places by AI knowledge */}
          {Array.isArray(data.nearby_places) && data.nearby_places.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Địa điểm gần khu vực theo AI</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.nearby_places.slice(0, 8).map((p, idx) => (
                  <div key={idx} className="p-4 border rounded-xl">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {p.category || 'Địa điểm'}{p.approx_distance_km ? ` · ~${p.approx_distance_km} km` : ''}
                    </div>
                    {p.short_description && (
                      <div className="text-xs text-gray-700 mt-1 line-clamp-2">{p.short_description}</div>
                    )}
                    {Array.isArray(p.suggested_activities) && p.suggested_activities.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">Gợi ý: {p.suggested_activities.join(', ')}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OllamaLocationResearch


