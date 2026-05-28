<script>
  import { formatDistance } from '../lib/geo.js'

  let { shops = [], selectedId = null, onSelectShop } = $props()

  function typeLabel(type) {
    return type === 'bar' ? 'Bar & Club' : 'Geschäft'
  }
</script>

<ul class="shop-list">
  {#each shops as shop (shop.id)}
    <li class="shop-item" class:selected={shop.id === selectedId}>
      <button class="shop-btn" onclick={() => onSelectShop?.(shop.id)}>
        <img
          class="shop-icon"
          src="/assets/{shop.type === 'bar' ? 'shot' : 'bottle'}_{shop.id === selectedId ? 'full' : 'empty'}.png"
          alt={typeLabel(shop.type)}
        />
        <div class="shop-info">
          <span class="shop-name">{shop.name}</span>
          <span class="shop-address">{shop.address}, {shop.zipCode} {shop.city}</span>
          {#if shop.distanceKm != null}
            <span class="shop-distance">{formatDistance(shop.distanceKm)} entfernt</span>
          {/if}
        </div>
      </button>
      {#if shop.googleMapsUrl}
        <a
          class="maps-link"
          href={shop.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="In Google Maps öffnen"
          aria-label="In Google Maps öffnen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </a>
      {/if}
    </li>
  {:else}
    <li class="shop-empty">Keine Standorte gefunden.</li>
  {/each}
</ul>

<style>
  .shop-list {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    flex: 1;
  }

  .shop-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.15s;
  }

  .shop-item.selected {
    background: #fff8e0;
    border-left: 3px solid var(--color-primary);
  }

  .shop-btn {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: none;
    border: none;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
    outline: none;
    min-width: 0;
  }

  .shop-btn:hover,
  .shop-btn:focus-visible {
    background: #fef9ec;
  }

  .shop-icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    object-fit: contain;
  }

  .maps-link { padding-right: 12px; }

  .shop-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .shop-name {
    font-weight: 500;
    font-size: 0.95rem;
    color: #1a1a1a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .shop-address {
    font-size: 0.8rem;
    color: var(--color-grey);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .shop-distance {
    font-size: 0.78rem;
    color: var(--color-blue);
    font-weight: 500;
  }

  .maps-link {
    flex-shrink: 0;
    color: var(--color-grey);
    transition: color 0.15s;
    display: flex;
    align-items: center;
  }

  .maps-link:hover {
    color: var(--color-blue);
  }

  .shop-empty {
    padding: 24px 16px;
    color: var(--color-grey);
    text-align: center;
    font-size: 0.9rem;
  }
</style>
