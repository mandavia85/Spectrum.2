import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormPage from '../../components/common/FormPage';
import { StatusBadge } from '../../components/common/UI';
import { useToast } from '../../context/ToastContext';
import { userService, roleService, employeeService } from '../../services/dataService';

const emptyUser = { userId: '', username: '', employee: '', email: '', role: 'Sales Manager', status: 'Active', lastLogin: '' };

export default function UserForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(emptyUser);
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    Promise.all([roleService.list(), employeeService.list()]).then(([r, e]) => { setRoles(r); setEmployees(e); });
    if (isEdit) userService.get(id).then((rec) => { setForm(rec); setLoading(false); });
  }, [id, isEdit]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const roleNames = [...new Set(roles.map((r) => r.role))];

  const handleSave = async () => {
    if (!form.username || !form.email) { toast.error('Username and Email are required.'); return; }
    if (isEdit) {
      await userService.update(id, form);
      toast.success('User updated successfully.');
    } else {
      await userService.create({ ...form, lastLogin: '—' });
      toast.success('User created successfully.');
    }
    navigate('/users-security');
  };

  return (
    <FormPage
      title={isEdit ? `Edit User — ${form.username || ''}` : 'Add User'}
      subtitle="Users & Security"
      statusSlot={isEdit && <StatusBadge status={form.status} />}
      backTo="/users-security"
      loading={loading}
      actions={
        <>
          <button className="btn" onClick={() => navigate('/users-security')}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </>
      }
    >
      <div className="card" style={{ padding: 20 }}>
        <div className="section-title">User Details</div>
        <div className="form-grid">
          <div className="field"><label>User ID</label><input value={form.userId} onChange={(e) => set({ userId: e.target.value })} /></div>
          <div className="field"><label>Username *</label><input value={form.username} onChange={(e) => set({ username: e.target.value })} /></div>
          <div className="field">
            <label>Employee</label>
            <select value={form.employee} onChange={(e) => set({ employee: e.target.value })}>
              <option value="">Select employee</option>
              {employees.map((e) => <option key={e.id} value={e.name}>{e.name}</option>)}
            </select>
          </div>
          <div className="field"><label>Email *</label><input value={form.email} onChange={(e) => set({ email: e.target.value })} /></div>
          <div className="field">
            <label>Role</label>
            <select value={form.role} onChange={(e) => set({ role: e.target.value })}>
              {roleNames.length ? roleNames.map((r) => <option key={r}>{r}</option>) : <option>Administrator</option>}
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => set({ status: e.target.value })}>
              <option>Active</option><option>Inactive</option>
            </select>
          </div>
        </div>
      </div>
    </FormPage>
  );
}
