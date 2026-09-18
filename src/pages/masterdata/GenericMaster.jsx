import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DataTable from '../../components/common/DataTable';
import { ConfirmDialog, StatusBadge } from '../../components/common/UI';
import { useToast } from '../../context/ToastContext';
import { masterConfigs } from './masterConfigs';

export default function GenericMaster() {
  const { configKey } = useParams();
  const config = masterConfigs[configKey];
  const toast = useToast();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    config.service.list().then((data) => { setRows(data); setLoading(false); });
  };
  useEffect(() => { load(); }, [configKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!config) {
    return <div className="page-wrap"><p>Unknown master data screen.</p></div>;
  }

  const handleDelete = async () => {
    await config.service.remove(deleteTarget.id);
    toast.success(`${config.entityLabel} deleted.`);
    setDeleteTarget(null);
    load();
  };

  const columns = (config.columns || config.fields.map((f) => ({ key: f.key, label: f.label }))).map((c) => ({
    ...c,
    sortable: true,
    render: c.key === 'status' ? (row) => <StatusBadge status={row.status} /> : undefined,
  }));

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1>{config.title}</h1>
          <p>Manage {config.title.toLowerCase()} records used across the ERP.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        searchKeys={config.fields.map((f) => f.key)}
        toolbarRight={<button className="btn btn-primary" onClick={() => navigate(`/master-data/${configKey}/new`)}>+ Add {config.entityLabel}</button>}
        emptyTitle={`No ${config.title.toLowerCase()} yet`}
        emptyMessage={`Add your first ${config.entityLabel.toLowerCase()} to get started.`}
        onRowClick={(row) => navigate(`/master-data/${configKey}/${row.id}/edit`)}
        actions={(row) => (
          <>
            <button className="btn btn-sm" onClick={() => navigate(`/master-data/${configKey}/${row.id}/edit`)}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(row)}>Delete</button>
          </>
        )}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Are you sure you want to delete "${deleteTarget?.name || deleteTarget?.code}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
