const R = 6371 // Earth radius in km

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function sortShopsByDistance(shops, lat, lon) {
  return shops
    .map((shop) => ({
      ...shop,
      distanceKm: haversineDistance(lat, lon, shop.latitude, shop.longitude),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
}

export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}
