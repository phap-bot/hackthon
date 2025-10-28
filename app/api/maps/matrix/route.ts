import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { origins, destinations, mode } = body;

    if (!origins || !destinations) {
      return NextResponse.json(
        { error: 'Origins and destinations required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    // 获取用户token（如果有）
    const authHeader = request.headers.get('authorization');
    
    const backendResponse = await fetch(`${backendUrl}/api/maps/matrix`, {
      method: 'POST',
      headers: authHeader 
        ? { 'Content-Type': 'application/json', 'Authorization': authHeader }
        : { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origins,
        destinations,
        mode: mode || 'drive'
      })
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch matrix' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching matrix:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

