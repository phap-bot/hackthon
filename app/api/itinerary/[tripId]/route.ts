import { NextRequest, NextResponse } from 'next/server'

// GET /api/itinerary/[tripId] - Lấy chi tiết lịch trình
export async function GET(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  try {
    const { tripId } = params

    if (!tripId) {
      return NextResponse.json(
        { error: 'Trip ID is required' },
        { status: 400 }
      )
    }

    // Call FastAPI backend
    const fastApiResponse = await fetch(`${process.env.FASTAPI_URL}/api/itinerary/${tripId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!fastApiResponse.ok) {
      throw new Error('FastAPI request failed')
    }

    const itinerary = await fastApiResponse.json()
    
    return NextResponse.json(itinerary)

  } catch (error) {
    console.error('Error in itinerary API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
