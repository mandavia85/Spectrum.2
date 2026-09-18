import pg from 'pg';

const { Pool } = pg;

let pool;

/**
 * Reuses a single pooled connection across invocations (important on
 * serverless — a new pool per request would exhaust Neon's connection limit).
 * Works with any of the env var names Vercel's Neon integration may set.
 */
export function getPool() {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING;

    if (!connectionString) {
      throw new Error(
        'No database connection string found. Expected one of DATABASE_URL, POSTGRES_URL, POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING in the environment.'
      );
    }

    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}

/**
 * Every ERP entity is stored as a simple id/code/data(JSONB) row.
 * This keeps the schema generic (mirrors the record shapes already used
 * throughout the React app) while still being real, queryable Postgres —
 * indexes, JSONB querying and relational joins can be layered on later
 * without changing the API contract the frontend already relies on.
 */
export async function ensureTable(pool, table) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${table} (
      id TEXT PRIMARY KEY,
      code TEXT,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  `);
}
