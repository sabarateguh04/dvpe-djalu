import React from 'react';

export default function StatCard({ label, value, delta, tone = 'purple', icon: Icon }) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <div className="stat-row">
        <div className="stat-label">{label}</div>
        <div className="stat-icon"><Icon size={18} strokeWidth={2.2} /></div>
      </div>
      <div className="stat-value">{value}</div>
      {delta && <div className="stat-delta">▲ {delta}</div>}
    </div>
  );
}
