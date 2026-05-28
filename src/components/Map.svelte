<script>
  import { onMount, onDestroy } from 'svelte'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  /** @type {{ shops: any[], selectedId: number|null, userLocation: {lat:number,lon:number}|null }} */
  let { shops = [], selectedId = null, userLocation = null, onSelectShop } = $props()

  let mapEl
  let map
  let markersLayer

  const STUTTGART = [48.781, 9.18]

  function makeIcon(shop, isSelected) {
    const type = shop.type === 'bar' ? 'shot' : 'bottle'
    const variant = isSelected ? 'full' : 'empty'
    return L.icon({
      iconUrl: `/assets/${type}_${variant}.png`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    })
  }

  function renderMarkers() {
    if (!map) return
    markersLayer.clearLayers()
    for (const shop of shops) {
      const marker = L.marker([shop.latitude, shop.longitude], {
        icon: makeIcon(shop, shop.id === selectedId),
        title: shop.name,
      })
      marker.on('click', () => onSelectShop?.(shop.id))
      marker.bindPopup(`<strong>${shop.name}</strong><br>${shop.address}, ${shop.city}`)
      markersLayer.addLayer(marker)
    }
  }

  // Pan to selected shop when selectedId changes
  $effect(() => {
    if (!map || selectedId == null) return
    const shop = shops.find((s) => s.id === selectedId)
    if (shop) map.panTo([shop.latitude, shop.longitude])
    renderMarkers()
  })

  // Re-render markers when shops list changes
  $effect(() => {
    shops
    renderMarkers()
  })

  // Show user location marker
  $effect(() => {
    if (!map || !userLocation) return
    L.circleMarker([userLocation.lat, userLocation.lon], {
      radius: 8,
      color: '#0BB9E6',
      fillColor: '#0BB9E6',
      fillOpacity: 0.9,
    })
      .addTo(map)
      .bindPopup('Dein Standort')
  })

  onMount(() => {
    map = L.map(mapEl, { zoomControl: true }).setView(STUTTGART, 12)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    markersLayer = L.layerGroup().addTo(map)
    renderMarkers()
  })

  onDestroy(() => map?.remove())
</script>

<div bind:this={mapEl} class="map"></div>

<style>
  .map {
    width: 100%;
    height: 100%;
  }
</style>
