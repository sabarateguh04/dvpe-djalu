import { navGroups } from './nav.js';
import { logout } from '../shared/api.js';

const SIDEBAR_KEY = 'dvpe_portal_sidebar_collapsed';

function navHtml(collapsed) {
  return navGroups
    .map((group) => `
      <div class="portal-nav-group">
        ${group.title && !collapsed ? `<div class="portal-nav-title">${group.title}</div>` : ''}
        ${group.items
          .map((item) => {
            const active = window.location.pathname === new URL(item.href, window.location.origin).pathname;
            return `<a class="portal-nav-item${active ? ' active' : ''}" href="${item.href}" ${collapsed ? `title="${item.label}"` : ''}><span>${item.icon}</span>${!collapsed ? `<span>${item.label}</span>` : ''}</a>`;
          })
          .join('')}
      </div>`)
    .join('');
}

function sidebarHtml(collapsed) {
  return `
    <aside class="portal-sidebar${collapsed ? ' collapsed' : ''}" id="sidebar">
      <div class="portal-sidebar-inner">
        <div class="portal-brand">
          <div class="portal-brand-mark">🛡️</div>
          ${!collapsed ? `<div><div class="portal-brand-title">DVPE</div><div class="portal-brand-sub">Digital Victim Protection Ecosystem</div></div>` : ''}
        </div>
        <nav class="portal-nav">${navHtml(collapsed)}</nav>
        <div class="portal-panic-box">
          ${!collapsed ? `<div class="portal-panic-title">Butuh Bantuan Mendesak?</div><div class="portal-panic-sub">Tekan tombol Panic Button jika Anda dalam bahaya.</div>` : ''}
          <a href="/portal/panic.html" class="dvpe-btn dvpe-btn-danger portal-panic-btn" ${collapsed ? 'title="Panic Button"' : ''}>🆘 ${!collapsed ? 'Panic Button' : ''}</a>
        </div>
      </div>
    </aside>`;
}

function topbarHtml() {
  return `
    <header class="portal-topbar">
      <button class="dash-icon-btn portal-sidebar-toggle" id="btnToggleSidebar" title="Sembunyikan/tampilkan sidebar">☰</button>
      <div>
        <div class="portal-greet">👋 Halo, selamat datang!</div>
        <div class="portal-greet-sub">Anda tidak sendiri. Kami ada untuk membantu.</div>
      </div>
      <div class="portal-topbar-right">
        <span class="portal-safe-pill">🛡️ <span>Aman &amp; Rahasia<br /><b>Data Anda terlindungi</b></span></span>
        <button class="filter-pill sm">ID ▾</button>
        <button class="dvpe-btn dvpe-btn-ghost" id="btnLogout">Keluar</button>
      </div>
    </header>`;
}

export async function mountLayout() {
  let collapsed = false;
  try { collapsed = localStorage.getItem(SIDEBAR_KEY) === '1'; } catch {}

  const shell = document.getElementById('portalShell');
  const main = document.getElementById('portalMain');
  shell.insertAdjacentHTML('afterbegin', sidebarHtml(collapsed));
  main.insertAdjacentHTML('afterbegin', topbarHtml());

  // The toggle button lives in the topbar, which is never re-rendered - so
  // its listener is attached once here, not re-wired every toggle (only
  // #sidebar's markup gets swapped out below).
  document.getElementById('btnToggleSidebar').addEventListener('click', () => {
    collapsed = !collapsed;
    try { localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0'); } catch {}
    document.getElementById('sidebar').outerHTML = sidebarHtml(collapsed);
  });
  document.getElementById('btnLogout').addEventListener('click', async () => {
    await logout('portal');
    window.location.href = '/portal/login.html';
  });
}
