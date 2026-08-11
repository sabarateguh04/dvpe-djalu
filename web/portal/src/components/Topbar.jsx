import React from 'react';
import { ShieldCheck, ChevronDown, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Topbar({ collapsed, onToggleSidebar }) {
  const { logout } = useAuth();
  return (
    <header className="portal-topbar">
      <button
        className="dash-icon-btn portal-sidebar-toggle"
        onClick={onToggleSidebar}
        title={collapsed ? 'Tampilkan sidebar' : 'Sembunyikan sidebar'}
        aria-label={collapsed ? 'Tampilkan sidebar' : 'Sembunyikan sidebar'}
      >
        {collapsed ? <PanelLeft size={19} strokeWidth={1.8} /> : <PanelLeftClose size={19} strokeWidth={1.8} />}
      </button>
      <div>
        <div className="portal-greet">👋 Halo, selamat datang!</div>
        <div className="portal-greet-sub">Anda tidak sendiri. Kami ada untuk membantu.</div>
      </div>
      <div className="portal-topbar-right">
        <span className="portal-safe-pill"><ShieldCheck size={15} /> <span>Aman &amp; Rahasia<br /><b>Data Anda terlindungi</b></span></span>
        <button className="filter-pill sm">ID <ChevronDown size={13} /></button>
        <button className="dvpe-btn dvpe-btn-ghost" onClick={logout}>Keluar</button>
      </div>
    </header>
  );
}
