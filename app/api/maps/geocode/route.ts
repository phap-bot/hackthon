import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const limit = searchParams.get('limit') || '5'

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ results: [] })
    }

    const apiKey = process.env.SERPAPI_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'SERPAPI_KEY missing' }, { status: 500 })
    }

    // Google Maps via SerpAPI
    const url = `https://serpapi.com/search.json?engine=google_maps&type=search&q=${encodeURIComponent(q)}&api_key=${apiKey}`
    const resp = await fetch(url, { next: { revalidate: 60 } })
    if (!resp.ok) {
      return NextResponse.json({ error: `SerpAPI geocode failed ${resp.status}` }, { status: resp.status })
    }

    const data = await resp.json()
    const items = data?.local_results || data?.place_results || []
    const results = (items || []).slice(0, parseInt(limit)).map((it: any) => ({
      name: it.title || it.address || it.category,
      country: it?.address?.split(',').pop()?.trim(),
      lat: it?.gps_coordinates?.latitude,
      lng: it?.gps_coordinates?.longitude,
      raw: it,
    })).filter((r: any) => r.lat && r.lng)

    return NextResponse.json({ results })
  } catch (e) {
    console.error('geocode error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


