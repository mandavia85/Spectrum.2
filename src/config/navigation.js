// Top-level nav stays simple; depth lives inside each module (per ERP UX rules).
export const navigation = [
  { key: 'dashboard', label: 'Dashboard', icon: '▦', path: '/dashboard' },
  {
    key: 'master-data', label: 'Master Data', icon: '▤',
    children: [
      { label: 'Material Master', path: '/master-data/material-master' },
      { label: 'Material Groups', path: '/master-data/material-groups' },
      { label: 'Business Partner', path: '/master-data/business-partner' },
      { label: 'Expense Master', path: '/master-data/expense-master' },
      { label: 'Bank Master', path: '/master-data/bank-master' },
      { label: 'Fixed Assets', path: '/master-data/fixed-assets' },
      { label: 'Asset Class', path: '/master-data/asset-class' },
      { label: 'Tax Master', path: '/master-data/tax-master' },
      { label: 'Cost Center', path: '/master-data/cost-center' },
      { label: 'Profit Center', path: '/master-data/profit-center' },
      { label: 'Warehouse', path: '/master-data/warehouse' },
      { label: 'Bin Location', path: '/master-data/bin-location' },
      { label: 'UOM', path: '/master-data/uom' },
      { label: 'UOM Conversion', path: '/master-data/uom-conversion' },
      { label: 'Currency', path: '/master-data/currency' },
      { label: 'Exchange Rate', path: '/master-data/exchange-rate' },
      { label: 'Payment Terms', path: '/master-data/payment-terms' },
      { label: 'Chart of Accounts', path: '/master-data/chart-of-accounts' },
    ],
  },
  {
    key: 'transactions', label: 'Transactions', icon: '⇄',
    children: [
      { label: 'Purchase Invoice', path: '/transactions/purchase-invoice' },
      { label: 'Sales Invoice', path: '/transactions/sales-invoice' },
      { label: 'Payment Received', path: '/transactions/payment-received' },
      { label: 'Payment Made', path: '/transactions/payment-made' },
      { label: 'Bank', path: '/transactions/bank' },
      { label: 'Expense', path: '/transactions/expense' },
      { label: 'Journal Entry', path: '/transactions/journal-entry' },
      { label: 'Stock Transfer', path: '/transactions/stock-transfer' },
    ],
  },
  { key: 'payroll', label: 'Payroll', icon: '§', path: '/payroll' },
  { key: 'users', label: 'Users & Security', icon: '◎', path: '/users-security' },
  { key: 'reports', label: 'Reports', icon: '▥', path: '/reports' },
  { key: 'administration', label: 'Administration', icon: '⚙', path: '/administration' },
];

export function findBreadcrumb(pathname) {
  for (const item of navigation) {
    if (item.path === pathname) return [item.label];
    if (item.children) {
      const child = item.children.find((c) => pathname.startsWith(c.path));
      if (child) return [item.label, child.label];
    }
  }
  return ['Dashboard'];
}
