import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json({ limit: '1mb' }));

// Setup Postgres connection
const { Pool } = pg;
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const pool = hasDatabaseUrl
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
  : null;

// In-memory fallback for local development when no DATABASE_URL is set
let memoryState = null;

// Ensure table exists
async function ensureTable() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_state (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

ensureTable().catch((err) => {
  console.error('Failed to ensure tables exist', err);
});

// API routes for getting/saving entire app state
app.get('/api/state', async (req, res) => {
  try {
    if (!pool) {
      if (!memoryState) return res.status(404).json({ error: 'No state found' });
      return res.json(memoryState);
    }
    const result = await pool.query('SELECT data FROM app_state WHERE id = $1', ['default']);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'No state found' });
    }
    res.json(result.rows[0].data);
  } catch (err) {
    console.error('GET /api/state error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/state', async (req, res) => {
  try {
    const data = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Invalid body' });
    }
    if (!pool) {
      memoryState = data;
      return res.status(204).end();
    }
    await pool.query(
      `INSERT INTO app_state (id, data) VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      ['default', data]
    );
    res.status(204).end();
  } catch (err) {
    console.error('PUT /api/state error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});