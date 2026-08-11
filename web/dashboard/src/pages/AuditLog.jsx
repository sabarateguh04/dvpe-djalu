import React, { useEffect, useState } from 'react';
import { api } from '../../../shared/api.js';

export default function AuditLog() {
  const [state, setState] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/api/dashboard/audit-log').then(setState).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  return (
    <div className="dvpe-card pad">
      <div className="card-title-row">
        <div className="card-title">Audit Log</div>
        <button className="dvpe-btn dvpe-btn-ghost" onClick={load}>Muat Ulang</button>
      </div>
      <p className="text-muted small">
        Setiap entri di-hash secara berantai (hash dari entri sebelumnya + isi entri) sehingga
        setiap perubahan atau penghapusan entri lama akan merusak rantai dan bisa dideteksi -
        implementasi awal dari konsep "Immutable Audit Trail" pada proposal DVPE.
      </p>
      {error && <div className="dvpe-alert dvpe-alert-error">{error}</div>}
      {state && (
        <>
          <div className={'dvpe-alert ' + (state.chain.ok ? 'dvpe-alert-info' : 'dvpe-alert-error')} style={{ marginBottom: 12 }}>
            {state.chain.ok ? `✅ Integritas rantai audit terverifikasi (${state.chain.entries} entri).` : `⚠️ Rantai audit rusak pada entri ${state.chain.brokenAt}.`}
          </div>
          <div className="table-scroll">
            <table className="dvpe-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Area</th>
                  <th>Aksi</th>
                  <th>Aktor</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {state.entries.map((e) => (
                  <tr key={e.id}>
                    <td className="text-muted small">{new Date(e.ts).toLocaleString('id-ID')}</td>
                    <td>{e.area}</td>
                    <td className="mono">{e.action}</td>
                    <td>{e.actor}</td>
                    <td className="text-muted">{e.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
