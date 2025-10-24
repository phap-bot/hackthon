import { NextRequest, NextResponse } from 'next/server'

// POST /api/travel-planner - Tạo lịch trình du lịch
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { budget, people, days, destination, startDate, travelStyle, interests } = body
    
    if (!budget || !people || !days || !destination || !startDate || !travelStyle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Call FastAPI backend
    const fastApiResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/api/travel-planner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        budget,
        people: parseInt(people),
        days: parseInt(days),
        destination,
        start_date: startDate,
        travel_style: travelStyle,
        interests: interests || []
      }),
    })

    if (!fastApiResponse.ok) {
      throw new Error('FastAPI request failed')
    }

    const result = await fastApiResponse.json()
    
    return NextResponse.json({
      tripId: result.trip_id,
      status: 'success',
      message: 'Itinerary generated successfully'
    })

  } catch (error) {
    console.error('Error in travel-planner API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
