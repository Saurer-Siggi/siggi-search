<script>
  import { fetchShops, createShop, deleteShop, geocodeAddress } from '../lib/api.js'

  let password = $state(sessionStorage.getItem('admin_token') || '')
  let authed = $state(!!sessionStorage.getItem('admin_token'))
  let loginError = $state('')
  let loginLoading = $state(false)

  let shops = $state([])
  let loadError = $state('')

  // Add form state
  let form = $state({ name: '', type: 'bar', address: '', zipCode: '', city: '', googleMapsUrl: '' })
  let formError = $state('')
  let formLoading = $state(false)
  let formSuccess = $state('')

  async function login() {
    loginLoading = true
    loginError = ''
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) throw new Error('Falsches Passwort')
      sessionStorage.setItem('admin_token', password)
      authed = true
      loadShops()
    } catch (e) {
      loginError = e.message
    } finally {
      loginLoading = false
    }
  }

  async function loadShops() {
    try {
      shops = await fetchShops()
      loadError = ''
    } catch (e) {
      loadError = e.message
    }
  }

  async function handleDelete(id) {
    if (!confirm('Standort wirklich löschen?')) return
    try {
      await deleteShop(id, password)
      shops = shops.filter((s) => s.id !== id)
    } catch (e) {
      alert('Fehler: ' + e.message)
    }
  }

  async function handleAdd() {
    formError = ''
    formSuccess = ''
    formLoading = true
    try {
      // Geocode the address to get coordinates
      const query = `${form.address}, ${form.zipCode} ${form.city}`
      const results = await geocodeAddress(query)
      if (!results.length) throw new Error('Adresse konnte nicht gefunden werden. Bitte prüfe die Eingabe.')
      const { lat, lon } = results[0]

      const newShop = await createShop(
        {
          name: form.name,
          type: form.type,
          address: form.address,
          zipCode: form.zipCode,
          city: form.city,
          latitude: lat,
          longitude: lon,
          googleMapsUrl: form.googleMapsUrl,
        },
        password,
      )
      shops = [...shops, newShop]
      form = { name: '', type: 'bar', address: '', zipCode: '', city: '', googleMapsUrl: '' }
      formSuccess = `"${newShop.name}" wurde hinzugefügt.`
    } catch (e) {
      formError = e.message
    } finally {
      formLoading = false
    }
  }

  function logout() {
    sessionStorage.removeItem('admin_token')
    authed = false
    password = ''
    shops = []
  }

  $effect(() => {
    if (authed) loadShops()
  })
</script>

<div class="admin-page">
  <header class="admin-header">
    <a href="/" class="back-link">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
      Zurück zur Karte
    </a>
    <div class="header-title">
      <img src="/assets/logo_frei.png" alt="Saurer Siggi" class="header-logo" />
      <h1>Admin</h1>
    </div>
    {#if authed}
      <button class="logout-btn" onclick={logout}>Abmelden</button>
    {:else}
      <div></div>
    {/if}
  </header>

  <main class="admin-main">
    {#if !authed}
      <div class="login-card">
        <h2>Anmelden</h2>
        <p class="login-hint">Passwort eingeben um Standorte zu verwalten.</p>
        <form onsubmit={(e) => { e.preventDefault(); login() }} class="login-form">
          <input
            type="password"
            placeholder="Passwort"
            bind:value={password}
            class="input"
            required
          />
          <button type="submit" class="btn-primary" disabled={loginLoading}>
            {loginLoading ? 'Prüfe…' : 'Anmelden'}
          </button>
        </form>
        {#if loginError}
          <p class="error">{loginError}</p>
        {/if}
      </div>

    {:else}
      <section class="card">
        <h2>Neuen Standort hinzufügen</h2>
        <form onsubmit={(e) => { e.preventDefault(); handleAdd() }} class="add-form">
          <div class="form-row">
            <div class="field">
              <label for="name">Name</label>
              <input id="name" type="text" bind:value={form.name} class="input" required placeholder="z.B. Bar zum Siggi" />
            </div>
            <div class="field field-narrow">
              <label for="type">Typ</label>
              <select id="type" bind:value={form.type} class="input">
                <option value="bar">Bar & Club</option>
                <option value="retail">Geschäft</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="field field-grow">
              <label for="address">Straße & Nr.</label>
              <input id="address" type="text" bind:value={form.address} class="input" required placeholder="Königstraße 1" />
            </div>
            <div class="field field-narrow">
              <label for="zip">PLZ</label>
              <input id="zip" type="text" bind:value={form.zipCode} class="input" required placeholder="70173" maxlength="5" />
            </div>
            <div class="field">
              <label for="city">Stadt</label>
              <input id="city" type="text" bind:value={form.city} class="input" required placeholder="Stuttgart" />
            </div>
          </div>

          <div class="field">
            <label for="gmaps">Google Maps URL</label>
            <input id="gmaps" type="url" bind:value={form.googleMapsUrl} class="input" placeholder="https://maps.google.com/?q=…" />
          </div>

          <p class="hint">Koordinaten werden automatisch per Adresse ermittelt.</p>

          {#if formError}<p class="error">{formError}</p>{/if}
          {#if formSuccess}<p class="success">{formSuccess}</p>{/if}

          <button type="submit" class="btn-primary" disabled={formLoading}>
            {formLoading ? 'Wird hinzugefügt…' : 'Standort hinzufügen'}
          </button>
        </form>
      </section>

      <section class="card">
        <h2>Standorte ({shops.length})</h2>
        {#if loadError}
          <p class="error">{loadError}</p>
        {:else if shops.length === 0}
          <p class="empty-hint">Keine Standorte vorhanden.</p>
        {:else}
          <ul class="shop-list">
            {#each shops as shop (shop.id)}
              <li class="shop-row">
                <img
                  src="/assets/{shop.type === 'bar' ? 'shot' : 'bottle'}_full.png"
                  alt={shop.type}
                  class="shop-icon"
                />
                <div class="shop-info">
                  <span class="shop-name">{shop.name}</span>
                  <span class="shop-sub">{shop.address}, {shop.zipCode} {shop.city}</span>
                  <span class="shop-coords">{shop.latitude.toFixed(5)}, {shop.longitude.toFixed(5)}</span>
                </div>
                <button class="delete-btn" onclick={() => handleDelete(shop.id)} title="Löschen">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                  </svg>
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </section>
    {/if}
  </main>
</div>

<style>
  .admin-page {
    min-height: 100vh;
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
  }

  .admin-header {
    background: var(--color-primary);
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }

  .back-link {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #fff;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .back-link:hover { opacity: 0.85; }

  .header-title {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .header-logo { height: 32px; }

  .admin-header h1 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
  }

  .logout-btn {
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.4);
    color: #fff;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 0.85rem;
    cursor: pointer;
    font-family: inherit;
  }

  .logout-btn:hover { background: rgba(255,255,255,0.3); }

  .admin-main {
    flex: 1;
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .card {
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.08);
  }

  .card h2 {
    margin: 0 0 18px;
    font-size: 1.05rem;
    font-weight: 700;
  }

  .login-card {
    background: #fff;
    border-radius: 16px;
    padding: 32px 24px;
    max-width: 380px;
    width: 100%;
    margin: 40px auto;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    text-align: center;
  }

  .login-card h2 { margin: 0 0 8px; font-size: 1.3rem; }
  .login-hint { color: var(--color-grey); font-size: 0.9rem; margin: 0 0 20px; }

  .login-form { display: flex; flex-direction: column; gap: 12px; }

  .add-form { display: flex; flex-direction: column; gap: 14px; }

  .form-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
    min-width: 140px;
  }

  .field-narrow { flex: 0 0 100px; min-width: 80px; }
  .field-grow { flex: 2; }

  label {
    font-size: 0.82rem;
    font-weight: 500;
    color: #444;
  }

  .input {
    padding: 9px 12px;
    border: 1.5px solid #e0e0e0;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.92rem;
    outline: none;
    transition: border-color 0.15s;
    background: #fff;
    width: 100%;
    box-sizing: border-box;
  }

  .input:focus { border-color: var(--color-primary); }

  select.input { cursor: pointer; }

  .hint {
    font-size: 0.8rem;
    color: var(--color-grey);
    margin: -6px 0 0;
  }

  .btn-primary {
    padding: 10px 24px;
    background: var(--color-primary);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
    align-self: flex-start;
  }

  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-primary:not(:disabled):hover { opacity: 0.9; }

  .error { color: #d32f2f; font-size: 0.88rem; margin: 0; }
  .success { color: #2e7d32; font-size: 0.88rem; margin: 0; }

  .shop-list { list-style: none; margin: 0; padding: 0; }

  .shop-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .shop-row:last-child { border-bottom: none; }

  .shop-icon { width: 28px; height: 28px; object-fit: contain; flex-shrink: 0; }

  .shop-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .shop-name { font-weight: 500; font-size: 0.92rem; }
  .shop-sub { font-size: 0.8rem; color: var(--color-grey); }
  .shop-coords { font-size: 0.75rem; color: #bbb; font-family: monospace; }

  .delete-btn {
    background: none;
    border: none;
    color: #bbb;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    transition: color 0.15s, background 0.15s;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .delete-btn:hover { color: #d32f2f; background: #fff0f0; }

  .empty-hint { color: var(--color-grey); font-size: 0.9rem; text-align: center; padding: 16px 0; margin: 0; }
</style>
