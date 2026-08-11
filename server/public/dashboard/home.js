import { mountLayout } from '/dashboard/layout.js';
import { api } from '/shared/api.js';
import { statCardHtml, trendChartHtml, donutChartHtml, riskMapHtml, caseFlowHtml, priorityCasesHtml } from '/dashboard/charts.js';

await mountLayout();

const content = document.getElementById('pageContent');
try {
  const data = await api.get('/api/dashboard/overview');
  const total = data.caseStatusBreakdown.reduce((s, c) => s + c.value, 0);

  content.innerHTML = `
    <div class="dash-grid">
      <div class="dash-grid-main">
        <div class="greeting-row">
          <div class="greeting">
            <h1>Selamat datang 👋</h1>
            <p>Berikut ringkasan penanganan kasus hari ini.</p>
          </div>
          <div class="greeting-filters">
            <button class="filter-pill">Semua Wilayah ▾</button>
            <button class="filter-pill">📅 04 Mei 2026</button>
          </div>
        </div>

        <div class="stat-grid">
          ${statCardHtml({ tone: 'purple', label: 'Kasus Baru Hari ini', value: data.summary.newToday.value, delta: data.summary.newToday.deltaLabel, icon: '📝' })}
          ${statCardHtml({ tone: 'blue', label: 'Dalam Penanganan', value: data.summary.inProgress.value, delta: data.summary.inProgress.deltaLabel, icon: '📁' })}
          ${statCardHtml({ tone: 'green', label: 'Selesai', value: data.summary.resolved.value, delta: data.summary.resolved.deltaLabel, icon: '✅' })}
          ${statCardHtml({ tone: 'orange', label: 'Korban Terlindungi', value: data.summary.victimsProtected.value, delta: data.summary.victimsProtected.deltaLabel, icon: '🧑' })}
        </div>

        <div class="two-col">
          <div class="dvpe-card pad">
            <div class="card-title-row">
              <div class="card-title">Peta Kerawanan</div>
              <div class="map-legend"><span><i class="dot" style="background:#0ca30c"></i> Rendah</span><span><i class="dot" style="background:#fab219"></i> Sedang</span><span><i class="dot" style="background:#d03b3b"></i> Tinggi</span></div>
            </div>
            ${riskMapHtml(data.riskMap)}
          </div>
          <div class="dvpe-card pad">
            <div class="card-title-row"><div class="card-title">Tren Kasus (7 Hari Terakhir)</div><button class="filter-pill sm">7 Hari ▾</button></div>
            ${trendChartHtml(data.trend)}
          </div>
        </div>

        <div class="two-col">
          <div class="dvpe-card pad">
            <div class="card-title">Status Penanganan Kasus</div>
            ${donutChartHtml({ data: data.caseStatusBreakdown, total })}
          </div>
          <div class="dvpe-card pad">
            <div class="card-title">Alur Penanganan</div>
            ${caseFlowHtml(data.caseFlow)}
            <div class="card-footer-right"><a href="#" class="link-sm">Lihat Alur Detail →</a></div>
          </div>
        </div>

        <div class="three-col">
          <div class="dvpe-card pad list-card">
            <div class="card-title">Pengingat Tugas</div>
            <div class="list-card-body">
              ${data.reminders.map((r) => `<div class="icon-row"><span class="icon-row-icon tone-purple">☑️</span><span class="icon-row-title-line"><span class="icon-row-title-trunc" title="${r.text}">${r.text}</span><span class="icon-row-time ${r.late ? 'text-danger' : 'text-muted'}">${r.when}</span></span></div>`).join('')}
            </div>
            <a href="#" class="link-sm">Lihat Semua Tugas →</a>
          </div>
          <div class="dvpe-card pad list-card">
            <div class="card-title">Notifikasi Sistem</div>
            <div class="list-card-body">
              ${data.systemNotifications
                .map((n) => {
                  const splitAt = n.text.indexOf(':');
                  const hasTitle = splitAt > -1;
                  const title = hasTitle ? n.text.slice(0, splitAt).trim() : null;
                  const desc = hasTitle ? n.text.slice(splitAt + 1).trim() : n.text;
                  const isWarning = /peringatan/i.test(n.text);
                  return `<div class="icon-row"><span class="icon-row-icon ${isWarning ? 'tone-red' : 'tone-blue'}">${isWarning ? '⚠️' : 'ℹ️'}</span><span class="icon-row-block">${title ? `<div class="icon-row-title">${title}</div>` : ''}<div class="icon-row-desc">${desc}</div><div class="icon-row-time text-muted">${n.when}</div></span></div>`;
                })
                .join('')}
            </div>
            <a href="#" class="link-sm">Lihat Semua Notifikasi →</a>
          </div>
          <div class="dvpe-card pad list-card">
            <div class="card-title">Layanan Terdekat</div>
            <div class="list-card-body">
              ${data.nearbyServices.map((s) => `<div class="icon-row"><span class="icon-row-icon tone-green">📍</span><span class="icon-row-title-line"><span class="icon-row-title-trunc" title="${s.name}">${s.name}</span><span class="icon-row-time text-muted">${s.distanceKm} km</span></span></div>`).join('')}
            </div>
            <a href="#" class="link-sm">Lihat Semua Layanan →</a>
          </div>
        </div>
      </div>

      <div class="dash-grid-side">
        <div class="dvpe-card pad">
          <div class="card-title">Aksi Cepat</div>
          <div class="quick-actions-grid">
            <button class="quick-action purple"><span class="qa-icon">➕</span> Buat Laporan</button>
            <button class="quick-action red"><span class="qa-icon">🆘</span> Panic Button</button>
            <button class="quick-action blue"><span class="qa-icon">🔍</span> Cek Status Kasus</button>
            <button class="quick-action violet"><span class="qa-icon">💬</span> Chat dengan AI</button>
          </div>
          <button class="quick-action green full"><span class="qa-icon">📍</span> Cari Layanan Terdekat</button>
        </div>

        <div class="dvpe-card pad">
          <div class="card-title-row"><div class="card-title">Kasus Prioritas</div><a href="/dashboard/kasus.html" class="link-sm">Lihat Semua</a></div>
          ${priorityCasesHtml(data.priorityCases)}
          <a href="/dashboard/kasus.html" class="dvpe-btn dvpe-btn-primary" style="width:100%;margin-top:10px;text-decoration:none">Semua Kasus Prioritas</a>
        </div>
      </div>
    </div>`;
} catch (err) {
  content.innerHTML = `<div class="dvpe-alert dvpe-alert-error">${err.message}</div>`;
}
