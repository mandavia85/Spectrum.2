import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormPage from '../../components/common/FormPage';
import { StatusBadge } from '../../components/common/UI';
import { useToast } from '../../context/ToastContext';
import { employeeService } from '../../services/dataService';

const emptyEmployee = {
  empId: '', name: '', department: '', designation: '', joiningDate: '', employmentStatus: 'Active',
  bankAccount: '', basicSalary: 0, costCenter: '',
};

export default function EmployeeForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(emptyEmployee);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) employeeService.get(id).then((rec) => { setForm(rec); setLoading(false); });
  }, [id, isEdit]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSave = async () => {
    if (!form.empId || !form.name) { toast.error('Employee ID and Name are required.'); return; }
    if (isEdit) {
      await employeeService.update(id, form);
      toast.success('Employee updated successfully.');
    } else {
      await employeeService.create(form);
      toast.success('Employee added successfully.');
    }
    navigate('/payroll');
  };

  return (
    <FormPage
      title={isEdit ? `Edit Employee — ${form.name || ''}` : 'Add Employee'}
      subtitle="Payroll — Employees"
      statusSlot={isEdit && <StatusBadge status={form.employmentStatus} />}
      backTo="/payroll"
      loading={loading}
      actions={
        <>
          <button className="btn" onClick={() => navigate('/payroll')}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </>
      }
    >
      <div className="card" style={{ padding: 20 }}>
        <div className="section-title">Employee Details</div>
        <div className="form-grid">
          <div className="field"><label>Employee ID *</label><input value={form.empId} onChange={(e) => set({ empId: e.target.value })} /></div>
          <div className="field"><label>Name *</label><input value={form.name} onChange={(e) => set({ name: e.target.value })} /></div>
          <div className="field"><label>Department</label><input value={form.department} onChange={(e) => set({ department: e.target.value })} /></div>
          <div className="field"><label>Designation</label><input value={form.designation} onChange={(e) => set({ designation: e.target.value })} /></div>
          <div className="field"><label>Joining Date</label><input type="date" value={form.joiningDate} onChange={(e) => set({ joiningDate: e.target.value })} /></div>
          <div className="field"><label>Basic Salary</label><input type="number" value={form.basicSalary} onChange={(e) => set({ basicSalary: Number(e.target.value) })} /></div>
          <div className="field"><label>Bank Account</label><input value={form.bankAccount} onChange={(e) => set({ bankAccount: e.target.value })} /></div>
          <div className="field"><label>Cost Center</label><input value={form.costCenter} onChange={(e) => set({ costCenter: e.target.value })} /></div>
          <div className="field">
            <label>Employment Status</label>
            <select value={form.employmentStatus} onChange={(e) => set({ employmentStatus: e.target.value })}>
              <option>Active</option><option>Inactive</option><option>Terminated</option>
            </select>
          </div>
        </div>
      </div>
    </FormPage>
  );
}
