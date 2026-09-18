// Generic localStorage persistence layer.
// Designed so each function can later be swapped for a real REST call
// without changing the calling code (same signatures, promise-based).

const NS = 'erp_';

function readRaw(key, fallback) {
  try {
    const raw = localStorage.getItem(NS + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeRaw(key, value) {
  localStorage.setItem(NS + key, JSON.stringify(value));
}

/** Ensure a collection exists in localStorage, seeding it on first run. */
export function ensureSeeded(key, seedData) {
  const existing = localStorage.getItem(NS + key);
  if (existing === null) {
    writeRaw(key, seedData);
  }
}

/** Simulate network latency for realism (kept short). */
const delay = (ms = 120) => new Promise((res) => setTimeout(res, ms));

export const storage = {
  async getAll(key) {
    await delay();
    return readRaw(key, []);
  },
  async getById(key, id) {
    await delay();
    const all = readRaw(key, []);
    return all.find((r) => r.id === id) || null;
  },
  async create(key, record) {
    await delay();
    const all = readRaw(key, []);
    all.unshift(record);
    writeRaw(key, all);
    return record;
  },
  async update(key, id, patch) {
    await delay();
    const all = readRaw(key, []);
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Record not found');
    all[idx] = { ...all[idx], ...patch };
    writeRaw(key, all);
    return all[idx];
  },
  async remove(key, id) {
    await delay();
    const all = readRaw(key, []);
    const filtered = all.filter((r) => r.id !== id);
    writeRaw(key, filtered);
    return true;
  },
  // Synchronous helpers used for cross-module dashboard aggregation
  getAllSync(key) {
    return readRaw(key, []);
  },
  setAllSync(key, value) {
    writeRaw(key, value);
  },
};

export function nextId(prefix, list) {
  const nums = list
    .map((r) => parseInt(String(r.code || r.id || '').replace(/\D/g, ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 1000;
  return `${prefix}-${max + 1}`;
}
