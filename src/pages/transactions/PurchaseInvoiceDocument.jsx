import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatusBadge } from '../../components/common/UI';
import FormPage from '../../components/common/FormPage';
import { DocumentFlow, ApprovalPanel, AuditTrail, AttachmentPanel } from '../../components/common/DocFlowPanels';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { purchaseInvoiceService, businessPartnerService, materialService, auditService } from '../../services/dataService';
import './TransactionDoc.css';

const PURCHASE_STAGES = [
  { key: 'pr', label: 'Requisition' }, { key: 'rfq', label: 'RFQ' }, { key: 'sq', label: 'Supplier Quote' },
  { key: 'po', label: 'Purchase Order' }, { key: 'gr', label: 'Goods Receipt' }, { key: 'invoice', label: 'Invoice' }, { key: 'payment', label: 'Payment' },
];

function emptyInvoice() {
  return {
    docNo: '', postingDate: new Date().toISOString().slice(0, 10), vendorId: '', vendorRef: '',
    currency: 'USD', paymentTerms: 'Net 30', dueDate: '', remarks: '', status: 'Open',
    approvalStatus: 'Pending', lines: [{ item: '', description: '', qty: 1, uom: 'PCS', unitPrice: 0, discount: 0, tax: 15, warehouse: '', lineTotal: 0 }],
    subtotal: 0, discount: 0, tax: 0, grandTotal: 0, paidAmount: 0, outstanding: 0,
    docFlow: { pr: 'Completed', rfq: 'Completed', sq: 'Completed', po: 'Completed', gr: 'Completed', invoice: 'Current', payment: 'Pending' },
    attachments: [],
  };
}

function computeTotals(lines) {
  let subtotal = 0, discountTotal = 0, taxTotal = 0;
  const computedLines = lines.map((l) => {
    const base = l.qty * l.unitPrice;
    const discAmt = base * (l.discount / 100);
    const taxable = base - discAmt;
    const taxAmt = taxable * (l.tax / 100);
    const lineTotal = taxable + taxAmt;
    subtotal += base; discountTotal += discAmt; taxTotal += taxAmt;
    return { ...l, lineTotal: Math.round(lineTotal * 100) / 100 };
  });
  return { computedLines, subtotal, discountTotal, taxTotal, grandTotal: subtotal - discountTotal + taxTotal };
}

export default function PurchaseInvoiceDocument() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState(emptyInvoice());
  const [vendors, setVendors] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    Promise.all([businessPartnerService.list(), materialService.list()]).then(([bp, mat]) => {
      setVendors(bp.filter((b) => b.type === 'Supplier'));
      setMaterials(mat);
    });
    if (!isNew) {
      purchaseInvoiceService.get(id).then((rec) => { setForm(rec); setLoading(false); });
    }
  }, [id, isNew]);

  const updateLine = (idx, patch) => {
    const lines = [...form.lines];
    lines[idx] = { ...lines[idx], ...patch };
    setForm({ ...form, lines });
  };
  const addLine = () => setForm({ ...form, lines: [...form.lines, { item: '', description: '', qty: 1, uom: 'PCS', unitPrice: 0, discount: 0, tax: 15, warehouse: '', lineTotal: 0 }] });
  const removeLine = (idx) => setForm({ ...form, lines: form.lines.filter((_, i) => i !== idx) });

  const handleSave = async () => {
    if (!form.vendorId) { toast.error('Please select a vendor.'); return; }
    const { computedLines, subtotal, discountTotal, taxTotal, grandTotal } = computeTotals(form.lines);
    const record = {
      ...form, lines: computedLines, subtotal, discount: discountTotal, tax: taxTotal, grandTotal,
      outstanding: grandTotal - (form.paidAmount || 0), createdBy: user.username, createdDate: new Date().toISOString(),
    };
    const created = await purchaseInvoiceService.create(record);
    toast.success(`Purchase Invoice ${created.docNo} created successfully.`);
    navigate('/transactions/purchase-invoice');
  };

  const handleApprove = async (comment) => {
    await purchaseInvoiceService.update(form.id, { approvalStatus: 'Approved' });
    await auditService.record({ user: user.username, module: 'Purchase Invoice', document: form.docNo, action: 'Approved', previousValue: 'Pending', newValue: 'Approved' + (comment ? ` — "${comment}"` : '') });
    toast.success(`${form.docNo} approved.`);
    setForm({ ...form, approvalStatus: 'Approved' });
  };
  const handleReject = async (comment) => {
    await purchaseInvoiceService.update(form.id, { approvalStatus: 'Rejected' });
    await auditService.record({ user: user.username, module: 'Purchase Invoice', document: form.docNo, action: 'Rejected', previousValue: 'Pending', newValue: 'Rejected' + (comment ? ` — "${comment}"` : '') });
    toast.warning(`${form.docNo} rejected.`);
    setForm({ ...form, approvalStatus: 'Rejected' });
  };
  const handleReturn = async (comment) => {
    await auditService.record({ user: user.username, module: 'Purchase Invoice', document: form.docNo, action: 'Returned for correction', previousValue: '-', newValue: comment || '-' });
    toast.info(`${form.docNo} returned for correction.`);
  };

  const addAttachment = async (name) => {
    const updated = [...(form.attachments || []), name];
    await purchaseInvoiceService.update(form.id, { attachments: updated });
    setForm({ ...form, attachments: updated });
  };
  const removeAttachment = async (idx) => {
    const updated = (form.attachments || []).filter((_, i) => i !== idx);
    await purchaseInvoiceService.update(form.id, { attachments: updated });
    setForm({ ...form, attachments: updated });
  };

  const { subtotal, discountTotal, taxTotal, grandTotal } = computeTotals(form.lines);

  if (isNew) {
    return (
      <FormPage
        title="New Purchase Invoice"
        subtitle="Purchase Invoice"
        backTo="/transactions/purchase-invoice"
        actions={
          <>
            <button className="btn" onClick={() => navigate('/transactions/purchase-invoice')}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save Invoice</button>
          </>
        }
      >
        <div className="card" style={{ padding: 20 }}>
          <div className="section-title">Header</div>
          <div className="form-grid">
            <div className="field">
              <label>Vendor *</label>
              <select value={form.vendorId} onChange={(e) => setForm({ ...form, vendorId: e.target.value })}>
                <option value="">Select vendor</option>
                {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <div className="field"><label>Vendor Reference</label><input value={form.vendorRef} onChange={(e) => setForm({ ...form, vendorRef: e.target.value })} /></div>
            <div className="field"><label>Posting Date</label><input type="date" value={form.postingDate} onChange={(e) => setForm({ ...form, postingDate: e.target.value })} /></div>
            <div className="field"><label>Due Date</label><input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div>
            <div className="field" style={{ gridColumn: '1 / -1' }}><label>Remarks</label><input value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} /></div>
          </div>
        </div>

        <div className="card" style={{ padding: 20, marginTop: 16 }}>
          <div className="section-title">Line Items</div>
          {form.lines.map((line, idx) => (
            <div className="line-editor-row" key={idx}>
              <select value={line.item} onChange={(e) => {
                const mat = materials.find((m) => m.code === e.target.value);
                updateLine(idx, { item: e.target.value, description: mat?.name || '', unitPrice: mat?.purchasePrice || 0, uom: mat?.uom || 'PCS', warehouse: mat?.warehouse || '' });
              }}>
                <option value="">Select item</option>
                {materials.map((m) => <option key={m.id} value={m.code}>{m.code} — {m.name}</option>)}
              </select>
              <input type="number" value={line.qty} onChange={(e) => updateLine(idx, { qty: Number(e.target.value) })} placeholder="Qty" />
              <input type="number" value={line.unitPrice} onChange={(e) => updateLine(idx, { unitPrice: Number(e.target.value) })} placeholder="Unit Price" />
              <input type="number" value={line.discount} onChange={(e) => updateLine(idx, { discount: Number(e.target.value) })} placeholder="Disc %" />
              <input type="number" value={line.tax} onChange={(e) => updateLine(idx, { tax: Number(e.target.value) })} placeholder="Tax %" />
              <button className="btn btn-sm btn-danger" onClick={() => removeLine(idx)}>✕</button>
            </div>
          ))}
          <button className="btn btn-sm" onClick={addLine} style={{ marginBottom: 4 }}>+ Add Line</button>
        </div>

        <div className="card" style={{ padding: 20, marginTop: 16 }}>
          <div className="doc-totals">
            <div><span>Subtotal</span><strong>${subtotal.toLocaleString()}</strong></div>
            <div><span>Discount</span><strong>-${discountTotal.toLocaleString()}</strong></div>
            <div><span>Tax</span><strong>${taxTotal.toLocaleString()}</strong></div>
            <div className="doc-total-grand"><span>Grand Total</span><strong>${grandTotal.toLocaleString()}</strong></div>
          </div>
        </div>
      </FormPage>
    );
  }

  return (
    <FormPage
      title={`Purchase Invoice ${form.docNo}`}
      subtitle="Purchase Invoice"
      statusSlot={!loading && <StatusBadge status={form.status} />}
      backTo="/transactions/purchase-invoice"
      loading={loading}
    >
      <DocumentFlow stages={PURCHASE_STAGES} statuses={form.docFlow} />

      <div className="card" style={{ padding: 20, marginTop: 4 }}>
        <div className="doc-header-grid">
          <div><span>Vendor</span><p>{vendors.find((v) => v.id === form.vendorId)?.name || form.vendorId}</p></div>
          <div><span>Vendor Ref</span><p>{form.vendorRef}</p></div>
          <div><span>Posting Date</span><p>{form.postingDate}</p></div>
          <div><span>Due Date</span><p>{form.dueDate}</p></div>
          <div><span>Payment Terms</span><p>{form.paymentTerms}</p></div>
          <div><span>Currency</span><p>{form.currency}</p></div>
        </div>

        <table className="mini-table doc-lines-table">
          <thead><tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Disc%</th><th>Tax%</th><th>Line Total</th></tr></thead>
          <tbody>
            {form.lines.map((l, i) => (
              <tr key={i}>
                <td>{l.item} — {l.description}</td>
                <td>{l.qty} {l.uom}</td>
                <td>${l.unitPrice}</td>
                <td>{l.discount}%</td>
                <td>{l.tax}%</td>
                <td>${l.lineTotal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="doc-totals">
          <div><span>Subtotal</span><strong>${form.subtotal.toLocaleString()}</strong></div>
          <div><span>Discount</span><strong>-${form.discount.toLocaleString()}</strong></div>
          <div><span>Tax</span><strong>${form.tax.toLocaleString()}</strong></div>
          <div className="doc-total-grand"><span>Grand Total</span><strong>${form.grandTotal.toLocaleString()}</strong></div>
          <div><span>Paid</span><strong>${form.paidAmount.toLocaleString()}</strong></div>
          <div><span>Outstanding</span><strong>${form.outstanding.toLocaleString()}</strong></div>
        </div>
      </div>

      <ApprovalPanel approvalStatus={form.approvalStatus} onApprove={handleApprove} onReject={handleReject} onReturn={handleReturn} />
      <AttachmentPanel attachments={form.attachments || []} onAdd={addAttachment} onRemove={removeAttachment} />
      <AuditTrail documentId={form.docNo} />
    </FormPage>
  );
}
