/**
 * AI Agent service for generating travel itineraries
 */
export interface GenerateItineraryRequest {
  preferences: {
    budget: string;
    days: number;
    region: string;
    theme: string;
    transport: string;
    people: number;
  };
  location?: {
    lat: number;
    lon: number;
  };
}

export interface Activity {
  time: string;
  place: string;
  desc: string;
  cost?: number;
  cost_note?: string;
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

export interface ItineraryData {
  overview: string;
  schedule: DayPlan[];
  total_cost_estimate: string;
  nearby_count?: number;
  location?: {
    lat: number;
    lon: number;
  };
}

export async function generateItinerary(
  preferences: GenerateItineraryRequest["preferences"],
  location?: GenerateItineraryRequest["location"]
): Promise<{ success: boolean; data: ItineraryData; meta?: any }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  
  const res = await fetch(`${apiUrl}/api/itinerary/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preferences, location }),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to generate itinerary: ${res.statusText}`);
  }
  
  return await res.json();
}

