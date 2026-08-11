import React, { useState } from 'react';
import { Search, Bell, MessageCircle, HelpCircle, ChevronDown, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Topbar({ collapsed, onToggleSidebar }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = (user?.displayName || '?')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="dash-topbar">
      <button
        className="dash-icon-btn dash-sidebar-toggle"
        onClick={onToggleSidebar}
        title={collapsed ? 'Tampilkan sidebar' : 'Sembunyikan sidebar'}
        aria-label={collapsed ? 'Tampilkan sidebar' : 'Sembunyikan sidebar'}
      >
        {collapsed ? <PanelLeft size={19} strokeWidth={1.8} /> : <PanelLeftClose size={19} strokeWidth={1.8} />}
      </button>
      <div className="dash-search">
        <Search size={16} className="dash-search-icon" />
        <input placeholder="Cari kasus, korban, laporan, atau aktivitas..." />
        <span className="dash-search-kbd">Ctrl + K</span>
      </div>
      <div className="dash-topbar-right">
        <button className="dash-icon-btn" title="Notifikasi" aria-label="Notifikasi">
          <Bell size={19} strokeWidth={1.8} />
          <span className="dash-icon-badge">12</span>
        </button>
        <button className="dash-icon-btn" title="Pesan" aria-label="Pesan">
          <MessageCircle size={19} strokeWidth={1.8} />
        </button>
        <button className="dash-icon-btn" title="Bantuan" aria-label="Bantuan">
          <HelpCircle size={19} strokeWidth={1.8} />
        </button>
        <div className="dash-user" onClick={() => setMenuOpen((v) => !v)}>
          <div className="dash-user-avatar">{initials}</div>
          <div>
            <div className="dash-user-name">{user?.displayName}</div>
            <div className="dash-user-title">{user?.title}</div>
          </div>
          <ChevronDown size={15} className="text-muted" />
          {menuOpen && (
            <div className="dash-user-menu">
              <button className="dvpe-btn dvpe-btn-ghost" style={{ width: '100%' }} onClick={logout}>Keluar</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
