import { mountLayout } from '/dashboard/layout.js';
import { api } from '/shared/api.js';
import { severityBadgeHtml } from '/dashboard/charts.js';

await mountLayout();

const wrap = document.getElementById('tableWrap');
try {
  const { cases } = await api.get('/api/dashboard/cases');
  wrap.innerHTML = `
    <div class="table-scroll">
      <table class="dvpe-table">
        <thead><tr><th>ID Kasus</th><th>Kategori</th><th>Korban</th><th>Lokasi</th><th>Prioritas</th><th>Waktu</th></tr></thead>
        <tbody>
          ${cases
            .map((c) => `<tr><td class="mono">${c.id}</td><td>${c.category}</td><td>${c.victim}</td><td>${c.location}</td><td>${severityBadgeHtml(c.severity)}</td><td class="text-muted">${c.ago}</td></tr>`)
            .join('')}
        </tbody>
      </table>
    </div>`;
} catch (err) {
  wrap.innerHTML = `<div class="dvpe-alert dvpe-alert-error">${err.message}</div>`;
}
