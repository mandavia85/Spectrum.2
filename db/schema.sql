-- Meridian ERP — Postgres schema reference
--
-- The API auto-creates these tables on first request (see api/_db.js),
-- so running this file manually is optional. It's here so the shape is
-- easy to inspect from the Neon SQL editor or any Postgres client.
--
-- Every ERP entity (materials, business partners, invoices, employees, ...)
-- is stored with the same generic shape: a stable id/code plus a JSONB
-- payload holding the full record. This mirrors the shape already used by
-- the React app end-to-end, so the frontend needed no data-shape changes
-- to move from localStorage to real Postgres — only the transport changed.
--
-- Table names follow erp_<snake_case_entity_key>, e.g.:
--   materials          -> erp_materials
--   businessPartners   -> erp_business_partners
--   purchaseInvoices   -> erp_purchase_invoices
-- See api/_entities.js for the full list of 32 entity keys.

CREATE TABLE IF NOT EXISTS erp_materials (
  id TEXT PRIMARY KEY,
  code TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Optional: index JSONB fields you query often, e.g.
-- CREATE INDEX IF NOT EXISTS erp_materials_status_idx ON erp_materials ((data->>'status'));
-- CREATE INDEX IF NOT EXISTS erp_business_partners_type_idx ON erp_business_partners ((data->>'type'));

-- Repeat the same CREATE TABLE shape for every other entity key if you
-- want to pre-provision the schema instead of relying on auto-creation.
