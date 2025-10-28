import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const category = searchParams.get('category') || 'catering.restaurant';
    const radius = searchParams.get('radius') || '5000';
    const limit = searchParams.get('limit') || '10';

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    console.log(`[Smart Suggestions] Requesting: ${backendUrl}/api/maps/ai/suggest_places?lat=${lat}&lng=${lng}&category=${category}&radius=${radius}&limit=${limit}`);
    
    const backendResponse = await fetch(
      `${backendUrl}/api/maps/ai/suggest_places?lat=${lat}&lng=${lng}&category=${category}&radius=${radius}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('[Smart Suggestions] Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to get smart suggestions', details: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('[Smart Suggestions] Success:', data);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[Smart Suggestions] Exception:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
