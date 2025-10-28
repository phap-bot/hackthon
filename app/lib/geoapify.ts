const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY!;

export async function reverseGeocode(lat: number, lon: number) {
  const res = await fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`
  );
  const data = await res.json();
  return data.features?.[0]?.properties?.formatted || "Không xác định vị trí";
}

export async function getNearbyPlaces(lat: number, lon: number, category: string) {
  const res = await fetch(
    `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=10&apiKey=${GEOAPIFY_API_KEY}`
  );
  const data = await res.json();
  return data.features || [];
}
