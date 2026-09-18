// Generic API client. Same function signatures as the previous localStorage
// version, so dataService.js (and every page that consumes it) needed no
// changes beyond making a couple of call sites await these now-async calls.

const API_BASE = '/api/entities';

async function apiFetch(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch { /* ignore non-JSON error bodies */ }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const storage = {
  async getAll(key) {
    return apiFetch(`${API_BASE}/${key}`);
  },
  async getById(key, id) {
    try {
      return await apiFetch(`${API_BASE}/${key}/${id}`);
    } catch {
      return null;
    }
  },
  async create(key, record) {
    return apiFetch(`${API_BASE}/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
  },
  async update(key, id, patch) {
    return apiFetch(`${API_BASE}/${key}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  },
  async remove(key, id) {
    await apiFetch(`${API_BASE}/${key}/${id}`, { method: 'DELETE' });
    return true;
  },
};

export function nextId(prefix, list) {
  const nums = list
    .map((r) => parseInt(String(r.code || r.id || '').replace(/\D/g, ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 1000;
  return `${prefix}-${max + 1}`;
}
