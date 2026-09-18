import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/common/DataTable';
import { Modal, ConfirmDialog, StatusBadge } from '../../components/common/UI';
import { useToast } from '../../context/ToastContext';
import { materialService } from '../../services/dataService';
import './MaterialMaster.css';

export default function MaterialMaster() {
  const toast = useToast();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewRow, setViewRow] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    materialService.list().then((data) => { setRows(data); setLoading(false); });
  };
  useEffect(load, []);

  const handleDelete = async () => {
    await materialService.remove(deleteTarget.id);
    toast.success('Material deleted.');
    setDeleteTarget(null);
    load();
  };

  const columns = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'name', label: 'Material Name', sortable: true },
    { key: 'group', label: 'Group', sortable: true },
    { key: 'uom', label: 'UOM' },
    { key: 'stockOnHand', label: 'On Hand', align: 'right', sortable: true, render: (r) => `${r.stockOnHand} ${r.uom}` },
    { key: 'salesPrice', label: 'Sales Price', align: 'right', sortable: true, render: (r) => `$${r.salesPrice}` },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1>Material Master</h1>
          <p>Manage items, stock parameters and pricing used throughout Purchase, Sales and Inventory.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        searchKeys={['code', 'name', 'group', 'description']}
        toolbarRight={<button className="btn btn-primary" onClick={() => navigate('/master-data/material-master/new')}>+ Add Material</button>}
        emptyTitle="No materials yet"
        emptyMessage="Add your first material to begin tracking inventory."
        onRowClick={(row) => setViewRow(row)}
        actions={(row) => (
          <>
            <button className="btn btn-sm" onClick={() => navigate(`/master-data/material-master/${row.id}/edit`)}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(row)}>Delete</button>
          </>
        )}
      />

      {/* Quick View — compact glance, not a form */}
      <Modal open={!!viewRow} onClose={() => setViewRow(null)} title={viewRow ? `${viewRow.code} — ${viewRow.name}` : ''} width={560}
        footer={<button className="btn btn-primary" onClick={() => navigate(`/master-data/material-master/${viewRow.id}/edit`)}>Edit Material</button>}
      >
        {viewRow && (
          <>
            <div className="stock-kpi-row">
              <div className="stock-kpi"><span>Stock on Hand</span><strong>{viewRow.stockOnHand} {viewRow.uom}</strong></div>
              <div className="stock-kpi"><span>Committed</span><strong>{viewRow.committedStock} {viewRow.uom}</strong></div>
              <div className="stock-kpi"><span>Available</span><strong>{viewRow.stockOnHand - viewRow.committedStock} {viewRow.uom}</strong></div>
              <div className="stock-kpi"><span>Warehouse</span><strong>{viewRow.warehouse}</strong></div>
            </div>
            <div className="detail-grid">
              <div><span>Description</span><p>{viewRow.description}</p></div>
              <div><span>Group / Type</span><p>{viewRow.group} — {viewRow.type}</p></div>
              <div><span>Current Cost</span><p>${viewRow.purchasePrice}</p></div>
              <div><span>Selling Price</span><p>${viewRow.salesPrice}</p></div>
              <div><span>Tax</span><p>{viewRow.tax}%</p></div>
              <div><span>Min / Max / Reorder</span><p>{viewRow.minStock} / {viewRow.maxStock} / {viewRow.reorderLevel}</p></div>
              <div><span>Tracking</span><p>
                {[viewRow.batchManaged && 'Batch', viewRow.serialManaged && 'Serial', viewRow.expiryManaged && 'Expiry'].filter(Boolean).join(', ') || 'None'}
              </p></div>
              <div><span>Status</span><p><StatusBadge status={viewRow.status} /></p></div>
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
