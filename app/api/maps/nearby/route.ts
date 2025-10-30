import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const categories = searchParams.get('categories') || 'catering.restaurant';
    const radius = searchParams.get('radius') || '5000';
    const limit = searchParams.get('limit') || '20';

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SERPAPI_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'SERPAPI_KEY missing' }, { status: 500 })
    }

    // Map categories to a simple query term for SerpAPI
    const q = categories.includes('restaurant') || categories.includes('catering')
      ? 'restaurant'
      : categories.includes('cafe')
        ? 'cafe'
        : categories.includes('hotel')
          ? 'hotel'
          : 'tourist attraction'

    // Convert radius (m) to an approximate Google Maps zoom level
    const r = parseInt(radius)
    const zoom = r <= 1500 ? 16 : r <= 3000 ? 15 : r <= 6000 ? 14 : r <= 12000 ? 13 : 12
    const ll = `@${lat},${lng},${zoom}z`
    const url = `https://serpapi.com/search.json?engine=google_maps&type=search&ll=${encodeURIComponent(ll)}&q=${encodeURIComponent(q)}&api_key=${apiKey}`
    const resp = await fetch(url, { next: { revalidate: 60 } })
    if (!resp.ok) {
      return NextResponse.json({ error: `SerpAPI nearby failed ${resp.status}` }, { status: resp.status })
    }

    const data = await resp.json()
    const items = data?.local_results || []

    // Haversine distance (meters)
    const toMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371e3
      const φ1 = (lat1 * Math.PI) / 180
      const φ2 = (lat2 * Math.PI) / 180
      const Δφ = ((lat2 - lat1) * Math.PI) / 180
      const Δλ = ((lon2 - lon1) * Math.PI) / 180
      const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    }

    const centerLat = parseFloat(lat)
    const centerLng = parseFloat(lng)
    const maxMeters = parseInt(radius)

    const filtered = (items || []).filter((p: any) => {
      const plat = p?.gps_coordinates?.latitude
      const plng = p?.gps_coordinates?.longitude
      if (typeof plat !== 'number' || typeof plng !== 'number') return false
      const d = toMeters(centerLat, centerLng, plat, plng)
      return d <= maxMeters
    })

    const places = filtered.slice(0, parseInt(limit)).map((p: any) => ({
      id: p?.data_id || p?.place_id || `${p?.gps_coordinates?.latitude}_${p?.gps_coordinates?.longitude}`,
      name: p?.title,
      address: p?.address,
      rating: p?.rating || 0,
      reviews_count: p?.reviews || 0,
      coordinates: { lat: p?.gps_coordinates?.latitude, lng: p?.gps_coordinates?.longitude },
      categories: p?.type || [],
      thumbnail: p?.thumbnail || p?.images?.[0]
    })).filter((x: any) => x.coordinates.lat && x.coordinates.lng)

    return NextResponse.json({ places })
    
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

