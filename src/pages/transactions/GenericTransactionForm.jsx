import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormPage from '../../components/common/FormPage';
import { StatusBadge } from '../../components/common/UI';
import { useToast } from '../../context/ToastContext';
import { transactionConfigs } from './transactionConfigs';

function emptyFromFields(fields) {
  const obj = {};
  fields.forEach((f) => { obj[f.key] = f.default ?? ''; });
  return obj;
}

export default function GenericTransactionForm() {
  const { configKey, id } = useParams();
  const config = transactionConfigs[configKey];
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(config ? emptyFromFields(config.fields) : {});
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!config) return;
    if (isEdit) {
      config.service.get(id).then((rec) => { setForm(rec); setLoading(false); });
    } else {
      setForm(emptyFromFields(config.fields));
    }
  }, [configKey, id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!config) return <div className="page-wrap"><p>Unknown transaction screen.</p></div>;

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSave = async () => {
    for (const f of config.fields) {
      if (f.required && !String(form[f.key] ?? '').trim()) {
        toast.error(`${f.label} is required.`);
        return;
      }
    }
    if (isEdit) {
      await config.service.update(id, form);
      toast.success(`${config.entityLabel} updated successfully.`);
    } else {
      await config.service.create(form);
      toast.success(`${config.entityLabel} recorded successfully.`);
    }
    navigate(`/transactions/${configKey}`);
  };

  const statusKey = config.fields.find((f) => ['status', 'approvalStatus'].includes(f.key))?.key;

  return (
    <FormPage
      title={isEdit ? `Edit ${config.entityLabel}` : `New ${config.entityLabel}`}
      subtitle={config.title}
      statusSlot={isEdit && statusKey && form[statusKey] && <StatusBadge status={form[statusKey]} />}
      backTo={`/transactions/${configKey}`}
      loading={loading}
      actions={
        <>
          <button className="btn" onClick={() => navigate(`/transactions/${configKey}`)}>Cancel</button>
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
