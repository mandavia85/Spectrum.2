import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/common/DataTable';
import { Modal, ConfirmDialog, StatusBadge } from '../../components/common/UI';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { fixedAssetService, auditService } from '../../services/dataService';
import './MaterialMaster.css';

function buildSchedule(asset) {
  const years = Math.min(asset.usefulLife, 6);
  const annual = asset.acquisitionCost * (asset.depreciationRate / 100);
  const rows = [];
  let accum = 0;
  for (let y = 1; y <= years; y++) {
    accum += annual;
    rows.push({ year: y, depreciation: annual, accumulated: Math.min(accum, asset.acquisitionCost), bookValue: Math.max(asset.acquisitionCost - accum, 0) });
  }
  return rows;
}

export default function FixedAssets() {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewRow, setViewRow] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    fixedAssetService.list().then((a) => { setRows(a); setLoading(false); });
  };
  useEffect(load, []);

  const handleDelete = async () => {
    await fixedAssetService.remove(deleteTarget.id);
    toast.success('Fixed asset deleted.');
    setDeleteTarget(null);
    load();
  };

  const runAction = async (row, action) => {
    let patch = {};
    if (action === 'Depreciation') {
      const annual = row.acquisitionCost * (row.depreciationRate / 100);
      const newAccum = Math.min(row.accumulatedDepreciation + annual, row.acquisitionCost);
      patch = { accumulatedDepreciation: newAccum, currentBookValue: row.acquisitionCost - newAccum };
    } else if (action === 'Disposal') {
      patch = { status: 'Disposed' };
    } else if (action === 'Capitalization') {
      patch = { status: 'Active' };
    } else if (action === 'Transfer') {
      const loc = prompt('New location:', row.location);
      if (!loc) return;
      patch = { location: loc };
    } else if (action === 'Revaluation') {
      const val = prompt('New book value:', row.currentBookValue);
      if (val === null) return;
      patch = { currentBookValue: Number(val) };
    }
    await fixedAssetService.update(row.id, patch);
    await auditService.record({ user: user.username, module: 'Fixed Assets', document: row.code, action, previousValue: '-', newValue: JSON.stringify(patch) });
    toast.success(`${action} recorded for ${row.code}.`);
    load();
    if (viewRow?.id === row.id) setViewRow({ ...row, ...patch });
  };

  const columns = [
    { key: 'code', label: 'Asset Code', sortable: true },
    { key: 'name', label: 'Asset Name', sortable: true },
    { key: 'assetClass', label: 'Class' },
    { key: 'acquisitionCost', label: 'Cost', align: 'right', render: (r) => `$${r.acquisitionCost.toLocaleString()}` },
    { key: 'currentBookValue', label: 'Book Value', align: 'right', sortable: true, render: (r) => `$${r.currentBookValue.toLocaleString()}` },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1>Fixed Assets</h1>
          <p>Track acquisition, depreciation and lifecycle of company assets.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        searchKeys={['code', 'name', 'assetClass', 'location']}
        toolbarRight={<button className="btn btn-primary" onClick={() => navigate('/master-data/fixed-assets/new')}>+ Add Asset</button>}
        emptyTitle="No fixed assets yet"
        emptyMessage="Add your first asset to start tracking depreciation."
        onRowClick={setViewRow}
        actions={(row) => (
          <>
            <button className="btn btn-sm" onClick={() => navigate(`/master-data/fixed-assets/${row.id}/edit`)}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(row)}>Delete</button>
          </>
        )}
      />

      {/* Quick View — lifecycle actions + depreciation schedule at a glance */}
      <Modal open={!!viewRow} onClose={() => setViewRow(null)} title={viewRow ? `${viewRow.code} — ${viewRow.name}` : ''} width={680}
        footer={<button className="btn btn-primary" onClick={() => navigate(`/master-data/fixed-assets/${viewRow.id}/edit`)}>Edit Asset</button>}
      >
        {viewRow && (
          <>
            <div className="stock-kpi-row">
              <div className="stock-kpi"><span>Acquisition Cost</span><strong>${viewRow.acquisitionCost.toLocaleString()}</strong></div>
              <div className="stock-kpi"><span>Accumulated Depr.</span><strong>${viewRow.accumulatedDepreciation.toLocaleString()}</strong></div>
              <div className="stock-kpi"><span>Book Value</span><strong>${viewRow.currentBookValue.toLocaleString()}</strong></div>
              <div className="stock-kpi"><span>Status</span><strong><StatusBadge status={viewRow.status} /></strong></div>
            </div>

            <div className="approval-btn-row" style={{ marginBottom: 20 }}>
              {['Acquisition', 'Capitalization', 'Depreciation', 'Transfer', 'Revaluation', 'Disposal'].map((a) => (
                <button key={a} className="btn btn-sm" onClick={() => runAction(viewRow, a)}>{a}</button>
              ))}
            </div>

            <h4 style={{ fontSize: 13, marginBottom: 8 }}>Depreciation Schedule</h4>
            <table className="mini-table">
              <thead><tr><th>Year</th><th>Depreciation</th><th>Accumulated</th><th>Book Value</th></tr></thead>
              <tbody>
                {buildSchedule(viewRow).map((r) => (
                  <tr key={r.year}>
                    <td>Year {r.year}</td>
                    <td>${r.depreciation.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td>${r.accumulated.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td>${r.bookValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} message={`Delete "${deleteTarget?.name}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
