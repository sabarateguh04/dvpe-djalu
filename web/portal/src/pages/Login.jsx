import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-login-shell">
      <div className="login-card dvpe-card">
        <div className="login-brand">
          <div className="portal-brand-mark"><ShieldCheck size={18} strokeWidth={2.4} /></div>
          <div>
            <div className="login-brand-title">DVPE Portal</div>
            <div className="login-brand-sub">Pratinjau portal layanan masyarakat</div>
          </div>
        </div>

        <div className="dvpe-alert dvpe-alert-info" style={{ marginBottom: 16 }}>
          Mockup demo - gunakan kredensial: <strong>portal / portal</strong>
        </div>

        <form onSubmit={submit}>
          <label className="field-label">Username</label>
          <input className="dvpe-input" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
          <label className="field-label" style={{ marginTop: 12 }}>Password</label>
          <input className="dvpe-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />

          {error && <div className="dvpe-alert dvpe-alert-error" style={{ marginTop: 12 }}>{error}</div>}

          <button className="dvpe-btn dvpe-btn-primary" style={{ width: '100%', marginTop: 18 }} disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        <div className="login-footnote">
          Di produksi, portal ini terbuka untuk publik tanpa login - gerbang ini hanya untuk pratinjau internal.
        </div>
      </div>
    </div>
  );
}
