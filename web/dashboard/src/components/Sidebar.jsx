import React from 'react';
import { NavLink } from 'react-router-dom';
import { Headset, ShieldCheck } from 'lucide-react';
import { navGroups } from '../nav.js';

export default function Sidebar({ collapsed, onOpenAi }) {
  return (
    <aside className={'dash-sidebar' + (collapsed ? ' collapsed' : '')}>
      {/* Two layers on purpose: the outer <aside> stretches to match the
          page's full height (so its dark background never runs out partway
          down a page taller than one screen); this inner wrapper is what
          actually sticks to the viewport, so the logo/nav/help button stay
          pinned in view while scrolling. */}
      <div className="dash-sidebar-inner">
        <div className="dash-brand">
          <div className="dash-brand-mark"><ShieldCheck size={20} strokeWidth={2.4} /></div>
          {!collapsed && (
            <div>
              <div className="dash-brand-title">DVPE</div>
              <div className="dash-brand-sub">Digital Victim Protection Ecosystem</div>
            </div>
          )}
        </div>

        <nav className="dash-nav">
          {navGroups.map((group, i) => (
            <div className="dash-nav-group" key={i}>
              {group.title && !collapsed && <div className="dash-nav-title">{group.title}</div>}
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === ''}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) => 'dash-nav-item' + (isActive ? ' active' : '')}
                  >
                    <Icon size={16} strokeWidth={2} className="dash-nav-icon" />
                    {!collapsed && <span className="dash-nav-label">{item.label}</span>}
                    {!collapsed && item.badge && <span className="dash-nav-badge">{item.badge}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <button className="dash-help" title={collapsed ? 'Pusat Bantuan' : undefined} onClick={onOpenAi}>
          <Headset size={16} /> {!collapsed && 'Pusat Bantuan'}
        </button>
      </div>
    </aside>
  );
}
