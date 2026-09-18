import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { computeDashboardKpis } from '../services/dataService';
import { KPICard, StatusBadge } from '../components/common/UI';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function currency(n) {
  return '$' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    computeDashboardKpis().then(setKpis).catch((err) => console.error('Failed to load dashboard KPIs', err));
  }, []);

  if (!kpis) return null;

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.displayName?.split(' ')[0]}</h1>
          <p>Here is what's happening across your business today.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <KPICard label="Total Sales" value={currency(kpis.totalSales)} sub={`${kpis.salesInvoiceCount} invoices`} />
        <KPICard label="Total Purchases" value={currency(kpis.totalPurchases)} sub={`${kpis.purchaseInvoiceCount} invoices`} />
        <KPICard label="Receivables" value={currency(kpis.receivables)} tone="warning" sub="Outstanding from customers" />
        <KPICard label="Payables" value={currency(kpis.payables)} tone="warning" sub="Outstanding to suppliers" />
        <KPICard label="Inventory Value" value={currency(kpis.inventoryValue)} sub="At purchase cost" />
        <KPICard label="Low Stock Items" value={kpis.lowStockCount} tone={kpis.lowStockCount ? 'danger' : 'success'} sub="At or below reorder level" />
        <KPICard label="Payroll Cost (Sep)" value={currency(kpis.payrollCost)} sub="Net pay, current period" />
        <KPICard label="Fixed Asset Book Value" value={currency(kpis.assetBookValue)} sub="Net of depreciation" />
      </div>

      <div className="dashboard-grid">
        <div className="card dashboard-panel">
          <div className="dashboard-panel-header">
            <h3 className="section-title">Recent Sales Invoices</h3>
            <button className="btn btn-sm" onClick={() => navigate('/transactions/sales-invoice')}>View all</button>
          </div>
          <table className="mini-table">
            <thead><tr><th>Doc No</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {kpis.recentSales.map((s) => (
                <tr key={s.id} onClick={() => navigate('/transactions/sales-invoice')}>
                  <td>{s.docNo}</td>
                  <td>{s.customerId}</td>
                  <td>{currency(s.grandTotal)}</td>
                  <td><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card dashboard-panel">
          <div className="dashboard-panel-header">
            <h3 className="section-title">Recent Purchase Invoices</h3>
            <button className="btn btn-sm" onClick={() => navigate('/transactions/purchase-invoice')}>View all</button>
          </div>
          <table className="mini-table">
            <thead><tr><th>Doc No</th><th>Vendor</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {kpis.recentPurchases.map((p) => (
                <tr key={p.id} onClick={() => navigate('/transactions/purchase-invoice')}>
                  <td>{p.docNo}</td>
                  <td>{p.vendorId}</td>
                  <td>{currency(p.grandTotal)}</td>
                  <td><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card dashboard-panel">
          <div className="dashboard-panel-header">
            <h3 className="section-title">Low Stock Alerts</h3>
            <button className="btn btn-sm" onClick={() => navigate('/master-data/material-master')}>Manage materials</button>
          </div>
          {kpis.lowStock.length === 0 ? (
            <p style={{ fontSize: 12.5, color: 'var(--slate-400)' }}>All materials are above reorder level.</p>
          ) : (
            <table className="mini-table">
              <thead><tr><th>Material</th><th>On Hand</th><th>Reorder Level</th></tr></thead>
              <tbody>
                {kpis.lowStock.map((m) => (
                  <tr key={m.id} onClick={() => navigate('/master-data/material-master')}>
                    <td>{m.code} — {m.name}</td>
                    <td>{m.stockOnHand} {m.uom}</td>
                    <td>{m.reorderLevel} {m.uom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card dashboard-panel">
          <div className="dashboard-panel-header">
            <h3 className="section-title">Pending Approvals</h3>
          </div>
          <div className="pending-approval-count">{kpis.pendingApprovals}</div>
          <p style={{ fontSize: 12.5, color: 'var(--slate-500)', margin: '4px 0 0' }}>
            Transactions awaiting your review across Purchase and Sales invoices.
          </p>
        </div>
      </div>
    </div>
  );
}
