import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormPage from '../../components/common/FormPage';
import { StatusBadge } from '../../components/common/UI';
import { useToast } from '../../context/ToastContext';
import { fixedAssetService, assetClassService } from '../../services/dataService';

const emptyAsset = {
  code: '', name: '', assetClass: '', acquisitionDate: '', acquisitionCost: 0, usefulLife: 5,
  depreciationMethod: 'Straight Line', depreciationRate: 10, accumulatedDepreciation: 0,
  currentBookValue: 0, location: '', responsibleEmployee: '', status: 'Active',
};

export default function FixedAssetsForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(emptyAsset);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    assetClassService.list().then(setClasses);
    if (isEdit) fixedAssetService.get(id).then((rec) => { setForm(rec); setLoading(false); });
  }, [id, isEdit]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSave = async () => {
    if (!form.code.trim() || !form.name.trim()) { toast.error('Asset Code and Name are required.'); return; }
    if (isEdit) {
      await fixedAssetService.update(id, form);
      toast.success('Fixed asset updated successfully.');
    } else {
      await fixedAssetService.create({ ...form, currentBookValue: form.acquisitionCost - form.accumulatedDepreciation });
      toast.success('Fixed asset created successfully.');
    }
    navigate('/master-data/fixed-assets');
  };

  return (
    <FormPage
      title={isEdit ? `Edit Fixed Asset — ${form.code || ''}` : 'Add Fixed Asset'}
      subtitle="Fixed Assets"
      statusSlot={isEdit && <StatusBadge status={form.status} />}
      backTo="/master-data/fixed-assets"
      loading={loading}
      actions={
        <>
          <button className="btn" onClick={() => navigate('/master-data/fixed-assets')}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </>
      }
    >
      <div className="card" style={{ padding: 20 }}>
        <div className="section-title">Asset Information</div>
        <div className="form-grid">
          <div className="field"><label>Asset Code *</label><input value={form.code} onChange={(e) => set({ code: e.target.value })} /></div>
          <div className="field"><label>Asset Name *</label><input value={form.name} onChange={(e) => set({ name: e.target.value })} /></div>
          <div className="field">
            <label>Asset Class</label>
            <select value={form.assetClass} onChange={(e) => set({ assetClass: e.target.value })}>
              <option value="">Select class</option>
              {classes.map((c) => <option key={c.id} value={c.code}>{c.name}</option>)}
            </select>
          </div>
          <div className="field"><label>Location</label><input value={form.location} onChange={(e) => set({ location: e.target.value })} /></div>
          <div className="field"><label>Responsible Employee</label><input value={form.responsibleEmployee} onChange={(e) => set({ responsibleEmployee: e.target.value })} /></div>
          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => set({ status: e.target.value })}>
              <option>Active</option><option>Disposed</option><option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginTop: 16 }}>
        <div className="section-title">Acquisition & Depreciation</div>
        <div className="form-grid">
          <div className="field"><label>Acquisition Date</label><input type="date" value={form.acquisitionDate} onChange={(e) => set({ acquisitionDate: e.target.value })} /></div>
          <div className="field"><label>Acquisition Cost</label><input type="number" value={form.acquisitionCost} onChange={(e) => set({ acquisitionCost: Number(e.target.value) })} /></div>
          <div className="field"><label>Useful Life (yrs)</label><input type="number" value={form.usefulLife} onChange={(e) => set({ usefulLife: Number(e.target.value) })} /></div>
          <div className="field"><label>Depreciation Rate (%)</label><input type="number" value={form.depreciationRate} onChange={(e) => set({ depreciationRate: Number(e.target.value) })} /></div>
          <div className="field"><label>Accumulated Depreciation</label><input type="number" value={form.accumulatedDepreciation} onChange={(e) => set({ accumulatedDepreciation: Number(e.target.value) })} /></div>
        </div>
      </div>
    </FormPage>
  );
}
