import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/stats - Lấy thống kê cho admin
export async function GET(request: NextRequest) {
  try {
    // Call FastAPI backend
    const fastApiResponse = await fetch(`${process.env.FASTAPI_URL}/api/admin/stats`, {
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

    const stats = await fastApiResponse.json()
    
    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error in admin stats API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
