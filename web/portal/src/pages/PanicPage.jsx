import React, { useState } from 'react';
import { api } from '../../../shared/api.js';

export default function PanicPage() {
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const trigger = async () => {
    setError('');
    setSending(true);
    try {
      const res = await api.post('/api/panic', {});
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
      setConfirming(false);
    }
  };

  return (
    <div className="dvpe-card pad panic-page">
      <div className="panic-icon">🆘</div>
      <h2>Panic Button</h2>
      <p className="text-muted">Gunakan tombol ini hanya jika Anda dalam situasi darurat dan membutuhkan bantuan segera.</p>

      {!result && !confirming && (
        <button className="dvpe-btn dvpe-btn-danger" style={{ padding: '14px 30px', fontSize: 15 }} onClick={() => setConfirming(true)}>
          🆘 Aktifkan Panic Button
        </button>
      )}

      {confirming && (
        <div className="dvpe-alert dvpe-alert-warn" style={{ maxWidth: 420, margin: '0 auto' }}>
          <p>Anda akan mengirim sinyal darurat ke tim respons. Lanjutkan?</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 10 }}>
            <button className="dvpe-btn dvpe-btn-ghost" onClick={() => setConfirming(false)}>Batal</button>
            <button className="dvpe-btn dvpe-btn-danger" onClick={trigger} disabled={sending}>{sending ? 'Mengirim...' : 'Ya, Kirim Sinyal'}</button>
          </div>
        </div>
      )}

      {error && <div className="dvpe-alert dvpe-alert-error">{error}</div>}
      {result && (
        <div className="dvpe-alert dvpe-alert-info" style={{ maxWidth: 420, margin: '0 auto' }}>
          <p>{result.message}</p>
          <p>Hotline 24 jam: <strong>{result.hotline}</strong></p>
        </div>
      )}
    </div>
  );
}
