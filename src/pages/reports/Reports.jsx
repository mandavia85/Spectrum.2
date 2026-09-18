import { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import {
  salesInvoiceService, purchaseInvoiceService, materialService, businessPartnerService,
  fixedAssetService, payrollRunService, expenseTransactionService, chartOfAccountsService,
} from '../../services/dataService';
import '../payroll/Payroll.css';

const CATEGORIES = ['Sales', 'Purchase', 'Inventory', 'Finance', 'Receivables / Payables', 'Fixed Assets', 'Payroll', 'Expenses'];

export default function Reports() {
  const toast = useToast();
  const [category, setCategory] = useState('Sales');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      salesInvoiceService.list(), purchaseInvoiceService.list(), materialService.list(),
      businessPartnerService.list(), fixedAssetService.list(), payrollRunService.list(),
      expenseTransactionService.list(), chartOfAccountsService.list(),
    ]).then(([sales, purchase, materials, bp, assets, payroll, expenses, gl]) => {
      setData({ sales, purchase, materials, bp, assets, payroll, expenses, gl });
      setLoading(false);
    });
  }, []);

  const exportCsv = (rows, filename) => {
    if (!rows.length) { toast.warning('No data to export.'); return; }
    const headers = Object.keys(rows[0]).filter((k) => typeof rows[0][k] !== 'object');
    const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast.success('Export downloaded.');
  };

  if (loading) return <div className="page-wrap"><p>Loading reports…</p></div>;

  const renderTable = (rows, columns, filename) => (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
        <button className="btn btn-sm" onClick={() => exportCsv(rows, filename)}>Export CSV</button>
        <button className="btn btn-sm" onClick={() => window.print()}>Print</button>
      </div>
      <table className="mini-table">
        <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: 30, color: 'var(--slate-400)' }}>No data available.</td></tr>
          ) : rows.map((r, i) => (
            <tr key={i}>{columns.map((c) => <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const money = (n) => `$${Number(n || 0).toLocaleString()}`;

  const reportBody = () => {
    switch (category) {
      case 'Sales':
        return renderTable(data.sales, [
          { key: 'docNo', label: 'Invoice' }, { key: 'postingDate', label: 'Date' },
          { key: 'customerId', label: 'Customer' }, { key: 'grandTotal', label: 'Amount', render: (r) => money(r.grandTotal) },
          { key: 'status', label: 'Status' },
        ], 'sales_report.csv');
      case 'Purchase':
        return renderTable(data.purchase, [
          { key: 'docNo', label: 'Invoice' }, { key: 'postingDate', label: 'Date' },
          { key: 'vendorId', label: 'Vendor' }, { key: 'grandTotal', label: 'Amount', render: (r) => money(r.grandTotal) },
          { key: 'status', label: 'Status' },
        ], 'purchase_report.csv');
      case 'Inventory':
        return renderTable(data.materials, [
          { key: 'code', label: 'Code' }, { key: 'name', label: 'Material' }, { key: 'stockOnHand', label: 'On Hand' },
          { key: 'reorderLevel', label: 'Reorder Level' },
          { key: 'value', label: 'Stock Value', render: (r) => money(r.stockOnHand * r.purchasePrice) },
        ], 'stock_report.csv');
      case 'Finance':
        return renderTable(data.gl, [
          { key: 'code', label: 'Account Code' }, { key: 'name', label: 'Account Name' }, { key: 'type', label: 'Type' }, { key: 'status', label: 'Status' },
        ], 'chart_of_accounts.csv');
      case 'Receivables / Payables': {
        const receivables = data.bp.filter((b) => b.type === 'Customer' && b.outstandingBalance > 0);
        const payables = data.bp.filter((b) => b.type === 'Supplier' && b.outstandingBalance > 0);
        return (
          <>
            <h4 style={{ fontSize: 13, margin: '4px 0 10px' }}>Customer Outstanding (Receivables)</h4>
            {renderTable(receivables, [
              { key: 'code', label: 'Code' }, { key: 'name', label: 'Customer' }, { key: 'outstandingBalance', label: 'Outstanding', render: (r) => money(r.outstandingBalance) },
            ], 'receivables.csv')}
            <h4 style={{ fontSize: 13, margin: '20px 0 10px' }}>Supplier Outstanding (Payables)</h4>
            {renderTable(payables, [
              { key: 'code', label: 'Code' }, { key: 'name', label: 'Supplier' }, { key: 'outstandingBalance', label: 'Outstanding', render: (r) => money(r.outstandingBalance) },
            ], 'payables.csv')}
          </>
        );
      }
      case 'Fixed Assets':
        return renderTable(data.assets, [
          { key: 'code', label: 'Asset Code' }, { key: 'name', label: 'Asset Name' },
          { key: 'acquisitionCost', label: 'Cost', render: (r) => money(r.acquisitionCost) },
          { key: 'accumulatedDepreciation', label: 'Accum. Depr.', render: (r) => money(r.accumulatedDepreciation) },
          { key: 'currentBookValue', label: 'Book Value', render: (r) => money(r.currentBookValue) },
        ], 'asset_register.csv');
      case 'Payroll':
        return renderTable(data.payroll, [
          { key: 'period', label: 'Period' }, { key: 'employeeId', label: 'Employee' },
          { key: 'gross', label: 'Gross', render: (r) => money(r.gross) }, { key: 'tax', label: 'Tax', render: (r) => money(r.tax) },
          { key: 'net', label: 'Net Pay', render: (r) => money(r.net) }, { key: 'status', label: 'Status' },
        ], 'payroll_summary.csv');
      case 'Expenses':
        return renderTable(data.expenses, [
          { key: 'date', label: 'Date' }, { key: 'payee', label: 'Payee' }, { key: 'category', label: 'Category' },
          { key: 'amount', label: 'Amount', render: (r) => money(r.amount) }, { key: 'approvalStatus', label: 'Approval' }, { key: 'paymentStatus', label: 'Payment' },
        ], 'expense_report.csv');
      default:
        return null;
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div><h1>Reports</h1><p>Drill into business data across every module with export and print support.</p></div>
      </div>

      <div className="tab-strip">
        {CATEGORIES.map((c) => (
          <button key={c} className={`tab-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      {reportBody()}
    </div>
  );
}
