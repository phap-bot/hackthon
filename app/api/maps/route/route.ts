import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { waypoints, mode } = body;

    if (!waypoints || !Array.isArray(waypoints) || waypoints.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 waypoints required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    // 获取用户token（如果有）
    const authHeader = request.headers.get('authorization');
    
    const backendResponse = await fetch(`${backendUrl}/api/maps/route`, {
      method: 'POST',
      headers: authHeader 
        ? { 'Content-Type': 'application/json', 'Authorization': authHeader }
        : { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        waypoints,
        mode: mode || 'drive'
      })
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch route' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

