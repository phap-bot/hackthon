import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    console.log(`[Reverse Geocoding] Requesting: ${backendUrl}/api/maps/reverse?lat=${lat}&lng=${lng}`);
    
    const backendResponse = await fetch(
      `${backendUrl}/api/maps/reverse?lat=${lat}&lng=${lng}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('[Reverse Geocoding] Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to reverse geocode', details: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('[Reverse Geocoding] Success:', data);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[Reverse Geocoding] Exception:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

