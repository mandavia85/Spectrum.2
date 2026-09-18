import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../services/storageService';
import '../payroll/Payroll.css';

const TABS = ['Company Settings', 'Branches', 'Departments', 'Financial Year & Period', 'Document Numbering', 'Approval Workflow', 'Tax & Currency', 'System Settings'];

const defaultSettings = {
  company: { name: 'Meridian Manufacturing Group', address: '4820 Industrial Pkwy, Fremont, CA', taxId: 'US-84-1029384', fiscalYearStart: '01-Jan' },
  branches: [{ id: 'BR1', name: 'Headquarters - Fremont', code: 'HQ' }, { id: 'BR2', name: 'East Coast Distribution', code: 'ECD' }],
  departments: [{ id: 'D1', name: 'Sales' }, { id: 'D2', name: 'Production' }, { id: 'D3', name: 'Administration' }, { id: 'D4', name: 'IT' }, { id: 'D5', name: 'Logistics' }],
  financialPeriod: { currentYear: '2026', currentPeriod: 'September', status: 'Open' },
  numbering: [
    { doc: 'Purchase Invoice', prefix: 'PI-', nextNumber: 10027 },
    { doc: 'Sales Invoice', prefix: 'SI-', nextNumber: 20043 },
    { doc: 'Payment Made', prefix: 'PM-', nextNumber: 3303 },
    { doc: 'Payment Received', prefix: 'PR-', nextNumber: 4403 },
    { doc: 'Journal Entry', prefix: 'JE-', nextNumber: 3 },
  ],
  approval: { purchaseThreshold: 25000, expenseThreshold: 2000, journalThreshold: 50000, levels: 2 },
  system: { sessionTimeoutMinutes: 30, dateFormat: 'DD-MMM-YYYY', defaultCurrency: 'USD' },
};

export default function Administration() {
  const toast = useToast();
  const [tab, setTab] = useState('Company Settings');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    storage.getAll('adminSettings').then((data) => {
      setSettings(Array.isArray(data) && data.length === 0 ? defaultSettings : data);
      if (Array.isArray(data) && data.length === 0) storage.setAllSync('adminSettings', defaultSettings);
    });
  }, []);

  const save = (patch) => {
    const updated = { ...settings, ...patch };
    setSettings(updated);
    storage.setAllSync('adminSettings', updated);
    toast.success('Settings saved.');
  };

  if (!settings) return null;

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div><h1>Administration</h1><p>Configure company-wide settings, numbering rules and approval policies.</p></div>
      </div>

      <div className="tab-strip">
        {TABS.map((t) => <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {tab === 'Company Settings' && (
        <div className="card" style={{ padding: 20 }}>
          <div className="form-grid">
            <div className="field"><label>Company Name</label><input value={settings.company.name} onChange={(e) => save({ company: { ...settings.company, name: e.target.value } })} /></div>
            <div className="field"><label>Tax ID</label><input value={settings.company.taxId} onChange={(e) => save({ company: { ...settings.company, taxId: e.target.value } })} /></div>
            <div className="field" style={{ gridColumn: '1 / -1' }}><label>Address</label><input value={settings.company.address} onChange={(e) => save({ company: { ...settings.company, address: e.target.value } })} /></div>
            <div className="field"><label>Fiscal Year Start</label><input value={settings.company.fiscalYearStart} onChange={(e) => save({ company: { ...settings.company, fiscalYearStart: e.target.value } })} /></div>
          </div>
        </div>
      )}

      {tab === 'Branches' && (
        <div className="card" style={{ padding: 16 }}>
          <table className="mini-table">
            <thead><tr><th>Code</th><th>Branch Name</th></tr></thead>
            <tbody>{settings.branches.map((b) => <tr key={b.id}><td>{b.code}</td><td>{b.name}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Departments' && (
        <div className="card" style={{ padding: 16 }}>
          <table className="mini-table">
            <thead><tr><th>Department</th></tr></thead>
            <tbody>{settings.departments.map((d) => <tr key={d.id}><td>{d.name}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Financial Year & Period' && (
        <div className="card" style={{ padding: 20 }}>
          <div className="form-grid">
            <div className="field"><label>Current Financial Year</label><input value={settings.financialPeriod.currentYear} onChange={(e) => save({ financialPeriod: { ...settings.financialPeriod, currentYear: e.target.value } })} /></div>
            <div className="field"><label>Current Period</label><input value={settings.financialPeriod.currentPeriod} onChange={(e) => save({ financialPeriod: { ...settings.financialPeriod, currentPeriod: e.target.value } })} /></div>
            <div className="field">
              <label>Period Status</label>
              <select value={settings.financialPeriod.status} onChange={(e) => save({ financialPeriod: { ...settings.financialPeriod, status: e.target.value } })}>
                <option>Open</option><option>Closed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {tab === 'Document Numbering' && (
        <div className="card" style={{ padding: 16 }}>
          <table className="mini-table">
            <thead><tr><th>Document Type</th><th>Prefix</th><th>Next Number</th></tr></thead>
            <tbody>
              {settings.numbering.map((n, i) => (
                <tr key={n.doc}>
                  <td>{n.doc}</td>
                  <td>
                    <input style={{ width: 70, padding: 4 }} value={n.prefix} onChange={(e) => {
                      const numbering = [...settings.numbering]; numbering[i] = { ...n, prefix: e.target.value }; save({ numbering });
                    }} />
                  </td>
                  <td>
                    <input type="number" style={{ width: 90, padding: 4 }} value={n.nextNumber} onChange={(e) => {
                      const numbering = [...settings.numbering]; numbering[i] = { ...n, nextNumber: Number(e.target.value) }; save({ numbering });
                    }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Approval Workflow' && (
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: 12.5, color: 'var(--slate-500)', marginTop: 0 }}>Documents above these thresholds require an additional approval level.</p>
          <div className="form-grid">
            <div className="field"><label>Purchase Approval Threshold ($)</label><input type="number" value={settings.approval.purchaseThreshold} onChange={(e) => save({ approval: { ...settings.approval, purchaseThreshold: Number(e.target.value) } })} /></div>
            <div className="field"><label>Expense Approval Threshold ($)</label><input type="number" value={settings.approval.expenseThreshold} onChange={(e) => save({ approval: { ...settings.approval, expenseThreshold: Number(e.target.value) } })} /></div>
            <div className="field"><label>Journal Entry Threshold ($)</label><input type="number" value={settings.approval.journalThreshold} onChange={(e) => save({ approval: { ...settings.approval, journalThreshold: Number(e.target.value) } })} /></div>
            <div className="field"><label>Approval Levels</label><input type="number" value={settings.approval.levels} onChange={(e) => save({ approval: { ...settings.approval, levels: Number(e.target.value) } })} /></div>
          </div>
        </div>
      )}

      {tab === 'Tax & Currency' && (
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: 13, marginBottom: 14 }}>Tax codes, currencies and exchange rates are managed centrally in Master Data:</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link className="btn" to="/master-data/tax-master">Open Tax Master →</Link>
            <Link className="btn" to="/master-data/currency">Open Currency →</Link>
            <Link className="btn" to="/master-data/exchange-rate">Open Exchange Rate →</Link>
          </div>
        </div>
      )}

      {tab === 'System Settings' && (
        <div className="card" style={{ padding: 20 }}>
          <div className="form-grid">
            <div className="field"><label>Session Timeout (minutes)</label><input type="number" value={settings.system.sessionTimeoutMinutes} onChange={(e) => save({ system: { ...settings.system, sessionTimeoutMinutes: Number(e.target.value) } })} /></div>
            <div className="field"><label>Date Format</label><input value={settings.system.dateFormat} onChange={(e) => save({ system: { ...settings.system, dateFormat: e.target.value } })} /></div>
            <div className="field"><label>Default Currency</label><input value={settings.system.defaultCurrency} onChange={(e) => save({ system: { ...settings.system, defaultCurrency: e.target.value } })} /></div>
          </div>
        </div>
      )}
    </div>
  );
}
