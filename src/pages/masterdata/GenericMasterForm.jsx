import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormPage from '../../components/common/FormPage';
import { StatusBadge } from '../../components/common/UI';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { auditService } from '../../services/dataService';
import { masterConfigs } from './masterConfigs';

function emptyFromFields(fields) {
  const obj = {};
  fields.forEach((f) => { obj[f.key] = f.default ?? ''; });
  return obj;
}

export default function GenericMasterForm() {
  const { configKey, id } = useParams();
  const config = masterConfigs[configKey];
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState(config ? emptyFromFields(config.fields) : {});
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!config) return;
    if (isEdit) {
      config.service.get(id).then((rec) => { setForm(rec); setOriginal(rec); setLoading(false); });
    } else {
      setForm(emptyFromFields(config.fields));
    }
  }, [configKey, id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!config) return <div className="page-wrap"><p>Unknown master data screen.</p></div>;

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSave = async () => {
    for (const f of config.fields) {
      if (f.required && !String(form[f.key] ?? '').trim()) {
        toast.error(`${f.label} is required.`);
        return;
      }
    }
    if (isEdit) {
      const changedFields = config.fields.filter((f) => String(original[f.key]) !== String(form[f.key]));
      await config.service.update(id, form);
      for (const f of changedFields) {
        await auditService.record({
          user: user.username, module: config.title, document: original.code || original.id,
          action: `${f.label} changed`, previousValue: original[f.key], newValue: form[f.key],
        });
      }
      toast.success(`${config.entityLabel} updated successfully.`);
    } else {
      await config.service.create(form);
      toast.success(`${config.entityLabel} created successfully.`);
    }
    navigate(`/master-data/${configKey}`);
  };

  return (
    <FormPage
      title={isEdit ? `Edit ${config.entityLabel} — ${form.code || form.name || ''}` : `Add ${config.entityLabel}`}
      subtitle={config.title}
      statusSlot={isEdit && form.status && <StatusBadge status={form.status} />}
      backTo={`/master-data/${configKey}`}
      loading={loading}
      actions={
        <>
          <button className="btn" onClick={() => navigate(`/master-data/${configKey}`)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </>
      }
    >
      <div className="card" style={{ padding: 20 }}>
        <div className="section-title">{config.entityLabel} Details</div>
        <div className="form-grid">
          {config.fields.map((f) => (
            <div className="field" key={f.key}>
              <label>{f.label}{f.required && ' *'}</label>
              {f.type === 'select' ? (
                <select value={form[f.key] ?? ''} onChange={(e) => set({ [f.key]: e.target.value })}>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type || 'text'}
                  value={form[f.key] ?? ''}
                  onChange={(e) => set({ [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </FormPage>
  );
}
