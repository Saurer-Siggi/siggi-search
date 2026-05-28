export async function fetchShops() {
  const res = await fetch('/api/shops')
  if (!res.ok) throw new Error('Failed to load shops')
  const data = await res.json()
  return data.shops
}

export async function createShop(shop, password) {
  const res = await fetch('/api/shops', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${password}`,
    },
    body: JSON.stringify(shop),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to create shop')
  }
  return res.json()
}

export async function deleteShop(id, password) {
  const res = await fetch(`/api/shops/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${password}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to delete shop')
  }
}

// Nominatim geocoding — resolves an address string to {lat, lon}
export async function geocodeAddress(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'de', 'User-Agent': 'SiggiSearch/1.0' },
  })
  if (!res.ok) throw new Error('Geocoding failed')
  const results = await res.json()
  return results.map((r) => ({
    displayName: r.display_name,
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
  }))
}
