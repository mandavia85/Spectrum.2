import { getPool, ensureTable } from './_db.js';
import { ENTITY_KEYS, toTableName } from './_entities.js';
import * as seed from '../src/data/mockData.js';

const registry = {
  materialGroups: seed.seedMaterialGroups,
  materials: seed.seedMaterials,
  businessPartners: seed.seedBusinessPartners,
  warehouses: seed.seedWarehouses,
  binLocations: seed.seedBinLocations,
  uom: seed.seedUOM,
  uomConversion: seed.seedUOMConversion,
  currencies: seed.seedCurrencies,
  exchangeRates: seed.seedExchangeRates,
  paymentTerms: seed.seedPaymentTerms,
  taxMaster: seed.seedTaxMaster,
  costCenters: seed.seedCostCenters,
  profitCenters: seed.seedProfitCenters,
  bankMaster: seed.seedBankMaster,
  assetClass: seed.seedAssetClass,
  fixedAssets: seed.seedFixedAssets,
  expenseMaster: seed.seedExpenseMaster,
  chartOfAccounts: seed.seedChartOfAccounts,
  purchaseInvoices: seed.seedPurchaseInvoices,
  salesInvoices: seed.seedSalesInvoices,
  paymentsMade: seed.seedPaymentsMade,
  paymentsReceived: seed.seedPaymentsReceived,
  bankTransactions: seed.seedBankTransactions,
  expenseTransactions: seed.seedExpenseTransactions,
  journalEntries: seed.seedJournalEntries,
  stockTransfers: seed.seedStockTransfers,
  employees: seed.seedEmployees,
  payrollRuns: seed.seedPayrollRuns,
  users: seed.seedUsers,
  roles: seed.seedRoles,
  notifications: seed.seedNotifications,
  auditLog: [],
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pool = getPool();
    const results = {};

    for (const key of ENTITY_KEYS) {
      const tableName = toTableName(key);
      await ensureTable(pool, tableName);

      const { rows: countRows } = await pool.query(`SELECT COUNT(*)::int AS count FROM ${tableName}`);
      if (countRows[0].count > 0) {
        results[key] = 'already seeded, skipped';
        continue;
      }

      const seedRows = registry[key] || [];
      let inserted = 0;
      for (let i = 0; i < seedRows.length; i++) {
        const rec = seedRows[i];
        const id = rec.id || rec.code || `${key}_${i + 1}`;
        await pool.query(
          `INSERT INTO ${tableName} (id, code, data) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
          [id, rec.code || id, { ...rec, id }]
        );
        inserted++;
      }
      results[key] = `seeded ${inserted} row(s)`;
    }

    return res.status(200).json({ ok: true, results });
  } catch (err) {
    console.error('[api/seed]', err);
    return res.status(500).json({ error: err.message });
  }
}
