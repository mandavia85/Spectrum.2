// Table identifiers can't be parameterized in SQL, so every request is
// checked against this whitelist before being interpolated into a query.
export const ENTITY_KEYS = [
  'materialGroups', 'materials', 'businessPartners', 'warehouses', 'binLocations',
  'uom', 'uomConversion', 'currencies', 'exchangeRates', 'paymentTerms', 'taxMaster',
  'costCenters', 'profitCenters', 'bankMaster', 'assetClass', 'fixedAssets',
  'expenseMaster', 'chartOfAccounts', 'purchaseInvoices', 'salesInvoices',
  'paymentsMade', 'paymentsReceived', 'bankTransactions', 'expenseTransactions',
  'journalEntries', 'stockTransfers', 'employees', 'payrollRuns', 'users',
  'roles', 'notifications', 'auditLog',
];

export function toTableName(key) {
  if (!ENTITY_KEYS.includes(key)) return null;
  return 'erp_' + key.replace(/([A-Z])/g, '_$1').toLowerCase();
}
