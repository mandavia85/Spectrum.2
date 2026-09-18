import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/common/DataTable';
import { Modal, ConfirmDialog, StatusBadge } from '../../components/common/UI';
import { useToast } from '../../context/ToastContext';
import { businessPartnerService, purchaseInvoiceService, salesInvoiceService } from '../../services/dataService';
import '../masterdata/MaterialMaster.css';

export default function BusinessPartner() {
  const toast = useToast();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [viewRow, setViewRow] = useState(null);
  const [relatedDocs, setRelatedDocs] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    businessPartnerService.list().then((data) => { setRows(data); setLoading(false); });
  };
  useEffect(load, []);

  const openView = async (row) => {
    setViewRow(row);
    if (row.type === 'Customer') {
      const inv = await salesInvoiceService.list();
      setRelatedDocs(inv.filter((i) => i.customerId === row.id));
    } else {
      const inv = await purchaseInvoiceService.list();
      setRelatedDocs(inv.filter((i) => i.vendorId === row.id));
    }
  };

  const handleDelete = async () => {
    await businessPartnerService.remove(deleteTarget.id);
    toast.success('Business Partner deleted.');
    setDeleteTarget(null);
    load();
  };

  const filteredRows = typeFilter === 'All' ? rows : rows.filter((r) => r.type === typeFilter);

  const columns = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'contactPerson', label: 'Contact' },
    { key: 'outstandingBalance', label: 'Outstanding', align: 'right', sortable: true, render: (r) => `$${(r.outstandingBalance || 0).toLocaleString()}` },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1>Business Partner</h1>
          <p>Manage customers and suppliers, credit limits and outstanding balances.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filteredRows}
        loading={loading}
        searchKeys={['code', 'name', 'contactPerson', 'email']}
        filters={
          <select className="btn btn-sm" style={{ paddingRight: 24 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Customer">Customers</option>
            <option value="Supplier">Suppliers</option>
          </select>
        }
        toolbarRight={<button className="btn btn-primary" onClick={() => navigate('/master-data/business-partner/new')}>+ Add Business Partner</button>}
        emptyTitle="No business partners yet"
        emptyMessage="Add your first customer or supplier."
        onRowClick={openView}
        actions={(row) => (
          <>
            <button className="btn btn-sm" onClick={() => navigate(`/master-data/business-partner/${row.id}/edit`)}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(row)}>Delete</button>
          </>
        )}
      />

      {/* Quick View */}
      <Modal open={!!viewRow} onClose={() => setViewRow(null)} title={viewRow ? `${viewRow.code} — ${viewRow.name}` : ''} width={600}
        footer={<button className="btn btn-primary" onClick={() => navigate(`/master-data/business-partner/${viewRow.id}/edit`)}>Edit</button>}
      >
        {viewRow && (
          <>
            <div className="stock-kpi-row">
              <div className="stock-kpi"><span>Type</span><strong>{viewRow.type}</strong></div>
              <div className="stock-kpi"><span>Outstanding</span><strong>${(viewRow.outstandingBalance || 0).toLocaleString()}</strong></div>
              <div className="stock-kpi"><span>{viewRow.type === 'Customer' ? 'Total Sales' : 'Total Purchases'}</span><strong>${((viewRow.type === 'Customer' ? viewRow.totalSales : viewRow.totalPurchases) || 0).toLocaleString()}</strong></div>
              <div className="stock-kpi"><span>Credit Limit</span><strong>${(viewRow.creditLimit || 0).toLocaleString()}</strong></div>
            </div>
            <div className="detail-grid" style={{ marginBottom: 20 }}>
              <div><span>Contact Person</span><p>{viewRow.contactPerson}</p></div>
              <div><span>Phone</span><p>{viewRow.phone}</p></div>
              <div><span>Email</span><p>{viewRow.email}</p></div>
              <div><span>Tax Number</span><p>{viewRow.taxNumber}</p></div>
              <div><span>Payment Terms</span><p>{viewRow.paymentTerms}</p></div>
              <div><span>Currency</span><p>{viewRow.currency}</p></div>
              <div style={{ gridColumn: '1 / -1' }}><span>Address</span><p>{viewRow.address}</p></div>
              <div style={{ gridColumn: '1 / -1' }}><span>Bank Information</span><p>{viewRow.bankInfo}</p></div>
            </div>
            <h4 style={{ fontSize: 13, marginBottom: 8 }}>Related Documents</h4>
            {relatedDocs.length === 0 ? (
              <p style={{ fontSize: 12.5, color: 'var(--slate-400)' }}>No transactions yet.</p>
            ) : (
              <ul className="related-doc-list">
                {relatedDocs.map((d) => (
                  <li key={d.id}>
                    <span className="related-doc-type">{viewRow.type === 'Customer' ? 'Sales Invoice' : 'Purchase Invoice'}</span>
                    <span>{d.docNo}</span>
                    <StatusBadge status={d.status} />
                  </li>
                ))}
              </ul>
            )}
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
