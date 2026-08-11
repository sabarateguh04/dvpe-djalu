// Plain functions that return HTML/SVG strings - no framework, no build
// step. Native <title> elements give hover tooltips on the charts for
// free (browser-native), in place of the custom JS-driven tooltip the
// React version used.
import { viewBox, indonesiaPath, markers } from './indonesiaMapData.js';

const STATUS_STYLE = {
  CRITICAL: '#dc2626',
  HIGH: '#ea580c',
  MEDIUM: '#d97706',
  LOW: '#059669',
};

export function severityBadgeHtml(level) {
  const bg = STATUS_STYLE[level] || STATUS_STYLE.MEDIUM;
  return `<span class="severity-badge" style="background:${bg}">${level}</span>`;
}

export function statCardHtml({ label, value, delta, tone, icon }) {
  return `
    <div class="stat-card stat-${tone}">
      <div class="stat-row">
        <div class="stat-label">${label}</div>
        <div class="stat-icon">${icon}</div>
      </div>
      <div class="stat-value">${value}</div>
      ${delta ? `<div class="stat-delta">▲ ${delta}</div>` : ''}
    </div>`;
}

const SERIES_COLORS = { TPKS: '#2a78d6', KDRT: '#eb6834', TPPO: '#1baf7a', Bullying: '#eda100' };

export function trendChartHtml({ days, series }) {
  const W = 640, H = 220, PAD_L = 32, PAD_R = 12, PAD_T = 12, PAD_B = 24;
  const names = Object.keys(series);
  const max = Math.ceil(Math.max(...names.flatMap((n) => series[n])) / 50) * 50;
  const x = (i) => PAD_L + (i * (W - PAD_L - PAD_R)) / (days.length - 1);
  const y = (v) => H - PAD_B - (v / max) * (H - PAD_T - PAD_B);
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));

  const grid = gridLines
    .map((v) => `<line x1="${PAD_L}" x2="${W - PAD_R}" y1="${y(v)}" y2="${y(v)}" stroke="#e1e0d9" stroke-width="1" /><text x="4" y="${y(v) + 4}" font-size="10" fill="#898781">${v}</text>`)
    .join('');
  const xLabels = days.map((d, i) => `<text x="${x(i)}" y="${H - 6}" font-size="10" fill="#898781" text-anchor="middle">${d}</text>`).join('');
  const lines = names
    .map((name) => {
      const pts = series[name].map((v, i) => `${x(i)},${y(v)}`).join(' ');
      const points = series[name]
        .map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="2.5" fill="${SERIES_COLORS[name]}" stroke="#fff" stroke-width="1"><title>${name} - ${days[i]}: ${v}</title></circle>`)
        .join('');
      return `<polyline points="${pts}" fill="none" stroke="${SERIES_COLORS[name]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />${points}`;
    })
    .join('');
  const legend = names.map((n) => `<span class="trend-legend-item"><span class="trend-dot" style="background:${SERIES_COLORS[n]}"></span> ${n}</span>`).join('');

  return `
    <div class="trend-chart">
      <div class="trend-legend">${legend}</div>
      <svg viewBox="0 0 ${W} ${H}" class="trend-svg" role="img" aria-label="Tren kasus 7 hari terakhir">
        ${grid}${xLabels}${lines}
      </svg>
    </div>`;
}

export function donutChartHtml({ data, total }) {
  const SIZE = 160, STROKE = 26, R = (SIZE - STROKE) / 2, C = 2 * Math.PI * R, GAP_DEG = 2.2;
  let cursor = 0;
  const segs = data
    .map((seg) => {
      const frac = seg.value / total;
      const gapFrac = GAP_DEG / 360;
      const segLen = Math.max(frac - gapFrac, 0.002) * C;
      const offset = cursor * C;
      cursor += frac;
      return `<circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${R}" fill="none" stroke="${seg.color}" stroke-width="${STROKE}" stroke-dasharray="${segLen} ${C - segLen}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${SIZE / 2} ${SIZE / 2})"><title>${seg.label}: ${seg.value} (${seg.pct}%)</title></circle>`;
    })
    .join('');
  const legend = data
    .map((seg) => `<div class="donut-legend-row"><span class="trend-dot" style="background:${seg.color}"></span><span class="donut-legend-label">${seg.label}</span><span class="donut-legend-value">${seg.value} (${seg.pct}%)</span></div>`)
    .join('');
  return `
    <div class="donut-wrap">
      <svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="Status penanganan kasus">
        <circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${R}" fill="none" stroke="#e1e0d9" stroke-width="${STROKE}" />
        ${segs}
        <text x="${SIZE / 2}" y="${SIZE / 2 - 4}" text-anchor="middle" font-size="22" font-weight="700" fill="#0b0b0b">${total}</text>
        <text x="${SIZE / 2}" y="${SIZE / 2 + 14}" text-anchor="middle" font-size="11" fill="#898781">Total</text>
      </svg>
      <div class="donut-legend">${legend}</div>
    </div>`;
}

export function riskMapHtml(riskMap) {
  const max = Math.max(...riskMap.breakdown.map((b) => b.value));
  const heat = (key, id, r) => `<circle cx="${markers[key][0]}" cy="${markers[key][1]}" r="${r}" fill="url(#${id})" />`;
  const dot = (key, color, r) => `<circle cx="${markers[key][0]}" cy="${markers[key][1]}" r="${r}" fill="${color}" stroke="#fff" stroke-width="1.5" />`;
  const bars = riskMap.breakdown
    .map((b) => `
      <div class="riskmap-bar-row">
        <span class="riskmap-bar-label">${b.label}</span>
        <div class="riskmap-bar-track"><div class="riskmap-bar-fill" style="width:${(b.value / max) * 100}%"></div></div>
        <span class="riskmap-bar-value">${b.value}</span>
      </div>`)
    .join('');
  return `
    <div class="riskmap">
      <div class="riskmap-canvas">
        <svg viewBox="0 0 ${viewBox.width} ${viewBox.height}" class="riskmap-svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Peta kerawanan Indonesia">
          <defs>
            <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#dbeafe" /><stop offset="100%" stop-color="#eff6ff" /></linearGradient>
            <radialGradient id="heatHigh" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.6" /><stop offset="100%" stop-color="#ef4444" stop-opacity="0" /></radialGradient>
            <radialGradient id="heatMed" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.5" /><stop offset="100%" stop-color="#f59e0b" stop-opacity="0" /></radialGradient>
            <radialGradient id="heatLow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#22c55e" stop-opacity="0.45" /><stop offset="100%" stop-color="#22c55e" stop-opacity="0" /></radialGradient>
          </defs>
          <rect width="${viewBox.width}" height="${viewBox.height}" fill="url(#ocean)" />
          <path d="${indonesiaPath}" fill="#ddd0ab" stroke="#c3b489" stroke-width="0.75" stroke-linejoin="round" />
          ${heat('Jawa Barat (Bandung)', 'heatHigh', 46)}${heat('Sumatera (Medan)', 'heatMed', 38)}${heat('Kalimantan (Pontianak)', 'heatMed', 36)}${heat('Sulawesi (Makassar)', 'heatLow', 34)}
          ${dot('Jawa Barat (Bandung)', '#ef4444', 5)}${dot('Sumatera (Medan)', '#f59e0b', 4)}${dot('Kalimantan (Pontianak)', '#f59e0b', 4)}${dot('Sulawesi (Makassar)', '#22c55e', 4)}
        </svg>
        <div class="riskmap-zoom"><button aria-label="Perbesar">+</button><button aria-label="Perkecil">−</button></div>
        <div class="riskmap-popup">
          <div class="riskmap-popup-head"><strong>${riskMap.region}</strong><span class="dvpe-badge" style="background:#ef4444;color:#fff">Risk Score ${riskMap.riskScore}</span></div>
          ${bars}
          <a href="#" class="link-sm">Lihat Detail →</a>
        </div>
      </div>
      <a href="#" class="link-sm riskmap-detail-link">↗ Lihat Peta Detail</a>
    </div>`;
}

const FLOW_STYLE = [
  { icon: '📥', bg: '#10b981', fg: '#fff' },
  { icon: '📋', bg: '#f97316', fg: '#fff' },
  { icon: '🏷️', bg: '#8b5cf6', fg: '#fff' },
  { icon: '👥', bg: '#3b82f6', fg: '#fff' },
  { icon: '📅', bg: '#c7d2fe', fg: '#4338ca' },
  { icon: '✅', bg: '#e5e7eb', fg: '#6b7280' },
];

export function caseFlowHtml(steps) {
  return `
    <div class="case-flow">
      ${steps
        .map((s, i) => {
          const st = FLOW_STYLE[i] || FLOW_STYLE[FLOW_STYLE.length - 1];
          return `
            <div class="case-flow-step">
              <div class="case-flow-dot${s.active ? ' active' : ''}" style="background:${st.bg};color:${st.fg}">${st.icon}</div>
              <div class="case-flow-label">${s.label}</div>
              <div class="case-flow-time">${s.time}</div>
            </div>`;
        })
        .join('')}
    </div>`;
}

export function priorityCasesHtml(cases) {
  return `
    <div class="priority-list">
      ${cases
        .map((c) => `
          <div class="priority-row">
            <span class="priority-ago">${c.ago} ›</span>
            <div class="priority-id-line">${severityBadgeHtml(c.severity)}<span class="priority-id">${c.id}</span></div>
            <div class="priority-meta">${c.category} &bull; ${c.victim}</div>
            <div class="priority-loc">${c.location}</div>
          </div>`)
        .join('')}
    </div>`;
}
