import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/common/DataTable';
import { ConfirmDialog, StatusBadge } from '../../components/common/UI';
import { useToast } from '../../context/ToastContext';
import { salesInvoiceService, businessPartnerService } from '../../services/dataService';

export default function SalesInvoice() {
  const toast = useToast();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([salesInvoiceService.list(), businessPartnerService.list()]).then(([inv, bp]) => {
      setRows(inv); setCustomers(bp.filter((b) => b.type === 'Customer')); setLoading(false);
    });
  };
  useEffect(load, []);

  const handleDelete = async () => {
    await salesInvoiceService.remove(deleteTarget.id);
    toast.success('Sales invoice deleted.');
    setDeleteTarget(null);
    load();
  };

  const filteredRows = statusFilter === 'All' ? rows : rows.filter((r) => r.status === statusFilter);

  const columns = [
    { key: 'docNo', label: 'Doc No', sortable: true },
    { key: 'postingDate', label: 'Date', sortable: true },
    { key: 'customerId', label: 'Customer', render: (r) => customers.find((c) => c.id === r.customerId)?.name || r.customerId },
    { key: 'grandTotal', label: 'Total', align: 'right', sortable: true, render: (r) => `$${r.grandTotal.toLocaleString()}` },
    { key: 'outstanding', label: 'Outstanding', align: 'right', render: (r) => `$${r.outstanding.toLocaleString()}` },
    { key: 'approvalStatus', label: 'Approval', render: (r) => <StatusBadge status={r.approvalStatus} /> },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1>Sales Invoice</h1>
          <p>Primary sales transaction — issues goods from stock and creates a receivable.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filteredRows}
        loading={loading}
        searchKeys={['docNo', 'customerRef', 'salesEmployee']}
        filters={
          <select className="btn btn-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option><option value="Open">Open</option><option value="Closed">Closed</option>
          </select>
        }
        toolbarRight={<button className="btn btn-primary" onClick={() => navigate('/transactions/sales-invoice/new')}>+ New Sales Invoice</button>}
        emptyTitle="No sales invoices yet"
        emptyMessage="Create your first sales invoice."
        onRowClick={(row) => navigate(`/transactions/sales-invoice/${row.id}`)}
        actions={(row) => <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(row)}>Delete</button>}
      />

      <ConfirmDialog open={!!deleteTarget} message={`Delete sales invoice "${deleteTarget?.docNo}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
