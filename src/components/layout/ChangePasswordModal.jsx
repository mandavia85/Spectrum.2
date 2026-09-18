import { useState } from 'react';
import { Modal } from '../common/UI';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

export default function ChangePasswordModal({ open, onClose }) {
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) return setError('New password must be at least 6 characters.');
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');
    setLoading(true);
    const res = await authService.changePassword(currentPassword, newPassword);
    setLoading(false);
    if (res.success) {
      toast.success('Password updated successfully.');
      reset();
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title="Change Password" width={420}
      footer={
        <>
          <button className="btn" onClick={() => { reset(); onClose(); }}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Updating…' : 'Update Password'}</button>
        </>
      }
    >
      {error && <div className="auth-error">{error}</div>}
      <div className="field" style={{ marginBottom: 14 }}>
        <label>Current Password</label>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
      </div>
      <div className="field" style={{ marginBottom: 14 }}>
        <label>New Password</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      </div>
      <div className="field">
        <label>Confirm New Password</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </div>
    </Modal>
  );
}
