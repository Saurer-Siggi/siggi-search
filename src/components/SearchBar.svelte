<script>
  import { geocodeAddress } from '../lib/api.js'

  let { onLocationSelect } = $props()

  let query = $state('')
  let results = $state([])
  let loading = $state(false)
  let showResults = $state(false)

  let debounceTimer

  async function handleInput() {
    clearTimeout(debounceTimer)
    if (query.trim().length < 3) {
      results = []
      showResults = false
      return
    }
    debounceTimer = setTimeout(async () => {
      loading = true
      try {
        results = await geocodeAddress(query)
        showResults = results.length > 0
      } catch {
        results = []
      } finally {
        loading = false
      }
    }, 300)
  }

  function selectResult(r) {
    query = r.displayName.split(',')[0]
    results = []
    showResults = false
    onLocationSelect?.({ lat: r.lat, lon: r.lon })
  }

  function handleBlur() {
    // Small delay so click on result registers first
    setTimeout(() => { showResults = false }, 150)
  }
</script>

<div class="search-wrapper">
  <a href="https://saurer-siggi.de/" target="_blank" rel="noopener noreferrer" class="logo-link">
    <img src="/assets/logo_frei.png" alt="Saurer Siggi" class="logo" />
  </a>

  <div class="input-wrap">
    <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    <input
      type="text"
      placeholder="Ort oder Adresse suchen…"
      bind:value={query}
      oninput={handleInput}
      onblur={handleBlur}
      onfocus={() => { if (results.length) showResults = true }}
      class="search-input"
    />
    {#if loading}
      <span class="spinner"></span>
    {/if}
  </div>

  {#if showResults}
    <ul class="results-list">
      {#each results as r}
        <li>
          <button class="result-item" onmousedown={() => selectResult(r)}>
            {r.displayName}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border-radius: 999px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.18);
    padding: 6px 12px 6px 8px;
    width: 100%;
  }

  .logo-link { display: flex; align-items: center; flex-shrink: 0; }
  .logo { height: 36px; width: auto; }

  .input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .search-icon { flex-shrink: 0; color: var(--color-grey); }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    font-family: inherit;
    font-size: 0.95rem;
    color: #1a1a1a;
    background: transparent;
    min-width: 0;
  }

  .search-input::placeholder { color: var(--color-grey); }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid #e0e0e0;
    border-top-color: var(--color-blue);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .results-list {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    list-style: none;
    margin: 0;
    padding: 6px 0;
    z-index: 1000;
    max-height: 240px;
    overflow-y: auto;
  }

  .result-item {
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 10px 16px;
    font-family: inherit;
    font-size: 0.88rem;
    color: #1a1a1a;
    cursor: pointer;
    line-height: 1.4;
  }

  .result-item:hover { background: #fef9ec; }
</style>
