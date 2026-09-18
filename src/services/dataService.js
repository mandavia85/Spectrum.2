import { storage, nextId } from './storageService';

// Mock data now lives server-side (api/seed.js reads the same source file
// and seeds Postgres on first call). initMockDatabase just triggers that
// seed endpoint — it's idempotent, so calling it on every app load is safe;
// tables that already have rows are skipped.
export async function initMockDatabase() {
  try {
    const res = await fetch('/api/seed', { method: 'POST' });
    if (!res.ok) throw new Error(`Seed request failed (${res.status})`);
  } catch (err) {
    console.error('Database seed failed — check DATABASE_URL is set in your Vercel project.', err);
  }
}

// ---- Generic entity factory ----
function makeEntityService(key, codePrefix) {
  return {
    list: () => storage.getAll(key),
    get: (id) => storage.getById(key, id),
    async create(record) {
      const all = await storage.getAll(key);
      const id = record.id || nextId(codePrefix, all);
      const toSave = { ...record, id, code: record.code || id };
      return storage.create(key, toSave);
    },
    update: (id, patch) => storage.update(key, id, patch),
    remove: (id) => storage.remove(key, id),
  };
}

export const materialGroupService = makeEntityService('materialGroups', 'MG');
export const materialService = makeEntityService('materials', 'MAT');
export const businessPartnerService = makeEntityService('businessPartners', 'BP');
export const warehouseService = makeEntityService('warehouses', 'WH');
export const binLocationService = makeEntityService('binLocations', 'BIN');
export const uomService = makeEntityService('uom', 'U');
export const uomConversionService = makeEntityService('uomConversion', 'UC');
export const currencyService = makeEntityService('currencies', 'CUR');
export const exchangeRateService = makeEntityService('exchangeRates', 'ER');
export const paymentTermsService = makeEntityService('paymentTerms', 'PT');
export const taxMasterService = makeEntityService('taxMaster', 'TX');
export const costCenterService = makeEntityService('costCenters', 'CC');
export const profitCenterService = makeEntityService('profitCenters', 'PC');
export const bankMasterService = makeEntityService('bankMaster', 'BNK');
export const assetClassService = makeEntityService('assetClass', 'AC');
export const fixedAssetService = makeEntityService('fixedAssets', 'FA');
export const expenseMasterService = makeEntityService('expenseMaster', 'EX');
export const chartOfAccountsService = makeEntityService('chartOfAccounts', 'GL');

export const purchaseInvoiceService = makeEntityService('purchaseInvoices', 'PI');
export const salesInvoiceService = makeEntityService('salesInvoices', 'SI');
export const paymentsMadeService = makeEntityService('paymentsMade', 'PM');
export const paymentsReceivedService = makeEntityService('paymentsReceived', 'PR');
export const bankTransactionService = makeEntityService('bankTransactions', 'BT');
export const expenseTransactionService = makeEntityService('expenseTransactions', 'ET');
export const journalEntryService = makeEntityService('journalEntries', 'JE');
export const stockTransferService = makeEntityService('stockTransfers', 'ST');

export const employeeService = makeEntityService('employees', 'EMP');
export const payrollRunService = makeEntityService('payrollRuns', 'PR-RUN');
export const userService = makeEntityService('users', 'USR');

// ---- Roles (matrix, no single id key needed but kept consistent) ----
export const roleService = {
  list: () => storage.getAll('roles'),
};

// ---- Notifications ----
export const notificationService = {
  list: () => storage.getAll('notifications'),
  async markRead(id) {
    return storage.update('notifications', id, { read: true });
  },
};

// ---- Audit Trail ----
export const auditService = {
  list: () => storage.getAll('auditLog'),
  async record({ user, module, document, action, previousValue, newValue }) {
    const all = await storage.getAll('auditLog');
    const entry = {
      id: 'AUD' + String(all.length + 1).padStart(3, '0'),
      user,
      module,
      document,
      action,
      previousValue,
      newValue,
      timestamp: new Date().toISOString(),
    };
    return storage.create('auditLog', entry);
  },
  forDocument: async (document) => {
    const all = await storage.getAll('auditLog');
    return all.filter((a) => a.document === document);
  },
};

// ---- Dashboard aggregation (reads live from the same stores modules mutate) ----
export async function computeDashboardKpis() {
  const [bp, materials, pInv, sInv, payroll, assets] = await Promise.all([
    storage.getAll('businessPartners'),
    storage.getAll('materials'),
    storage.getAll('purchaseInvoices'),
    storage.getAll('salesInvoices'),
    storage.getAll('payrollRuns'),
    storage.getAll('fixedAssets'),
  ]);

  const customers = bp.filter((b) => b.type === 'Customer');
  const suppliers = bp.filter((b) => b.type === 'Supplier');

  const totalSales = sInv.reduce((s, i) => s + (i.grandTotal || 0), 0);
  const totalPurchases = pInv.reduce((s, i) => s + (i.grandTotal || 0), 0);
  const receivables = sInv.reduce((s, i) => s + (i.outstanding || 0), 0);
  const payables = pInv.reduce((s, i) => s + (i.outstanding || 0), 0);
  const lowStock = materials.filter((m) => m.stockOnHand <= m.reorderLevel);
  const inventoryValue = materials.reduce((s, m) => s + m.stockOnHand * m.purchasePrice, 0);
  const payrollCost = payroll
    .filter((p) => p.period === 'September 2026')
    .reduce((s, p) => s + p.net, 0);
  const assetBookValue = assets.reduce((s, a) => s + (a.currentBookValue || 0), 0);
  const pendingApprovals =
    pInv.filter((i) => i.approvalStatus === 'Pending').length +
    sInv.filter((i) => i.approvalStatus === 'Pending').length;

  return {
    customerCount: customers.length,
    supplierCount: suppliers.length,
    totalSales,
    totalPurchases,
    receivables,
    payables,
    lowStockCount: lowStock.length,
    lowStock,
    inventoryValue,
    payrollCost,
    assetBookValue,
    pendingApprovals,
    salesInvoiceCount: sInv.length,
    purchaseInvoiceCount: pInv.length,
    recentSales: [...sInv].sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate)).slice(0, 5),
    recentPurchases: [...pInv].sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate)).slice(0, 5),
  };
}

// ---- Global search across modules ----
export async function globalSearch(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results = [];

  const [materials, partners, pInv, sInv, employees, assets] = await Promise.all([
    storage.getAll('materials'),
    storage.getAll('businessPartners'),
    storage.getAll('purchaseInvoices'),
    storage.getAll('salesInvoices'),
    storage.getAll('employees'),
    storage.getAll('fixedAssets'),
  ]);

  materials.forEach((m) => {
    if (m.code.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)) {
      results.push({ module: 'Materials', label: `${m.code} — ${m.name}`, route: '/master-data/material-master' });
    }
  });
  partners.forEach((b) => {
    if (b.code.toLowerCase().includes(q) || b.name.toLowerCase().includes(q)) {
      results.push({ module: 'Business Partners', label: `${b.code} — ${b.name}`, route: '/master-data/business-partner' });
    }
  });
  pInv.forEach((i) => {
    if (i.docNo.toLowerCase().includes(q)) {
      results.push({ module: 'Purchase Invoices', label: i.docNo, route: '/transactions/purchase-invoice' });
    }
  });
  sInv.forEach((i) => {
    if (i.docNo.toLowerCase().includes(q)) {
      results.push({ module: 'Sales Invoices', label: i.docNo, route: '/transactions/sales-invoice' });
    }
  });
  employees.forEach((e) => {
    if (e.name.toLowerCase().includes(q) || e.empId.toLowerCase().includes(q)) {
      results.push({ module: 'Employees', label: `${e.empId} — ${e.name}`, route: '/payroll' });
    }
  });
  assets.forEach((a) => {
    if (a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)) {
      results.push({ module: 'Fixed Assets', label: `${a.code} — ${a.name}`, route: '/master-data/fixed-assets' });
    }
  });

  return results.slice(0, 20);
}
