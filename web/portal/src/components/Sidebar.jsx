import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, Siren } from 'lucide-react';
import { navGroups } from '../nav.js';

export default function Sidebar({ collapsed }) {
  return (
    <aside className={'portal-sidebar' + (collapsed ? ' collapsed' : '')}>
      {/* Two layers on purpose: the outer <aside> stretches to match the
          page's full height (so its dark background never runs out partway
          down a page taller than one screen); this inner wrapper is what
          actually sticks to the viewport. */}
      <div className="portal-sidebar-inner">
        <div className="portal-brand">
          <div className="portal-brand-mark"><ShieldCheck size={18} strokeWidth={2.4} /></div>
          {!collapsed && (
            <div>
              <div className="portal-brand-title">DVPE</div>
              <div className="portal-brand-sub">Digital Victim Protection Ecosystem</div>
            </div>
          )}
        </div>

        <nav className="portal-nav">
          {navGroups.map((group, i) => (
            <div className="portal-nav-group" key={i}>
              {group.title && !collapsed && <div className="portal-nav-title">{group.title}</div>}
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === ''}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) => 'portal-nav-item' + (isActive ? ' active' : '')}
                  >
                    <Icon size={16} strokeWidth={2} />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="portal-panic-box">
          {!collapsed && (
            <>
              <div className="portal-panic-title">Butuh Bantuan Mendesak?</div>
              <div className="portal-panic-sub">Tekan tombol Panic Button jika Anda dalam bahaya.</div>
            </>
          )}
          <NavLink to="panic" className="dvpe-btn dvpe-btn-danger portal-panic-btn" title={collapsed ? 'Panic Button' : undefined}>
            <Siren size={15} /> {!collapsed && 'Panic Button'}
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
