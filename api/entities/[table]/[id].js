import { getPool, ensureTable } from '../../_db.js';
import { toTableName } from '../../_entities.js';

export default async function handler(req, res) {
  const { table, id } = req.query;
  const tableName = toTableName(table);
  if (!tableName) return res.status(404).json({ error: `Unknown entity: ${table}` });

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
    console.error(`[api/entities/${table}/${id}]`, err);
    return res.status(500).json({ error: err.message });
  }
}
