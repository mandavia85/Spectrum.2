// Generic API client. Same function signatures as the previous localStorage
// version, so dataService.js (and every page that consumes it) needed no
// changes beyond making a couple of call sites await these now-async calls.
//
// Routes are flat, static filenames with query params (?table=, &id=)
// rather than dynamic bracket routes ([table].js) — Vercel only reliably
// registers bracket dynamic API routes under the Next.js framework preset;
// this project deploys under the Vite preset, so plain filenames are used
// to guarantee the functions are recognized regardless of preset.

async function apiFetch(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch { /* ignore non-JSON error bodies (e.g. an HTML error page) */ }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const storage = {
  async getAll(key) {
    return apiFetch(`/api/entities?table=${encodeURIComponent(key)}`);
  },
  async getById(key, id) {
    try {
      return await apiFetch(`/api/entity?table=${encodeURIComponent(key)}&id=${encodeURIComponent(id)}`);
    } catch {
      return null;
    }
  },
  async create(key, record) {
    return apiFetch(`/api/entities?table=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
  },
  async update(key, id, patch) {
    return apiFetch(`/api/entity?table=${encodeURIComponent(key)}&id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  },
  async remove(key, id) {
    await apiFetch(`/api/entity?table=${encodeURIComponent(key)}&id=${encodeURIComponent(id)}`, { method: 'DELETE' });
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
