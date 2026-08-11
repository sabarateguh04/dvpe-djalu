import { mountLayout } from '/dashboard/layout.js';
import { api } from '/shared/api.js';

await mountLayout();

const body = document.getElementById('body');

async function load() {
  body.innerHTML = 'Memuat...';
  try {
    const state = await api.get('/api/dashboard/audit-log');
    body.innerHTML = `
      <div class="dvpe-alert ${state.chain.ok ? 'dvpe-alert-info' : 'dvpe-alert-error'}" style="margin-bottom:12px">
        ${state.chain.ok ? `✅ Integritas rantai audit terverifikasi (${state.chain.entries} entri).` : `⚠️ Rantai audit rusak pada entri ${state.chain.brokenAt}.`}
      </div>
      <div class="table-scroll">
        <table class="dvpe-table">
          <thead><tr><th>Waktu</th><th>Area</th><th>Aksi</th><th>Aktor</th><th>IP</th></tr></thead>
          <tbody>
            ${state.entries
              .map((e) => `<tr><td class="text-muted small">${new Date(e.ts).toLocaleString('id-ID')}</td><td>${e.area}</td><td class="mono">${e.action}</td><td>${e.actor}</td><td class="text-muted">${e.ip}</td></tr>`)
              .join('')}
          </tbody>
        </table>
      </div>`;
  } catch (err) {
    body.innerHTML = `<div class="dvpe-alert dvpe-alert-error">${err.message}</div>`;
  }
}

document.getElementById('btnReload').addEventListener('click', load);
load();
