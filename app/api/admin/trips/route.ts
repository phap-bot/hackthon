import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/trips - Lấy danh sách trips cho admin
export async function GET(request: NextRequest) {
  try {
    // Call FastAPI backend
    const fastApiResponse = await fetch(`${process.env.FASTAPI_URL}/api/admin/trips`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication header if needed
        // 'Authorization': `Bearer ${token}`
      },
    })

    if (!fastApiResponse.ok) {
      throw new Error('FastAPI request failed')
    }

    const trips = await fastApiResponse.json()
    
    return NextResponse.json(trips)

  } catch (error) {
    console.error('Error in admin trips API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
