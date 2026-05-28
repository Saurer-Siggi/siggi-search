import express from 'express'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = resolve(__dirname, '../data/shops.json')
const DIST_DIR = resolve(__dirname, '../dist')
const PORT = process.env.PORT || 3000
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme'

const app = express()
app.use(express.json())

function readShops() {
  return JSON.parse(readFileSync(DATA_FILE, 'utf8'))
}

function writeShops(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || auth !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// --- Public API ---

app.get('/api/shops', (_req, res) => {
  res.json(readShops())
})

// --- Admin API ---

app.post('/api/auth', (req, res) => {
  const { password } = req.body
  if (password === ADMIN_PASSWORD) {
    res.json({ ok: true })
  } else {
    res.status(401).json({ error: 'Wrong password' })
  }
})

app.post('/api/shops', requireAuth, (req, res) => {
  const data = readShops()
  const shop = req.body
  const nextId = data.shops.length > 0 ? Math.max(...data.shops.map((s) => s.id)) + 1 : 1
  const newShop = { id: nextId, ...shop }
  data.shops.push(newShop)
  writeShops(data)
  res.status(201).json(newShop)
})

app.delete('/api/shops/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id, 10)
  const data = readShops()
  const before = data.shops.length
  data.shops = data.shops.filter((s) => s.id !== id)
  if (data.shops.length === before) {
    return res.status(404).json({ error: 'Shop not found' })
  }
  writeShops(data)
  res.status(204).end()
})

// --- Static frontend ---
// In production the built Svelte app lives in dist/
// In dev mode Vite handles static serving; this server only handles /api/*
try {
  const { createRequire } = await import('module')
  const require = createRequire(import.meta.url)
  const { statSync } = await import('fs')
  statSync(DIST_DIR)
  app.use(express.static(DIST_DIR))
  // SPA fallback — all non-API routes serve index.html
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(resolve(DIST_DIR, 'index.html'))
  })
} catch {
  // dist/ not built yet (dev mode) — Vite proxies /api to this server
}

app.listen(PORT, () => {
  console.log(`Siggi Search server running on http://localhost:${PORT}`)
  if (ADMIN_PASSWORD === 'changeme') {
    console.warn('⚠  ADMIN_PASSWORD is not set — using default "changeme". Set it via env var before deploying.')
  }
})
