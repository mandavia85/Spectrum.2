import { getPool, ensureTable } from './_db.js';
import { toTableName } from './_entities.js';

// Plain static filename on purpose. The original design used Next.js-style
// dynamic bracket routes (api/entities/[table]/[id].js), which are only
// reliably recognized when Vercel's Next.js framework preset is active.
// This project builds with the Vite preset, so those dynamic segments
// weren't being registered as functions at all — requests fell through to
// the SPA fallback and got index.html back instead of JSON. Static
// filenames with query-string parameters sidestep that entirely and work
// the same way regardless of framework detection.
export default async function handler(req, res) {
  const { table, id } = req.query;
  const tableName = toTableName(table);
  if (!tableName) return res.status(404).json({ error: `Unknown entity: ${table}` });
  if (!id) return res.status(400).json({ error: 'Missing id parameter.' });

  try {
    const pool = getPool();
    await ensureTable(pool, tableName);

    if (req.method === 'GET') {
      const { rows } = await pool.query(`SELECT data FROM ${tableName} WHERE id = $1`, [id]);
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0].data);
    }

    if (req.method === 'PUT') {
      const { rows } = await pool.query(`SELECT data FROM ${tableName} WHERE id = $1`, [id]);
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      const merged = { ...rows[0].data, ...req.body };
      await pool.query(
        `UPDATE ${tableName} SET data = $2, code = $3, updated_at = now() WHERE id = $1`,
        [id, merged, merged.code || id]
      );
      return res.status(200).json(merged);
    }

    if (req.method === 'DELETE') {
      await pool.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(`[api/entity?table=${table}&id=${id}]`, err);
    return res.status(500).json({ error: err.message });
  }
}
