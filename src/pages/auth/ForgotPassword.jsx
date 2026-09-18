import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import AuthLayout from './AuthLayout';

const STEPS = { IDENTIFY: 'identify', VERIFY: 'verify', RESET: 'reset', DONE: 'done' };

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.IDENTIFY);
  const [identifier, setIdentifier] = useState('');
  const [devCode, setDevCode] = useState('');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const handleIdentify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await authService.requestPasswordReset(identifier);
    setLoading(false);
    if (res.success) {
      setDevCode(res.code); // shown only because this is a local prototype with no email backend
      setStep(STEPS.VERIFY);
    } else {
      setError(res.message);
    }
  };

  const handleCodeChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...codeDigits];
    next[idx] = val;
    setCodeDigits(next);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await authService.verifyResetCode(codeDigits.join(''));
    setLoading(false);
    if (res.success) {
      setStep(STEPS.RESET);
    } else {
      setError(res.message);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    await authService.resetPassword(newPassword);
    setLoading(false);
    setStep(STEPS.DONE);
  };

  return (
    <AuthLayout>
      {step === STEPS.IDENTIFY && (
        <>
          <h2 className="auth-title">Forgot password</h2>
          <p className="auth-subtitle">Enter your username or email to receive a verification code.</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleIdentify}>
            <div className="auth-field">
              <label>Username or Email</label>
              <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="noman or noman@company.com" required />
            </div>
            <button className="auth-submit" disabled={loading}>{loading ? 'Sending…' : 'Send Verification Code'}</button>
          </form>
          <Link className="auth-back-link" to="/login">← Back to sign in</Link>
        </>
      )}

      {step === STEPS.VERIFY && (
        <>
          <h2 className="auth-title">Verify your identity</h2>
          <p className="auth-subtitle">Enter the 6-digit code sent to your account.</p>
          <div className="auth-hint-box">Prototype mode — your verification code is <b>{devCode}</b> (would normally be emailed).</div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleVerify}>
            <div className="auth-code-inputs">
              {codeDigits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  value={d}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  maxLength={1}
                  inputMode="numeric"
                />
              ))}
            </div>
            <button className="auth-submit" disabled={loading}>{loading ? 'Verifying…' : 'Verify Code'}</button>
          </form>
          <Link className="auth-back-link" to="/login">← Back to sign in</Link>
        </>
      )}

      {step === STEPS.RESET && (
        <>
          <h2 className="auth-title">Set a new password</h2>
          <p className="auth-subtitle">Choose a strong password for your account.</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleReset}>
            <div className="auth-field">
              <label>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label>Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <button className="auth-submit" disabled={loading}>{loading ? 'Updating…' : 'Reset Password'}</button>
          </form>
        </>
      )}

      {step === STEPS.DONE && (
        <div className="auth-center-text">
          <div className="auth-success-icon">✓</div>
          <h2 className="auth-title">Password changed</h2>
          <p className="auth-subtitle">Your password has been updated successfully. You can now sign in.</p>
          <button className="auth-submit" onClick={() => navigate('/login')}>Go to Sign in</button>
        </div>
      )}
    </AuthLayout>
  );
}
