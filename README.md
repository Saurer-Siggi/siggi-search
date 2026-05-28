# Siggi Search

Shop locator for **Saurer Siggi** — find nearby bars, clubs, and retail stores that carry the liqueur.

Built with Svelte + Vite, served by a small Node.js/Express server. Runs in a single Docker container behind Nginx Proxy Manager.

---

## Local Development

```bash
npm install
npm run dev
```

This starts both Vite (port 5173) and the Express API server (port 3000) concurrently. The Vite dev server proxies `/api` requests to the Express server automatically.

Open [http://localhost:5173](http://localhost:5173) for the map view.
Open [http://localhost:5173/admin](http://localhost:5173/admin) for the admin interface.

The default dev password is `changeme` (set `ADMIN_PASSWORD` env var to change it).

---

## Adding or Removing Locations

### Via the admin interface (recommended)

Navigate to `/admin` on the running app. Log in with your `ADMIN_PASSWORD`. From there you can:

- **Add** a location by entering its name, type (Bar/Club or Geschäft), address, ZIP, city, and an optional Google Maps URL. Coordinates are resolved automatically via geocoding — no manual lat/lng needed.
- **Remove** any location with the delete button.

Changes are saved immediately to the data volume on the server.

### Via `data/shops.json` directly

For bulk edits or initial seed data, edit `data/shops.json`:

```json
{
  "shops": [
    {
      "id": 1,
      "name": "Bar zum Siggi",
      "type": "bar",
      "address": "Königstraße 1",
      "zipCode": "70173",
      "city": "Stuttgart",
      "latitude": 48.7784,
      "longitude": 9.1800,
      "googleMapsUrl": "https://maps.google.com/?q=..."
    }
  ]
}
```

- `type` must be `"bar"` (shown with shot glass icon) or `"retail"` (shown with bottle icon)
- `id` must be a unique integer
- Commit and push — CI redeploys automatically

---

## Deployment (VPS with Nginx Proxy Manager)

### First-time setup on the VPS

```bash
# Create the app directory
mkdir -p /opt/siggi-search

# Create the .env file with your password
cat > /opt/siggi-search/.env <<EOF
ADMIN_PASSWORD=your-secure-password-here
EOF

# Copy docker-compose.yml to the server
scp docker-compose.yml user@your-server:/opt/siggi-search/

# Pull and start
cd /opt/siggi-search
docker compose pull
docker compose up -d
```

Then in **Nginx Proxy Manager**, add a proxy host:
- Domain: `search.saurer-siggi.de`
- Forward Hostname/IP: `localhost`
- Forward Port: `3000`
- Enable SSL with Let's Encrypt

### Deploying updates

Push to `main` — GitHub Actions will:

1. Build the Docker image
2. Push it to `ghcr.io/saurer-siggi/siggi-search:latest`
3. SSH into the VPS and run `docker compose pull && docker compose up -d`

**Required GitHub Secrets:**

| Secret | Value |
|--------|-------|
| `HETZNER_IP` | VPS IP address |
| `VPS_USER` | SSH username |
| `SSH_PRIVATE_KEY` | Private key for SSH access |

`GITHUB_TOKEN` is provided automatically for pushing to GHCR.

### Shop data persistence

Shop data is stored in a named Docker volume (`siggi_data`). It survives container restarts and image updates. If you want to reset to the seed data in `data/shops.json`:

```bash
docker compose down -v  # removes the volume — data will be lost
docker compose up -d
```

---

## Docker — local build and test

```bash
# Build
docker build -t siggi-search .

# Run (replace the password)
docker run -p 3000:3000 -e ADMIN_PASSWORD=secret siggi-search
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
siggi-search/
├── src/
│   ├── lib/
│   │   ├── api.js          # API calls (shops + Nominatim geocoding)
│   │   └── geo.js          # Haversine distance calculation
│   ├── components/
│   │   ├── Map.svelte      # Leaflet map with custom markers
│   │   ├── ShopList.svelte # Scrollable list with distance
│   │   ├── SearchBar.svelte
│   │   ├── FilterChips.svelte
│   │   └── LegalModal.svelte
│   ├── views/
│   │   ├── Home.svelte     # Map view (desktop sidebar + mobile panel)
│   │   └── Admin.svelte    # Password-protected CRUD UI
│   ├── App.svelte          # Path-based router (/ vs /admin)
│   ├── main.js
│   └── app.css             # Brand tokens + global reset
├── server/
│   └── index.js            # Express server (~80 lines)
├── data/
│   └── shops.json          # Seed data / local dev data
├── public/assets/          # PNG icons (logo, shot, bottle, location)
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Svelte 5 + Vite |
| Map | Leaflet.js + OpenStreetMap tiles |
| Geocoding | OSM Nominatim (client-side) |
| Backend | Node.js + Express |
| Persistence | JSON file on Docker volume |
| Container | Docker (node:22-alpine, multi-stage) |
| Reverse proxy | Nginx Proxy Manager (existing on VPS) |
| CI/CD | GitHub Actions → GHCR → SSH deploy |
