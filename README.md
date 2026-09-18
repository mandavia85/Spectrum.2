# Meridian ERP — React Prototype

A modern, integrated ERP prototype inspired by SAP Business One UX principles, with a vTiger-style
login screen. Built with React, React Router and localStorage-backed mock services designed to be
swapped for real REST APIs without touching UI code.

## Demo credentials

```
Username: noman
Password: noman@123
```

Use "Forgot password" to see the full reset flow (a verification code is shown on-screen since this
prototype has no email backend).

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Build & deploy

```bash
npm run build
```

Deploy the project to Vercel (or any static host) — `vercel.json` includes the SPA rewrite rule
needed so client-side routes (e.g. `/master-data/material-master`) don't 404 on refresh.

## Architecture

```
src/
  components/
    layout/        Sidebar, Header, AppShell, ChangePasswordModal
    common/         DataTable, Modal/ConfirmDialog/StatusBadge/KPICard (UI.jsx),
                     DocumentFlow/ApprovalPanel/AuditTrail/AttachmentPanel
  pages/
    auth/           Login, ForgotPassword (identify → verify → reset → done)
    masterdata/      MaterialMaster, BusinessPartner, FixedAssets (bespoke),
                     GenericMaster + masterConfigs.js (config-driven, covers the
                     remaining 14 simple master data types)
    transactions/    PurchaseInvoice, SalesInvoice (full document screens with
                     document flow, approval, audit, attachments),
                     GenericTransaction + transactionConfigs.js (Payments, Bank,
                     Expense, Journal Entry, Stock Transfer)
    payroll/         Employees + Payroll Processing (mock gross/tax/net calc)
    users/           Users, Roles & Permissions matrix, Activity Log
    reports/         Category-based reports with CSV export and print
    administration/  Company, Branches, Departments, Numbering, Approval,
                     Tax/Currency shortcuts, System Settings
  services/
    storageService.js   Generic localStorage CRUD (promise-based — same
                         signatures a REST client would expose)
    authService.js       Login/session/forgot-reset/change password
    dataService.js       Entity services, audit trail, notifications,
                         dashboard KPI aggregation, global search
  data/mockData.js    Seed data for every module
  config/
    navigation.js     Single source of truth for the sidebar menu tree
    branding.js       Logo text, company name, login panel content
  context/            AuthContext, ToastContext
  routes/             AppRoutes, ProtectedRoute
```

## Database — Postgres (Neon via Vercel)

This project now runs on a real Postgres database, not `localStorage`. It works like this:

- **`/api`** — serverless functions (Vercel Node runtime) exposing a generic REST layer:
  - `GET/POST /api/entities/:table` — list / create
  - `GET/PUT/DELETE /api/entities/:table/:id` — read / update / delete one record
  - `POST /api/seed` — idempotent one-time seed; populates every table from `src/data/mockData.js`, skipping any table that already has rows
- **`src/services/storageService.js`** — the only file that changed on the frontend side. It now calls those API routes instead of `localStorage`, using the exact same function signatures (`getAll`, `getById`, `create`, `update`, `remove`) — so `dataService.js` and every page using it needed no changes beyond awaiting two previously-synchronous helpers (dashboard KPIs, global search).
- **Table shape**: every entity is stored generically as `id TEXT, code TEXT, data JSONB` (see `db/schema.sql`). This mirrors the record shapes already used throughout the app, so no data-shape migration was needed. Tables are auto-created on first request — no manual migration step required.

### Setup

1. In your Vercel project, enable Postgres (Storage tab) and connect it to the project — this injects `DATABASE_URL` / `POSTGRES_URL` into your environment automatically.
2. Deploy. On first page load, the app calls `POST /api/seed` automatically (see `initMockDatabase()` in `App.jsx`), which creates all 32 tables and populates them with the sample data.
3. That's it — every module now reads/writes real Postgres rows.

### Local development

`npm run dev` (plain Vite) will **not** serve the `/api` routes — Vite's dev server only serves the frontend. To test the API locally:

```bash
npm install -g vercel
vercel link      # link this folder to your Vercel project (one-time)
vercel env pull .env.local   # pulls DATABASE_URL etc. into a local, git-ignored file
vercel dev       # serves both the Vite frontend AND /api routes together
```

Without `vercel dev`, running `npm run dev` alone will show network errors on every screen (API calls with nowhere to go) — that's expected; deploy to Vercel or use `vercel dev` instead.

### What's still local-only

- **Authentication** (`authService.js`) — still a client-side credential check + session in `localStorage`. Wiring real auth (hashed passwords in the `users` table, server-verified sessions) is a natural next step but wasn't part of this pass, since it's more security-sensitive than the data layer.
- **Administration → Company Settings** — UI preferences only, intentionally kept per-browser in `localStorage` rather than a shared DB table.

## What's implemented

- Full auth flow: login, forgot password (identify → verify → reset → done), change password,
  logout, 30-minute session timeout, "remember me"
- Collapsible sidebar with flyouts, mobile drawer, active-route highlighting
- Global header search across Materials, Business Partners, Invoices, Employees, Assets
- Notification center with unread counts
- Dashboard KPIs computed live from the same data the modules mutate
- Material Master & Business Partner: full CRUD, search, sort, pagination, stock/balance drill-down
- Fixed Assets: lifecycle actions (Acquisition, Depreciation, Transfer, Revaluation, Disposal) with
  a generated depreciation schedule
- 14 additional master data types via one reusable, configuration-driven screen
- Purchase Invoice & Sales Invoice: line items with live total calculation, document flow bar,
  approval workflow (approve/reject/return with comments), attachments, per-document audit trail
- 6 additional transaction types (Payments, Bank, Expense, Journal Entry, Stock Transfer) via a
  reusable configuration-driven screen
- Payroll: employee master + payroll run calculator (gross → tax → net) with draft/paid states
- Users & Security: user list, role/permission matrix, global activity log
- Reports: 8 categories with CSV export and print
- Administration: company/branches/departments/numbering/approval/system settings, all persisted

## Notes on scope

This is a frontend prototype using `localStorage` as its data layer — there is no real backend,
authentication is not cryptographically secure, and reports/exports are simplified. The
architecture (service layer, reusable components, config-driven screens) is intentionally shaped
so a real SQL database and REST API can be attached with minimal UI rework.
