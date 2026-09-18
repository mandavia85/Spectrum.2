import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormPage from '../../components/common/FormPage';
import { StatusBadge } from '../../components/common/UI';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { materialService, materialGroupService, auditService } from '../../services/dataService';

const emptyMaterial = {
  code: '', name: '', description: '', group: '', type: 'Raw Material', uom: 'PCS',
  purchasePrice: 0, salesPrice: 0, tax: 15, warehouse: '', minStock: 0, maxStock: 0, reorderLevel: 0,
  batchManaged: false, serialManaged: false, expiryManaged: false, status: 'Active',
  stockOnHand: 0, committedStock: 0,
};

export default function MaterialMasterForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState(emptyMaterial);
  const [original, setOriginal] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    materialGroupService.list().then(setGroups);
    if (isEdit) {
      materialService.get(id).then((rec) => {
        setForm(rec); setOriginal(rec); setLoading(false);
      });
    }
  }, [id, isEdit]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSave = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      toast.error('Material Code and Name are required.');
      return;
    }
    if (isEdit) {
      const changed = Object.keys(emptyMaterial).filter((k) => String(original[k]) !== String(form[k]));
      await materialService.update(id, form);
      for (const k of changed) {
        await auditService.record({ user: user.username, module: 'Material Master', document: original.code, action: `${k} changed`, previousValue: original[k], newValue: form[k] });
      }
      toast.success('Material updated successfully.');
    } else {
      await materialService.create(form);
      toast.success('Material created successfully.');
    }
    navigate('/master-data/material-master');
  };

  return (
    <FormPage
      title={isEdit ? `Edit Material — ${form.code || ''}` : 'Add Material'}
      subtitle="Material Master"
      statusSlot={isEdit && <StatusBadge status={form.status} />}
      backTo="/master-data/material-master"
      loading={loading}
      actions={
        <>
          <button className="btn" onClick={() => navigate('/master-data/material-master')}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </>
      }
    >
      <div className="card" style={{ padding: 20 }}>
        <div className="section-title">General Information</div>
        <div className="form-grid">
          <div className="field"><label>Material Code *</label><input value={form.code} onChange={(e) => set({ code: e.target.value })} /></div>
          <div className="field"><label>Material Name *</label><input value={form.name} onChange={(e) => set({ name: e.target.value })} /></div>
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Description</label><input value={form.description} onChange={(e) => set({ description: e.target.value })} /></div>
          <div className="field">
            <label>Material Group</label>
            <select value={form.group} onChange={(e) => set({ group: e.target.value })}>
              <option value="">Select group</option>
              {groups.map((g) => <option key={g.id} value={g.name}>{g.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Type</label>
            <select value={form.type} onChange={(e) => set({ type: e.target.value })}>
              {['Raw Material', 'Finished Good', 'Packaging', 'Spare Part', 'Consumable'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field"><label>UOM</label><input value={form.uom} onChange={(e) => set({ uom: e.target.value })} /></div>
          <div className="field"><label>Warehouse</label><input value={form.warehouse} onChange={(e) => set({ warehouse: e.target.value })} /></div>
          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => set({ status: e.target.value })}>
              <option>Active</option><option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginTop: 16 }}>
        <div className="section-title">Pricing & Tax</div>
        <div className="form-grid">
          <div className="field"><label>Purchase Price</label><input type="number" value={form.purchasePrice} onChange={(e) => set({ purchasePrice: Number(e.target.value) })} /></div>
          <div className="field"><label>Sales Price</label><input type="number" value={form.salesPrice} onChange={(e) => set({ salesPrice: Number(e.target.value) })} /></div>
          <div className="field"><label>Tax (%)</label><input type="number" value={form.tax} onChange={(e) => set({ tax: Number(e.target.value) })} /></div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginTop: 16 }}>
        <div className="section-title">Inventory Parameters</div>
        <div className="form-grid">
          <div className="field"><label>Minimum Stock</label><input type="number" value={form.minStock} onChange={(e) => set({ minStock: Number(e.target.value) })} /></div>
          <div className="field"><label>Maximum Stock</label><input type="number" value={form.maxStock} onChange={(e) => set({ maxStock: Number(e.target.value) })} /></div>
          <div className="field"><label>Reorder Level</label><input type="number" value={form.reorderLevel} onChange={(e) => set({ reorderLevel: Number(e.target.value) })} /></div>
          <div className="checkbox-field"><input type="checkbox" checked={form.batchManaged} onChange={(e) => set({ batchManaged: e.target.checked })} /><label>Batch Managed</label></div>
          <div className="checkbox-field"><input type="checkbox" checked={form.serialManaged} onChange={(e) => set({ serialManaged: e.target.checked })} /><label>Serial Managed</label></div>
          <div className="checkbox-field"><input type="checkbox" checked={form.expiryManaged} onChange={(e) => set({ expiryManaged: e.target.checked })} /><label>Expiry Managed</label></div>
        </div>
      </div>
    </FormPage>
  );
}
