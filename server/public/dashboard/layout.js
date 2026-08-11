import { navGroups } from './nav.js';
import { getSession, logout } from '../shared/api.js';

const SIDEBAR_KEY = 'dvpe_dashboard_sidebar_collapsed';
const AI_KEY = 'dvpe_dashboard_ai_widget_open';

function navHtml(collapsed) {
  return navGroups
    .map((group) => `
      <div class="dash-nav-group">
        ${group.title && !collapsed ? `<div class="dash-nav-title">${group.title}</div>` : ''}
        ${group.items
          .map((item) => {
            const active = window.location.pathname === new URL(item.href, window.location.origin).pathname;
            return `
              <a class="dash-nav-item${active ? ' active' : ''}" href="${item.href}" ${collapsed ? `title="${item.label}"` : ''}>
                <span class="dash-nav-icon">${item.icon}</span>
                ${!collapsed ? `<span class="dash-nav-label">${item.label}</span>` : ''}
                ${!collapsed && item.badge ? `<span class="dash-nav-badge">${item.badge}</span>` : ''}
              </a>`;
          })
          .join('')}
      </div>`)
    .join('');
}

function sidebarHtml(collapsed) {
  return `
    <aside class="dash-sidebar${collapsed ? ' collapsed' : ''}" id="sidebar">
      <div class="dash-sidebar-inner">
        <div class="dash-brand">
          <div class="dash-brand-mark">🛡️</div>
          ${!collapsed ? `<div><div class="dash-brand-title">DVPE</div><div class="dash-brand-sub">Digital Victim Protection Ecosystem</div></div>` : ''}
        </div>
        <nav class="dash-nav">${navHtml(collapsed)}</nav>
        <button class="dash-help" id="btnOpenAi" title="${collapsed ? 'Pusat Bantuan' : ''}">🎧 ${!collapsed ? 'Pusat Bantuan' : ''}</button>
      </div>
    </aside>`;
}

function topbarHtml() {
  return `
    <header class="dash-topbar">
      <button class="dash-icon-btn" id="btnToggleSidebar" title="Sembunyikan/tampilkan sidebar">☰</button>
      <div class="dash-search">
        🔍<input placeholder="Cari kasus, korban, laporan, atau aktivitas..." /><span class="dash-search-kbd">Ctrl + K</span>
      </div>
      <div class="dash-topbar-right">
        <button class="dash-icon-btn" title="Notifikasi">🔔<span class="dash-icon-badge">12</span></button>
        <button class="dash-icon-btn" title="Pesan">💬</button>
        <button class="dash-icon-btn" title="Bantuan">❓</button>
        <div class="dash-user" id="userMenuTrigger">
          <div class="dash-user-avatar" id="userAvatar">?</div>
          <div><div class="dash-user-name" id="userName">...</div><div class="dash-user-title" id="userTitle"></div></div>
          <span>▾</span>
          <div class="dash-user-menu hidden" id="userMenu">
            <button class="dvpe-btn dvpe-btn-ghost" id="btnLogout" style="width:100%">Keluar</button>
          </div>
        </div>
      </div>
    </header>`;
}

function aiWidgetHtml(open) {
  if (!open) {
    return `<button class="ai-fab" id="aiFab" title="Buka AI Assistant">✨</button>`;
  }
  return `
    <div class="ai-card" id="aiCard">
      <button class="ai-card-close" id="aiClose" title="Sembunyikan">✕</button>
      <div class="ai-card-avatar">✨</div>
      <div class="ai-card-title">Hai, saya Alesha 👋</div>
      <div class="ai-sub">AI Assistant siap membantu anda</div>
      <button class="dvpe-btn ai-card-btn">Chat Sekarang</button>
    </div>`;
}

function renderAiWidget(open) {
  const mount = document.getElementById('aiWidgetMount');
  mount.innerHTML = aiWidgetHtml(open);
  if (open) {
    document.getElementById('aiClose').addEventListener('click', () => setAiOpen(false));
  } else {
    document.getElementById('aiFab').addEventListener('click', () => setAiOpen(true));
  }
}

function setAiOpen(open) {
  try { localStorage.setItem(AI_KEY, open ? '1' : '0'); } catch {}
  renderAiWidget(open);
}

export async function mountLayout() {
  let collapsed = false;
  try { collapsed = localStorage.getItem(SIDEBAR_KEY) === '1'; } catch {}

  const shell = document.getElementById('dashShell');
  const main = document.getElementById('dashMain');
  shell.insertAdjacentHTML('afterbegin', sidebarHtml(collapsed));
  main.insertAdjacentHTML('afterbegin', topbarHtml());

  const aiMount = document.createElement('div');
  aiMount.id = 'aiWidgetMount';
  document.body.appendChild(aiMount);
  let aiOpen = false;
  try { aiOpen = localStorage.getItem(AI_KEY) === '1'; } catch {}
  renderAiWidget(aiOpen);

  document.getElementById('btnToggleSidebar').addEventListener('click', () => {
    collapsed = !collapsed;
    try { localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0'); } catch {}
    document.getElementById('sidebar').outerHTML = sidebarHtml(collapsed);
    wireSidebar();
  });
  document.getElementById('btnOpenAi').addEventListener('click', () => setAiOpen(true));

  document.getElementById('userMenuTrigger').addEventListener('click', () => {
    document.getElementById('userMenu').classList.toggle('hidden');
  });
  document.getElementById('btnLogout').addEventListener('click', async () => {
    await logout('dashboard');
    window.location.href = '/dashboard/login.html';
  });

  function wireSidebar() {
    document.getElementById('btnOpenAi').addEventListener('click', () => setAiOpen(true));
  }

  // Session info for the topbar - the server already enforces the actual
  // auth gate (redirects to login.html before this page is even served if
  // there's no valid session), this is purely to display the name/title.
  try {
    const session = await getSession();
    const user = session.dashboard;
    if (user) {
      document.getElementById('userName').textContent = user.displayName;
      document.getElementById('userTitle').textContent = user.title;
      document.getElementById('userAvatar').textContent = user.displayName.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
    }
  } catch {
    // non-fatal - topbar just shows placeholder text
  }
}
