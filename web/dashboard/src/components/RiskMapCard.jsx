import React from 'react';
import { Plus, Minus, ExternalLink } from 'lucide-react';
import { viewBox, indonesiaPath, markers } from './indonesiaMapData.js';

// Real Indonesia country outline (see indonesiaMapData.js - generated at
// build time from Natural Earth data via d3-geo, no mapping library ships
// to the browser) with a risk-heat glow layer over a few reference cities.
function IndonesiaMap() {
  return (
    <svg viewBox={`0 0 ${viewBox.width} ${viewBox.height}`} className="riskmap-svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Peta kerawanan Indonesia">
      <defs>
        <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#eff6ff" />
        </linearGradient>
        <radialGradient id="heatHigh" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heatMed" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heatLow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={viewBox.width} height={viewBox.height} fill="url(#ocean)" />
      <path d={indonesiaPath} fill="#ddd0ab" stroke="#c3b489" strokeWidth="0.75" strokeLinejoin="round" />

      {/* risk heat glow, keyed to the same reference cities used below */}
      <circle cx={markers['Jawa Barat (Bandung)'][0]} cy={markers['Jawa Barat (Bandung)'][1]} r="46" fill="url(#heatHigh)" />
      <circle cx={markers['Sumatera (Medan)'][0]} cy={markers['Sumatera (Medan)'][1]} r="38" fill="url(#heatMed)" />
      <circle cx={markers['Kalimantan (Pontianak)'][0]} cy={markers['Kalimantan (Pontianak)'][1]} r="36" fill="url(#heatMed)" />
      <circle cx={markers['Sulawesi (Makassar)'][0]} cy={markers['Sulawesi (Makassar)'][1]} r="34" fill="url(#heatLow)" />

      <g>
        <circle cx={markers['Jawa Barat (Bandung)'][0]} cy={markers['Jawa Barat (Bandung)'][1]} r="5" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
        <circle cx={markers['Sumatera (Medan)'][0]} cy={markers['Sumatera (Medan)'][1]} r="4" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
        <circle cx={markers['Kalimantan (Pontianak)'][0]} cy={markers['Kalimantan (Pontianak)'][1]} r="4" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
        <circle cx={markers['Sulawesi (Makassar)'][0]} cy={markers['Sulawesi (Makassar)'][1]} r="4" fill="#22c55e" stroke="#fff" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export default function RiskMapCard({ riskMap }) {
  const max = Math.max(...riskMap.breakdown.map((b) => b.value));
  return (
    <div className="riskmap">
      <div className="riskmap-canvas">
        <IndonesiaMap />
        <div className="riskmap-zoom">
          <button aria-label="Perbesar"><Plus size={14} /></button>
          <button aria-label="Perkecil"><Minus size={14} /></button>
        </div>

        <div className="riskmap-popup">
          <div className="riskmap-popup-head">
            <strong>{riskMap.region}</strong>
            <span className="dvpe-badge" style={{ background: '#ef4444', color: '#fff' }}>
              Risk Score {riskMap.riskScore}
            </span>
          </div>
          {riskMap.breakdown.map((b) => (
            <div className="riskmap-bar-row" key={b.label}>
              <span className="riskmap-bar-label">{b.label}</span>
              <div className="riskmap-bar-track">
                <div className="riskmap-bar-fill" style={{ width: `${(b.value / max) * 100}%` }} />
              </div>
              <span className="riskmap-bar-value">{b.value}</span>
            </div>
          ))}
          <a href="#" className="link-sm">Lihat Detail →</a>
        </div>
      </div>
      <a href="#" className="link-sm riskmap-detail-link"><ExternalLink size={13} /> Lihat Peta Detail</a>
    </div>
  );
}
