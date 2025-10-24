import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const minRating = searchParams.get('min_rating') || '4.0';
    const radius = searchParams.get('radius') || '10000';
    const limit = searchParams.get('limit') || '20';

    // Build query parameters
    const queryParams = new URLSearchParams({
      min_rating: minRating,
      radius: radius,
      limit: limit
    });

    if (lat && lng) {
      queryParams.append('lat', lat);
      queryParams.append('lng', lng);
    }

    // Call backend API
    const response = await fetch(`${BACKEND_URL}/api/maps/hotels?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}
