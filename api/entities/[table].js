import { getPool, ensureTable } from '../_db.js';
import { toTableName } from '../_entities.js';

export default async function handler(req, res) {
  const { table } = req.query;
  const tableName = toTableName(table);
  if (!tableName) return res.status(404).json({ error: `Unknown entity: ${table}` });

  try {
    const pool = getPool();
    await ensureTable(pool, tableName);

    if (req.method === 'GET') {
      const { rows } = await pool.query(`SELECT data FROM ${tableName} ORDER BY created_at DESC`);
      return res.status(200).json(rows.map((r) => r.data));
    }

    if (req.method === 'POST') {
      const record = req.body;
      if (!record || !record.id) return res.status(400).json({ error: 'Record must include an id.' });
      await pool.query(
        `INSERT INTO ${tableName} (id, code, data) VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET data = $3, code = $2, updated_at = now()`,
        [record.id, record.code || record.id, record]
      );
      return res.status(201).json(record);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(`[api/entities/${table}]`, err);
    return res.status(500).json({ error: err.message });
  }
}
