import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../../shared/api.js';

const STEPS = ['Kronologi', 'Detail', 'Lampiran', 'Selesai'];

export default function ReportWizard() {
  const [params] = useSearchParams();
  const [content, setContent] = useState(null);
  const [step, setStep] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [chronology, setChronology] = useState('');
  const [incidentAt, setIncidentAt] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [anonymous, setAnonymous] = useState(params.get('persona') === 'anonim');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get('/api/portal/content').then(setContent).catch(() => {});
  }, []);

  const reporterRole = params.get('persona') || 'korban';

  const submit = async () => {
    setError('');
    if (!categoryId) return setError('Pilih jenis laporan terlebih dahulu.');
    if (chronology.trim().length < 10) return setError('Ceritakan kronologi minimal 10 karakter.');
    setSubmitting(true);
    try {
      const res = await api.post('/api/reports', {
        categoryId,
        reporterRole,
        chronology,
        incidentAt: incidentAt || null,
        location: location || null,
        contact: anonymous ? null : contact || null,
        anonymous,
      });
      setResult(res);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="dvpe-card pad report-success">
        <div className="report-success-icon">✅</div>
        <h2>Laporan Berhasil Dikirim</h2>
        <p className="text-muted">{result.message}</p>
        <div className="report-id-box">Nomor Laporan Anda<br /><strong>{result.id}</strong></div>
        <p className="text-muted small">Simpan nomor ini untuk memeriksa status laporan Anda kapan saja di menu "Cek Status Laporan".</p>
      </div>
    );
  }

  return (
    <div className="dvpe-card pad">
      <div className="wizard-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={'wizard-step' + (i <= step ? ' active' : '')}>
            <span className="wizard-step-num">{i + 1}</span> {s}
          </div>
        ))}
      </div>

      {step === 0 && (
        <>
          <div className="card-title">Pilih jenis laporan</div>
          <p className="text-muted small">Pilih kategori yang paling sesuai dengan kejadian yang Anda alami atau ketahui.</p>
          <div className="category-grid">
            {(content?.reportCategories || []).map((c) => (
              <button
                key={c.id}
                className={'category-item' + (categoryId === c.id ? ' selected' : '')}
                onClick={() => setCategoryId(c.id)}
              >
                <div className="category-label">{c.label}</div>
                <div className="category-desc">{c.desc}</div>
              </button>
            ))}
          </div>
          {error && <div className="dvpe-alert dvpe-alert-error" style={{ marginTop: 12 }}>{error}</div>}
          <button className="dvpe-btn dvpe-btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => (categoryId ? setStep(1) : setError('Pilih jenis laporan terlebih dahulu.'))}>
            Selanjutnya
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <div className="card-title">Ceritakan Kronologi</div>
          <p className="text-muted small">Tuliskan secara singkat apa yang terjadi. Anda tidak perlu menuliskan hal yang membuat Anda tidak nyaman.</p>
          <textarea className="dvpe-textarea" rows={6} maxLength={2000} value={chronology} onChange={(e) => setChronology(e.target.value)} placeholder="Mulai ceritakan kronologi kejadian..." />
          <div className="text-muted small" style={{ textAlign: 'right' }}>{chronology.length}/2000</div>

          <label className="field-label" style={{ marginTop: 10 }}>Kapan kejadian terjadi? (opsional)</label>
          <input className="dvpe-input" type="date" value={incidentAt} onChange={(e) => setIncidentAt(e.target.value)} />

          {error && <div className="dvpe-alert dvpe-alert-error" style={{ marginTop: 12 }}>{error}</div>}
          <div className="wizard-nav">
            <button className="dvpe-btn dvpe-btn-ghost" onClick={() => setStep(0)}>Kembali</button>
            <button className="dvpe-btn dvpe-btn-primary" onClick={() => setStep(2)}>Selanjutnya</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="card-title">Detail Tambahan</div>
          <label className="field-label">Lokasi kejadian (opsional)</label>
          <input className="dvpe-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Kota / Kabupaten" />

          <label className="field-label" style={{ marginTop: 10 }}>
            <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} /> Kirim sebagai laporan anonim
          </label>

          {!anonymous && (
            <>
              <label className="field-label" style={{ marginTop: 10 }}>Kontak Anda (opsional, untuk dihubungi kembali)</label>
              <input className="dvpe-input" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="No. HP atau email" />
            </>
          )}

          {error && <div className="dvpe-alert dvpe-alert-error" style={{ marginTop: 12 }}>{error}</div>}
          <div className="wizard-nav">
            <button className="dvpe-btn dvpe-btn-ghost" onClick={() => setStep(1)}>Kembali</button>
            <button className="dvpe-btn dvpe-btn-primary" disabled={submitting} onClick={submit}>
              {submitting ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
