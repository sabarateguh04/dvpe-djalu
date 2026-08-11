import React, { useEffect, useState } from 'react';
import {
  FilePlus2, FolderOpen, CheckCircle2, UserCheck2, ChevronDown, CalendarDays,
  Plus, Siren, SearchCheck, MessageSquareText, MapPin,
  SquareCheck, AlertTriangle, Info,
} from 'lucide-react';
import { api } from '../../../shared/api.js';
import { useAuth } from '../auth/AuthContext.jsx';
import StatCard from '../components/StatCard.jsx';
import TrendChart from '../components/TrendChart.jsx';
import DonutChart from '../components/DonutChart.jsx';
import CaseFlow from '../components/CaseFlow.jsx';
import PriorityCases from '../components/PriorityCases.jsx';
import RiskMapCard from '../components/RiskMapCard.jsx';

export default function DashboardHome() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/dashboard/overview').then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="dvpe-alert dvpe-alert-error">{error}</div>;
  if (!data) return <div style={{ color: '#898781' }}>Memuat ringkasan...</div>;

  const total = data.caseStatusBreakdown.reduce((s, c) => s + c.value, 0);

  return (
    <div className="dash-grid">
      <div className="dash-grid-main">
        <div className="greeting-row">
          <div className="greeting">
            <h1>Selamat pagi, {user?.displayName} 👋</h1>
            <p>Berikut ringkasan penanganan kasus hari ini.</p>
          </div>
          <div className="greeting-filters">
            <button className="filter-pill">Semua Wilayah <ChevronDown size={14} /></button>
            <button className="filter-pill"><CalendarDays size={14} /> 04 Mei 2026</button>
          </div>
        </div>

        <div className="stat-grid">
          <StatCard tone="purple" label="Kasus Baru Hari ini" value={data.summary.newToday.value} delta={data.summary.newToday.deltaLabel} icon={FilePlus2} />
          <StatCard tone="blue" label="Dalam Penanganan" value={data.summary.inProgress.value} delta={data.summary.inProgress.deltaLabel} icon={FolderOpen} />
          <StatCard tone="green" label="Selesai" value={data.summary.resolved.value} delta={data.summary.resolved.deltaLabel} icon={CheckCircle2} />
          <StatCard tone="orange" label="Korban Terlindungi" value={data.summary.victimsProtected.value} delta={data.summary.victimsProtected.deltaLabel} icon={UserCheck2} />
        </div>

        <div className="two-col">
          <div className="dvpe-card pad">
            <div className="card-title-row">
              <div className="card-title">Peta Kerawanan</div>
              <div className="map-legend">
                <span><i className="dot" style={{ background: '#0ca30c' }} /> Rendah</span>
                <span><i className="dot" style={{ background: '#fab219' }} /> Sedang</span>
                <span><i className="dot" style={{ background: '#d03b3b' }} /> Tinggi</span>
              </div>
            </div>
            <RiskMapCard riskMap={data.riskMap} />
          </div>
          <div className="dvpe-card pad">
            <div className="card-title-row">
              <div className="card-title">Tren Kasus (7 Hari Terakhir)</div>
              <button className="filter-pill sm">7 Hari <ChevronDown size={13} /></button>
            </div>
            <TrendChart days={data.trend.days} series={data.trend.series} />
          </div>
        </div>

        <div className="two-col">
          <div className="dvpe-card pad">
            <div className="card-title">Status Penanganan Kasus</div>
            <DonutChart data={data.caseStatusBreakdown} total={total} />
          </div>
          <div className="dvpe-card pad">
            <div className="card-title">Alur Penanganan</div>
            <CaseFlow steps={data.caseFlow} />
            <div className="card-footer-right">
              <a href="#" className="link-sm">Lihat Alur Detail →</a>
            </div>
          </div>
        </div>

        <div className="three-col">
          <div className="dvpe-card pad list-card">
            <div className="card-title">Pengingat Tugas</div>
            <div className="list-card-body">
              {data.reminders.map((r) => (
                <div className="icon-row" key={r.text}>
                  <span className="icon-row-icon tone-purple"><SquareCheck size={13} /></span>
                  <span className="icon-row-title-line">
                    <span className="icon-row-title-trunc" title={r.text}>{r.text}</span>
                    <span className={'icon-row-time ' + (r.late ? 'text-danger' : 'text-muted')}>{r.when}</span>
                  </span>
                </div>
              ))}
            </div>
            <a href="#" className="link-sm">Lihat Semua Tugas →</a>
          </div>
          <div className="dvpe-card pad list-card">
            <div className="card-title">Notifikasi Sistem</div>
            <div className="list-card-body">
              {data.systemNotifications.map((n) => {
                const splitAt = n.text.indexOf(':');
                const hasTitle = splitAt > -1;
                const title = hasTitle ? n.text.slice(0, splitAt).trim() : null;
                const desc = hasTitle ? n.text.slice(splitAt + 1).trim() : n.text;
                const isWarning = /peringatan/i.test(n.text);
                return (
                  <div className="icon-row" key={n.text}>
                    <span className={'icon-row-icon ' + (isWarning ? 'tone-red' : 'tone-blue')}>
                      {isWarning ? <AlertTriangle size={13} /> : <Info size={13} />}
                    </span>
                    <span className="icon-row-block">
                      {title && <div className="icon-row-title">{title}</div>}
                      <div className="icon-row-desc">{desc}</div>
                      <div className="icon-row-time text-muted">{n.when}</div>
                    </span>
                  </div>
                );
              })}
            </div>
            <a href="#" className="link-sm">Lihat Semua Notifikasi →</a>
          </div>
          <div className="dvpe-card pad list-card">
            <div className="card-title">Layanan Terdekat</div>
            <div className="list-card-body">
              {data.nearbyServices.map((s) => (
                <div className="icon-row" key={s.name}>
                  <span className="icon-row-icon tone-green"><MapPin size={13} /></span>
                  <span className="icon-row-title-line">
                    <span className="icon-row-title-trunc" title={s.name}>{s.name}</span>
                    <span className="icon-row-time text-muted">{s.distanceKm} km</span>
                  </span>
                </div>
              ))}
            </div>
            <a href="#" className="link-sm">Lihat Semua Layanan →</a>
          </div>
        </div>
      </div>

      <div className="dash-grid-side">
        <div className="dvpe-card pad">
          <div className="card-title">Aksi Cepat</div>
          <div className="quick-actions-grid">
            <button className="quick-action purple"><span className="qa-icon"><Plus size={16} /></span> Buat Laporan</button>
            <button className="quick-action red"><span className="qa-icon"><Siren size={16} /></span> Panic Button</button>
            <button className="quick-action blue"><span className="qa-icon"><SearchCheck size={16} /></span> Cek Status Kasus</button>
            <button className="quick-action violet"><span className="qa-icon"><MessageSquareText size={16} /></span> Chat dengan AI</button>
          </div>
          <button className="quick-action green full">
            <span className="qa-icon"><MapPin size={16} /></span> Cari Layanan Terdekat
          </button>
        </div>

        <div className="dvpe-card pad">
          <div className="card-title-row">
            <div className="card-title">Kasus Prioritas</div>
            <a href="#" className="link-sm">Lihat Semua</a>
          </div>
          <PriorityCases cases={data.priorityCases} />
          <button className="dvpe-btn dvpe-btn-primary" style={{ width: '100%', marginTop: 10 }}>Semua Kasus Prioritas</button>
        </div>
      </div>
    </div>
  );
}
