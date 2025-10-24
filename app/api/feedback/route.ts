import { NextRequest, NextResponse } from 'next/server'

// POST /api/feedback - Gửi đánh giá chuyến đi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { tripId, feedback } = body
    
    if (!tripId || !feedback) {
      return NextResponse.json(
        { error: 'Trip ID and feedback are required' },
        { status: 400 }
      )
    }

    // Call FastAPI backend
    const fastApiResponse = await fetch(`${process.env.FASTAPI_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trip_id: tripId,
        overall_rating: feedback.overallRating,
        value_for_money: feedback.valueForMoney,
        itinerary_quality: feedback.itineraryQuality,
        accommodation_rating: feedback.accommodationRating,
        food_rating: feedback.foodRating,
        transportation_rating: feedback.transportationRating,
        attractions_rating: feedback.attractionsRating,
        would_recommend: feedback.wouldRecommend,
        favorite_activity: feedback.favoriteActivity,
        least_favorite_activity: feedback.leastFavoriteActivity,
        suggestions: feedback.suggestions,
        additional_comments: feedback.additionalComments
      }),
    })

    if (!fastApiResponse.ok) {
      throw new Error('FastAPI request failed')
    }

    const result = await fastApiResponse.json()
    
    return NextResponse.json({
      status: 'success',
      message: 'Feedback submitted successfully',
      feedbackId: result.feedback_id
    })

  } catch (error) {
    console.error('Error in feedback API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
