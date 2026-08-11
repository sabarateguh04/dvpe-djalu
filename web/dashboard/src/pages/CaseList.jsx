import React, { useEffect, useState } from 'react';
import { api } from '../../../shared/api.js';
import SeverityBadge from '../components/SeverityBadge.jsx';

export default function CaseList() {
  const [cases, setCases] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/dashboard/cases').then((d) => setCases(d.cases)).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="dvpe-card pad">
      <div className="card-title">Daftar Kasus</div>
      {error && <div className="dvpe-alert dvpe-alert-error">{error}</div>}
      {!cases && !error && <div className="text-muted">Memuat...</div>}
      {cases && (
        <div className="table-scroll">
          <table className="dvpe-table">
            <thead>
              <tr>
                <th>ID Kasus</th>
                <th>Kategori</th>
                <th>Korban</th>
                <th>Lokasi</th>
                <th>Prioritas</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id}>
                  <td className="mono">{c.id}</td>
                  <td>{c.category}</td>
                  <td>{c.victim}</td>
                  <td>{c.location}</td>
                  <td><SeverityBadge level={c.severity} /></td>
                  <td className="text-muted">{c.ago}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
