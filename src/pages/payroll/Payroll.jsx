import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/common/DataTable';
import { Modal, ConfirmDialog, StatusBadge } from '../../components/common/UI';
import { useToast } from '../../context/ToastContext';
import { employeeService, payrollRunService } from '../../services/dataService';
import './Payroll.css';

function calcNet(basic, allowances, overtime, deductions) {
  const gross = basic + allowances + overtime;
  const tax = Math.round(gross * 0.15);
  const net = gross - deductions - tax;
  return { gross, tax, net };
}

export default function Payroll() {
  const toast = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [payrollRuns, setPayrollRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [period, setPeriod] = useState('September 2026');
  const [runModalOpen, setRunModalOpen] = useState(false);
  const [runForm, setRunForm] = useState({ employeeId: '', allowances: 0, overtime: 0, deductions: 0 });

  const load = () => {
    setLoading(true);
    Promise.all([employeeService.list(), payrollRunService.list()]).then(([e, p]) => { setEmployees(e); setPayrollRuns(p); setLoading(false); });
  };
  useEffect(load, []);

  const deleteEmp = async () => {
    await employeeService.remove(deleteTarget.id);
    toast.success('Employee removed.');
    setDeleteTarget(null);
    load();
  };

  // "Calculate Payroll" stays a Quick Create popup — a fast, single-purpose
  // action the user performs without leaving the processing tab.
  const openRunPayroll = () => { setRunForm({ employeeId: '', allowances: 0, overtime: 0, deductions: 0 }); setRunModalOpen(true); };

  const saveRun = async () => {
    const emp = employees.find((e) => e.id === runForm.employeeId);
    if (!emp) { toast.error('Please select an employee.'); return; }
    const { gross, tax, net } = calcNet(emp.basicSalary, Number(runForm.allowances), Number(runForm.overtime), Number(runForm.deductions));
    await payrollRunService.create({
      period, employeeId: emp.id, basic: emp.basicSalary, allowances: Number(runForm.allowances),
      overtime: Number(runForm.overtime), deductions: Number(runForm.deductions), tax, gross, net, status: 'Draft',
    });
    toast.success(`Payroll draft created for ${emp.name}.`);
    setRunModalOpen(false);
    load();
  };

  const approveRun = async (row) => {
    await payrollRunService.update(row.id, { status: 'Paid' });
    toast.success('Payroll run approved and marked as paid.');
    load();
  };

  const empColumns = [
    { key: 'empId', label: 'Employee ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'designation', label: 'Designation' },
    { key: 'basicSalary', label: 'Basic Salary', align: 'right', render: (r) => `$${r.basicSalary.toLocaleString()}` },
    { key: 'employmentStatus', label: 'Status', render: (r) => <StatusBadge status={r.employmentStatus} /> },
  ];

  const periodRuns = payrollRuns.filter((r) => r.period === period);
  const runColumns = [
    { key: 'employeeId', label: 'Employee', render: (r) => employees.find((e) => e.id === r.employeeId)?.name || r.employeeId },
    { key: 'basic', label: 'Basic', align: 'right', render: (r) => `$${r.basic.toLocaleString()}` },
    { key: 'allowances', label: 'Allowances', align: 'right', render: (r) => `$${r.allowances.toLocaleString()}` },
    { key: 'overtime', label: 'Overtime', align: 'right', render: (r) => `$${r.overtime.toLocaleString()}` },
    { key: 'tax', label: 'Tax', align: 'right', render: (r) => `$${r.tax.toLocaleString()}` },
    { key: 'net', label: 'Net Pay', align: 'right', render: (r) => `$${r.net.toLocaleString()}` },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div><h1>Payroll</h1><p>Manage employee records and process payroll runs.</p></div>
      </div>

      <div className="tab-strip">
        <button className={`tab-btn ${tab === 'employees' ? 'active' : ''}`} onClick={() => setTab('employees')}>Employees</button>
        <button className={`tab-btn ${tab === 'processing' ? 'active' : ''}`} onClick={() => setTab('processing')}>Payroll Processing</button>
        <button className={`tab-btn ${tab === 'other' ? 'active' : ''}`} onClick={() => setTab('other')}>Attendance / Leave / Loans</button>
      </div>

      {tab === 'employees' && (
        <DataTable
          columns={empColumns}
          rows={employees}
          loading={loading}
          searchKeys={['empId', 'name', 'department', 'designation']}
          toolbarRight={<button className="btn btn-primary" onClick={() => navigate('/payroll/employees/new')}>+ Add Employee</button>}
          emptyTitle="No employees yet"
          emptyMessage="Add your first employee record."
          onRowClick={(row) => navigate(`/payroll/employees/${row.id}/edit`)}
          actions={(row) => (
            <>
              <button className="btn btn-sm" onClick={() => navigate(`/payroll/employees/${row.id}/edit`)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(row)}>Delete</button>
            </>
          )}
        />
      )}

      {tab === 'processing' && (
        <>
          <div className="payroll-toolbar">
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option>September 2026</option><option>August 2026</option>
            </select>
            <button className="btn btn-primary" onClick={openRunPayroll}>+ Calculate Payroll</button>
          </div>
          <DataTable
            columns={runColumns}
            rows={periodRuns}
            loading={loading}
            searchKeys={[]}
            emptyTitle="No payroll runs for this period"
            emptyMessage="Calculate payroll for an employee to get started."
            actions={(row) => row.status === 'Draft' && <button className="btn btn-sm btn-primary" onClick={() => approveRun(row)}>Approve & Pay</button>}
          />
        </>
      )}

      {tab === 'other' && (
        <div className="card" style={{ padding: 30, textAlign: 'center', color: 'var(--slate-500)' }}>
          Attendance, Leave, Overtime and Loan/Advance modules are scaffolded for a future release and will reuse this same employee and payroll data.
        </div>
      )}

      {/* Quick Create — single-purpose, stays inline as a popup */}
      <Modal
        open={runModalOpen}
        onClose={() => setRunModalOpen(false)}
        title={`Calculate Payroll — ${period}`}
        width={500}
        footer={<><button className="btn" onClick={() => setRunModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={saveRun}>Generate Payslip</button></>}
      >
        <div className="form-grid">
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Employee</label>
            <select value={runForm.employeeId} onChange={(e) => setRunForm({ ...runForm, employeeId: e.target.value })}>
              <option value="">Select employee</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name} — ${e.basicSalary}/mo</option>)}
            </select>
          </div>
          <div className="field"><label>Allowances</label><input type="number" value={runForm.allowances} onChange={(e) => setRunForm({ ...runForm, allowances: e.target.value })} /></div>
          <div className="field"><label>Overtime</label><input type="number" value={runForm.overtime} onChange={(e) => setRunForm({ ...runForm, overtime: e.target.value })} /></div>
          <div className="field"><label>Deductions</label><input type="number" value={runForm.deductions} onChange={(e) => setRunForm({ ...runForm, deductions: e.target.value })} /></div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} message={`Remove employee "${deleteTarget?.name}"?`} onConfirm={deleteEmp} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
