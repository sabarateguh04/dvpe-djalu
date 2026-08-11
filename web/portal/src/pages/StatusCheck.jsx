import React, { useState } from 'react';
import { api } from '../../../shared/api.js';

export default function StatusCheck() {
  const [id, setId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const check = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await api.get(`/api/reports/${encodeURIComponent(id.trim())}/status`);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dvpe-card pad" style={{ maxWidth: 480 }}>
      <div className="card-title">Cek Status Laporan</div>
      <p className="text-muted small">Masukkan nomor laporan yang Anda terima saat mengirim laporan (contoh: DVPE-2026-A1B2C3).</p>
      <form onSubmit={check}>
        <input className="dvpe-input" value={id} onChange={(e) => setId(e.target.value)} placeholder="DVPE-2026-XXXXXX" required />
        <button className="dvpe-btn dvpe-btn-primary" style={{ width: '100%', marginTop: 12 }} disabled={loading}>
          {loading ? 'Memeriksa...' : 'Cek Status'}
        </button>
      </form>
      {error && <div className="dvpe-alert dvpe-alert-error" style={{ marginTop: 12 }}>{error}</div>}
      {result && (
        <div className="dvpe-alert dvpe-alert-info" style={{ marginTop: 12 }}>
          <div><strong>{result.id}</strong> &bull; {result.category}</div>
          <div>Status: <strong>{result.status}</strong></div>
          <div className="text-muted small">Dilaporkan: {new Date(result.createdAt).toLocaleString('id-ID')}</div>
        </div>
      )}
    </div>
  );
}
