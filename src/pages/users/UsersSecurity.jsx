import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/common/DataTable';
import { ConfirmDialog, StatusBadge } from '../../components/common/UI';
import { useToast } from '../../context/ToastContext';
import { userService, roleService, auditService } from '../../services/dataService';
import '../payroll/Payroll.css';

export default function UsersSecurity() {
  const toast = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([userService.list(), roleService.list(), auditService.list()]).then(([u, r, a]) => {
      setUsers(u); setRoles(r);
      setActivity([...a].sort((x, y) => new Date(y.timestamp) - new Date(x.timestamp)));
      setLoading(false);
    });
  };
  useEffect(load, []);

  const handleDelete = async () => {
    await userService.remove(deleteTarget.id);
    toast.success('User removed.');
    setDeleteTarget(null);
    load();
  };

  const userColumns = [
    { key: 'userId', label: 'User ID', sortable: true },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'employee', label: 'Employee' },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status' },
    { key: 'lastLogin', label: 'Last Login', render: (r) => r.lastLogin === '—' ? '—' : new Date(r.lastLogin).toLocaleString() },
  ];

  const roleGroups = roles.reduce((acc, r) => { (acc[r.role] ||= []).push(r); return acc; }, {});

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div><h1>Users & Security</h1><p>Manage system users, role-based permissions and audit activity.</p></div>
      </div>

      <div className="tab-strip">
        <button className={`tab-btn ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>Users</button>
        <button className={`tab-btn ${tab === 'roles' ? 'active' : ''}`} onClick={() => setTab('roles')}>Roles & Permissions</button>
        <button className={`tab-btn ${tab === 'activity' ? 'active' : ''}`} onClick={() => setTab('activity')}>Activity Log</button>
      </div>

      {tab === 'users' && (
        <DataTable
          columns={userColumns}
          rows={users}
          loading={loading}
          searchKeys={['userId', 'username', 'employee', 'email', 'role']}
          toolbarRight={<button className="btn btn-primary" onClick={() => navigate('/users-security/new')}>+ Add User</button>}
          emptyTitle="No users yet"
          emptyMessage="Create your first user account."
          onRowClick={(row) => navigate(`/users-security/${row.id}/edit`)}
          actions={(row) => (
            <>
              <button className="btn btn-sm" onClick={() => navigate(`/users-security/${row.id}/edit`)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(row)}>Delete</button>
            </>
          )}
        />
      )}

      {tab === 'roles' && (
        <div className="card" style={{ padding: 18 }}>
          {Object.entries(roleGroups).map(([role, perms]) => (
            <div key={role} style={{ marginBottom: 22 }}>
              <h4 style={{ fontSize: 13, marginBottom: 8 }}>{role}</h4>
              <table className="mini-table">
                <thead><tr><th>Module</th><th>View</th><th>Add</th><th>Edit</th><th>Delete</th><th>Approve</th></tr></thead>
                <tbody>
                  {perms.map((p, i) => (
                    <tr key={i}>
                      <td>{p.module}</td>
                      {['view', 'add', 'edit', 'delete', 'approve'].map((k) => (
                        <td key={k}>{p[k] ? <StatusBadge status="Active" /> : <StatusBadge status="Inactive" />}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {tab === 'activity' && (
        <div className="card" style={{ padding: 0 }}>
          <table className="mini-table" style={{ padding: 8 }}>
            <thead><tr><th>User</th><th>Date/Time</th><th>Module</th><th>Document</th><th>Action</th></tr></thead>
            <tbody>
              {activity.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 30, color: 'var(--slate-400)' }}>No activity recorded yet.</td></tr>
              ) : activity.map((a) => (
                <tr key={a.id}>
                  <td>{a.user}</td>
                  <td>{new Date(a.timestamp).toLocaleString()}</td>
                  <td>{a.module}</td>
                  <td>{a.document}</td>
                  <td>{a.action}{a.previousValue !== undefined && ` (${a.previousValue} → ${a.newValue})`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} message={`Remove user "${deleteTarget?.username}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
