import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormPage from '../../components/common/FormPage';
import { StatusBadge } from '../../components/common/UI';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { businessPartnerService, auditService } from '../../services/dataService';

const emptyBP = {
  code: '', name: '', type: 'Customer', contactPerson: '', phone: '', email: '', address: '',
  taxNumber: '', paymentTerms: 'Net 30', creditLimit: 0, currency: 'USD', bankInfo: '', status: 'Active',
  outstandingBalance: 0, totalSales: 0, totalPurchases: 0,
};

export default function BusinessPartnerForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState(emptyBP);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      businessPartnerService.get(id).then((rec) => { setForm(rec); setOriginal(rec); setLoading(false); });
    }
  }, [id, isEdit]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSave = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      toast.error('BP Code and Name are required.');
      return;
    }
    if (isEdit) {
      const changed = Object.keys(emptyBP).filter((k) => String(original[k]) !== String(form[k]));
      await businessPartnerService.update(id, form);
      for (const k of changed) {
        await auditService.record({ user: user.username, module: 'Business Partner', document: original.code, action: `${k} changed`, previousValue: original[k], newValue: form[k] });
      }
      toast.success('Business Partner updated successfully.');
    } else {
      await businessPartnerService.create(form);
      toast.success('Business Partner created successfully.');
    }
    navigate('/master-data/business-partner');
  };

  return (
    <FormPage
      title={isEdit ? `Edit Business Partner — ${form.code || ''}` : 'Add Business Partner'}
      subtitle="Business Partner"
      statusSlot={isEdit && <StatusBadge status={form.status} />}
      backTo="/master-data/business-partner"
      loading={loading}
      actions={
        <>
          <button className="btn" onClick={() => navigate('/master-data/business-partner')}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </>
      }
    >
      <div className="card" style={{ padding: 20 }}>
        <div className="section-title">General Information</div>
        <div className="form-grid">
          <div className="field"><label>BP Code *</label><input value={form.code} onChange={(e) => set({ code: e.target.value })} /></div>
          <div className="field"><label>BP Name *</label><input value={form.name} onChange={(e) => set({ name: e.target.value })} /></div>
          <div className="field">
            <label>Type</label>
            <select value={form.type} onChange={(e) => set({ type: e.target.value })}>
              <option>Customer</option><option>Supplier</option>
            </select>
          </div>
          <div className="field"><label>Contact Person</label><input value={form.contactPerson} onChange={(e) => set({ contactPerson: e.target.value })} /></div>
          <div className="field"><label>Phone</label><input value={form.phone} onChange={(e) => set({ phone: e.target.value })} /></div>
          <div className="field"><label>Email</label><input value={form.email} onChange={(e) => set({ email: e.target.value })} /></div>
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Address</label><input value={form.address} onChange={(e) => set({ address: e.target.value })} /></div>
          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => set({ status: e.target.value })}>
              <option>Active</option><option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginTop: 16 }}>
        <div className="section-title">Financial Details</div>
        <div className="form-grid">
          <div className="field"><label>Tax Number</label><input value={form.taxNumber} onChange={(e) => set({ taxNumber: e.target.value })} /></div>
          <div className="field"><label>Payment Terms</label><input value={form.paymentTerms} onChange={(e) => set({ paymentTerms: e.target.value })} /></div>
          <div className="field"><label>Credit Limit</label><input type="number" value={form.creditLimit} onChange={(e) => set({ creditLimit: Number(e.target.value) })} /></div>
          <div className="field"><label>Currency</label><input value={form.currency} onChange={(e) => set({ currency: e.target.value })} /></div>
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Bank Information</label><input value={form.bankInfo} onChange={(e) => set({ bankInfo: e.target.value })} /></div>
        </div>
      </div>
    </FormPage>
  );
}
