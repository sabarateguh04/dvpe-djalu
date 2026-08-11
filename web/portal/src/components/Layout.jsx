import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

const STORAGE_KEY = 'dvpe_portal_sidebar_collapsed';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
    } catch {
      // localStorage unavailable (private browsing etc.) - collapse state just won't persist
    }
  }, [collapsed]);

  return (
    <div className={'portal-shell' + (collapsed ? ' sidebar-collapsed' : '')}>
      <Sidebar collapsed={collapsed} />
      <div className="portal-main">
        <Topbar collapsed={collapsed} onToggleSidebar={() => setCollapsed((v) => !v)} />
        <div className="portal-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
