import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import AiAssistantWidget from './AiAssistantWidget.jsx';

const SIDEBAR_KEY = 'dvpe_dashboard_sidebar_collapsed';
const AI_KEY = 'dvpe_dashboard_ai_widget_open';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === '1';
    } catch {
      return false;
    }
  });
  // Starts closed (just the floating bubble) - "Pusat Bantuan" in the
  // sidebar, or the bubble itself, is what brings the full card up.
  const [aiOpen, setAiOpen] = useState(() => {
    try {
      return localStorage.getItem(AI_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0');
    } catch {
      // localStorage unavailable (private browsing etc.) - collapse state just won't persist
    }
  }, [collapsed]);

  useEffect(() => {
    try {
      localStorage.setItem(AI_KEY, aiOpen ? '1' : '0');
    } catch {
      // localStorage unavailable - just won't persist across reloads
    }
  }, [aiOpen]);

  return (
    <div className={'dash-shell' + (collapsed ? ' sidebar-collapsed' : '')}>
      <Sidebar collapsed={collapsed} onOpenAi={() => setAiOpen(true)} />
      <div className="dash-main">
        <Topbar collapsed={collapsed} onToggleSidebar={() => setCollapsed((v) => !v)} />
        <div className="dash-content">
          <Outlet />
        </div>
      </div>
      <AiAssistantWidget open={aiOpen} onOpen={() => setAiOpen(true)} onClose={() => setAiOpen(false)} />
    </div>
  );
}
