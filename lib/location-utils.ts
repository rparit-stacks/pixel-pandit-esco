/**
 * Calculate distance between two lat/lng coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return distance
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Check if a location (lat, lng) is within radius of another location
 */
export function isWithinRadius(
  centerLat: number,
  centerLng: number,
  targetLat: number,
  targetLng: number,
  radiusKm: number
): boolean {
  const distance = calculateDistance(centerLat, centerLng, targetLat, targetLng)
  return distance <= radiusKm
}

/**
 * Generate a bounding box for location search (approximate)
 * This helps narrow down the database query before calculating exact distances
 */
export function getBoundingBox(lat: number, lng: number, radiusKm: number) {
  // Rough approximation: 1 degree ≈ 111 km
  const latDelta = radiusKm / 111
  const lngDelta = radiusKm / (111 * Math.cos(toRad(lat)))
  
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta,
  }
}

