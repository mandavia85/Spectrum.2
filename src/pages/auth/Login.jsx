import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password, rememberMe);
    if (result.success) {
      const dest = location.state?.from || '/dashboard';
      navigate(dest, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-title">Sign in</h2>
      <p className="auth-subtitle">Enter your credentials to access the ERP workspace.</p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            autoComplete="username"
            required
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <div className="auth-input-wrap">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button type="button" className="pw-toggle" onClick={() => setShowPw((s) => !s)}>
              {showPw ? 'HIDE' : 'SHOW'}
            </button>
          </div>
        </div>

        <div className="auth-row-between">
          <label className="auth-remember">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            Remember me
          </label>
          <Link className="auth-link" to="/forgot-password">Forgot password?</Link>
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="credential-hint">
        Prototype credentials — Username: <b>noman</b> &nbsp;|&nbsp; Password: <b>noman@123</b>
      </p>
    </AuthLayout>
  );
}
