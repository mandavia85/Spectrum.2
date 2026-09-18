import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/common/DataTable';
import { ConfirmDialog, StatusBadge } from '../../components/common/UI';
import { useToast } from '../../context/ToastContext';
import { purchaseInvoiceService, businessPartnerService } from '../../services/dataService';

export default function PurchaseInvoice() {
  const toast = useToast();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([purchaseInvoiceService.list(), businessPartnerService.list()]).then(([inv, bp]) => {
      setRows(inv); setVendors(bp.filter((b) => b.type === 'Supplier')); setLoading(false);
    });
  };
  useEffect(load, []);

  const handleDelete = async () => {
    await purchaseInvoiceService.remove(deleteTarget.id);
    toast.success('Purchase invoice deleted.');
    setDeleteTarget(null);
    load();
  };

  const filteredRows = statusFilter === 'All' ? rows : rows.filter((r) => r.status === statusFilter);

  const columns = [
    { key: 'docNo', label: 'Doc No', sortable: true },
    { key: 'postingDate', label: 'Date', sortable: true },
    { key: 'vendorId', label: 'Vendor', render: (r) => vendors.find((v) => v.id === r.vendorId)?.name || r.vendorId },
    { key: 'grandTotal', label: 'Total', align: 'right', sortable: true, render: (r) => `$${r.grandTotal.toLocaleString()}` },
    { key: 'outstanding', label: 'Outstanding', align: 'right', render: (r) => `$${r.outstanding.toLocaleString()}` },
    { key: 'approvalStatus', label: 'Approval', render: (r) => <StatusBadge status={r.approvalStatus} /> },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1>Purchase Invoice</h1>
          <p>Primary purchase transaction — receives goods into stock and creates a payable.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filteredRows}
        loading={loading}
        searchKeys={['docNo', 'vendorRef']}
        filters={
          <select className="btn btn-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option><option value="Open">Open</option><option value="Closed">Closed</option>
          </select>
        }
        toolbarRight={<button className="btn btn-primary" onClick={() => navigate('/transactions/purchase-invoice/new')}>+ New Purchase Invoice</button>}
        emptyTitle="No purchase invoices yet"
        emptyMessage="Create your first purchase invoice."
        onRowClick={(row) => navigate(`/transactions/purchase-invoice/${row.id}`)}
        actions={(row) => <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(row)}>Delete</button>}
      />

      <ConfirmDialog open={!!deleteTarget} message={`Delete purchase invoice "${deleteTarget?.docNo}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
