'use client'

import React, { useEffect, useMemo, useState } from 'react'

export interface SuggestionItem {
  name: string
  lat: number
  lng: number
}

interface Props {
  value: string
  onSelect: (item: SuggestionItem) => void
}

const DestinationAutocomplete: React.FC<Props> = ({ value, onSelect }) => {
  const [query, setQuery] = useState<string>(value || '')
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setQuery(value || '')
  }, [value])

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }
    const t = setTimeout(async () => {
      try {
        setLoading(true)
        const resp = await fetch(`/api/maps/geocode?q=${encodeURIComponent(query)}&limit=5`)
        const data = await resp.json()
        const items = (data?.results || []).map((r: any) => ({ name: r.name, lat: r.lat, lng: r.lng }))
        setSuggestions(items)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nhập tỉnh/thành phố..."
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
      />

      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Đang tìm...</div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-auto">
          {suggestions.map((s, idx) => (
            <button
              type="button"
              key={`${s.name}_${idx}`}
              onClick={() => {
                onSelect(s)
                setQuery(s.name)
                setSuggestions([])
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50"
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default DestinationAutocomplete


