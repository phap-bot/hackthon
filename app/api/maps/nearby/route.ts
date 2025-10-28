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

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    // 获取用户token（如果有）
    const authHeader = request.headers.get('authorization');
    
    const backendResponse = await fetch(
      `${backendUrl}/api/maps/geoapify/nearby?lat=${lat}&lng=${lng}&categories=${categories}&radius=${radius}&limit=${limit}`,
      {
        method: 'GET',
        headers: authHeader ? { 'Authorization': authHeader } : {}
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch nearby places' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

