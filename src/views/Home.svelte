<script>
  import { onMount } from 'svelte'
  import Map from '../components/Map.svelte'
  import ShopList from '../components/ShopList.svelte'
  import SearchBar from '../components/SearchBar.svelte'
  import FilterChips from '../components/FilterChips.svelte'
  import LegalModal from '../components/LegalModal.svelte'
  import { fetchShops } from '../lib/api.js'
  import { sortShopsByDistance } from '../lib/geo.js'

  let allShops = $state([])
  let filter = $state('all')
  let selectedId = $state(null)
  let userLocation = $state(null)
  let showLegal = $state(false)
  let locationLoading = $state(false)
  let locationError = $state('')

  let filteredShops = $derived(
    filter === 'all' ? allShops : allShops.filter((s) => s.type === filter),
  )

  // Panel state for mobile sliding panel
  let panelOpen = $state(false)

  onMount(async () => {
    try {
      const shops = await fetchShops()
      allShops = shops
    } catch (e) {
      console.error('Failed to load shops', e)
    }
  })

  function handleLocationSelect(loc) {
    userLocation = loc
    allShops = sortShopsByDistance(allShops, loc.lat, loc.lon)
    panelOpen = true
  }

  async function handleCurrentLocation() {
    if (!navigator.geolocation) {
      locationError = 'Geolocation wird nicht unterstützt.'
      return
    }
    locationLoading = true
    locationError = ''
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        locationLoading = false
        handleLocationSelect({ lat: pos.coords.latitude, lon: pos.coords.longitude })
      },
      () => {
        locationLoading = false
        locationError = 'Standort konnte nicht ermittelt werden.'
      },
    )
  }

  function handleSelectShop(id) {
    selectedId = id
    panelOpen = true
  }
</script>

<div class="home">
  <!-- Map fills the whole background -->
  <div class="map-area">
    <Map
      shops={filteredShops}
      {selectedId}
      {userLocation}
      onSelectShop={handleSelectShop}
    />
    <!-- OSM attribution / legal link -->
    <div class="map-attribution">
      © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> ·
      <button class="legal-link" onclick={() => (showLegal = true)}>Impressum & Datenschutz</button>
    </div>
  </div>

  <!-- Floating top controls -->
  <div class="top-bar">
    <div class="search-container">
      <SearchBar onLocationSelect={handleLocationSelect} />
    </div>
    <div class="chips-row">
      <FilterChips {filter} onFilterChange={(f) => (filter = f)} />
    </div>
  </div>

  <!-- Current location FAB -->
  <button
    class="location-fab"
    onclick={handleCurrentLocation}
    disabled={locationLoading}
    title="Aktuellen Standort verwenden"
    aria-label="Aktuellen Standort verwenden"
  >
    {#if locationLoading}
      <span class="fab-spinner"></span>
    {:else}
      <img src="/assets/location.png" alt="Standort" width="24" height="24" />
    {/if}
  </button>

  {#if locationError}
    <div class="location-error">{locationError}</div>
  {/if}

  <!-- Desktop sidebar (≥900px) -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <span class="sidebar-title">
        {filteredShops.length} Standort{filteredShops.length !== 1 ? 'e' : ''}
      </span>
    </div>
    <ShopList shops={filteredShops} {selectedId} onSelectShop={handleSelectShop} />
  </aside>

  <!-- Mobile bottom panel -->
  <div class="panel" class:panel-open={panelOpen}>
    <button
      class="panel-handle"
      onclick={() => (panelOpen = !panelOpen)}
      aria-label={panelOpen ? 'Panel schließen' : 'Panel öffnen'}
    >
      <div class="handle-bar"></div>
      <span class="panel-count">
        {filteredShops.length} Standort{filteredShops.length !== 1 ? 'e' : ''}
      </span>
    </button>
    <ShopList shops={filteredShops} {selectedId} onSelectShop={handleSelectShop} />
  </div>
</div>

{#if showLegal}
  <LegalModal onClose={() => (showLegal = false)} />
{/if}

<style>
  .home {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .map-area {
    position: absolute;
    inset: 0;
  }

  .map-attribution {
    position: absolute;
    bottom: 6px;
    right: 8px;
    font-size: 0.72rem;
    color: #444;
    background: rgba(255,255,255,0.8);
    padding: 2px 6px;
    border-radius: 4px;
    z-index: 500;
  }

  .map-attribution a,
  .legal-link {
    color: var(--color-blue);
    text-decoration: none;
  }

  .legal-link {
    background: none;
    border: none;
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    padding: 0;
  }

  .legal-link:hover { text-decoration: underline; }

  /* Floating top bar */
  .top-bar {
    position: absolute;
    top: 16px;
    left: 16px;
    right: 16px;
    z-index: 600;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  }

  .search-container,
  .chips-row {
    pointer-events: all;
  }

  .search-container { max-width: 460px; }

  /* FAB */
  .location-fab {
    position: absolute;
    bottom: 180px;
    right: 16px;
    z-index: 600;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--color-blue);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 12px rgba(11,185,230,0.4);
    transition: opacity 0.15s;
  }

  .location-fab:disabled { opacity: 0.6; cursor: not-allowed; }
  .location-fab:not(:disabled):hover { opacity: 0.9; }

  .fab-spinner {
    width: 22px;
    height: 22px;
    border: 3px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .location-error {
    position: absolute;
    bottom: 250px;
    right: 16px;
    z-index: 600;
    background: #fff;
    color: #d32f2f;
    font-size: 0.82rem;
    padding: 8px 12px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    max-width: 220px;
  }

  /* Desktop sidebar */
  .sidebar {
    display: none;
  }

  /* Mobile panel */
  .panel {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 600;
    background: #fff;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.12);
    height: 60px;
    display: flex;
    flex-direction: column;
    transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }

  .panel.panel-open {
    height: 45vh;
  }

  .panel-handle {
    flex-shrink: 0;
    height: 60px;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 0;
    width: 100%;
  }

  .handle-bar {
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: #d0d0d0;
  }

  .panel-count {
    font-size: 0.82rem;
    color: var(--color-grey);
    font-weight: 500;
  }

  /* ≥900px — show sidebar, hide panel */
  @media (min-width: 900px) {
    .top-bar {
      left: 332px;
    }

    .location-fab {
      bottom: 32px;
      right: 32px;
    }

    .location-error {
      bottom: 100px;
      right: 32px;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 16px;
      left: 16px;
      bottom: 16px;
      width: 300px;
      z-index: 600;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.14);
      overflow: hidden;
    }

    .sidebar-header {
      flex-shrink: 0;
      padding: 14px 16px 10px;
      border-bottom: 1px solid #f0f0f0;
    }

    .sidebar-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-grey);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .panel { display: none; }
  }
</style>
