import React, { useMemo, useState } from 'react';

// Categorical slots 1-4 from the validated default palette (blue, orange,
// aqua, yellow) - this is exactly the documented safe case for a multi-line
// chart (palette.md: "the default adjacent pairlist (stacks, bars, lines)").
const SERIES_COLORS = {
  TPKS: '#2a78d6',
  KDRT: '#eb6834',
  TPPO: '#1baf7a',
  Bullying: '#eda100',
};

const W = 640;
const H = 220;
const PAD_L = 32;
const PAD_R = 12;
const PAD_T = 12;
const PAD_B = 24;

export default function TrendChart({ days, series }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const names = Object.keys(series);
  const max = useMemo(() => {
    const all = names.flatMap((n) => series[n]);
    return Math.ceil(Math.max(...all) / 50) * 50;
  }, [series, names]);

  const x = (i) => PAD_L + (i * (W - PAD_L - PAD_R)) / (days.length - 1);
  const y = (v) => H - PAD_B - (v / max) * (H - PAD_T - PAD_B);

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));

  return (
    <div className="trend-chart">
      <svg viewBox={`0 0 ${W} ${H}`} className="trend-svg" role="img" aria-label="Tren kasus 7 hari terakhir">
        {gridLines.map((v) => (
          <g key={v}>
            <line x1={PAD_L} x2={W - PAD_R} y1={y(v)} y2={y(v)} stroke="#e1e0d9" strokeWidth="1" />
            <text x={4} y={y(v) + 4} fontSize="10" fill="#898781">{v}</text>
          </g>
        ))}
        {days.map((d, i) => (
          <text key={d} x={x(i)} y={H - 6} fontSize="10" fill="#898781" textAnchor="middle">{d}</text>
        ))}

        {hoverIdx !== null && (
          <line x1={x(hoverIdx)} x2={x(hoverIdx)} y1={PAD_T} y2={H - PAD_B} stroke="#c3c2b7" strokeWidth="1" strokeDasharray="3,3" />
        )}

        {names.map((name) => {
          const pts = series[name].map((v, i) => `${x(i)},${y(v)}`).join(' ');
          return (
            <g key={name}>
              <polyline points={pts} fill="none" stroke={SERIES_COLORS[name]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {series[name].map((v, i) => (
                <circle
                  key={i}
                  cx={x(i)}
                  cy={y(v)}
                  r={hoverIdx === i ? 4 : 2.5}
                  fill={SERIES_COLORS[name]}
                  stroke="#fff"
                  strokeWidth="1"
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx(null)}
                />
              ))}
            </g>
          );
        })}
      </svg>

      {hoverIdx !== null && (
        <div className="trend-tooltip">
          <div className="trend-tooltip-title">{days[hoverIdx]}</div>
          {names.map((name) => (
            <div key={name} className="trend-tooltip-row">
              <span className="trend-dot" style={{ background: SERIES_COLORS[name] }} />
              {name}: <strong>{series[name][hoverIdx]}</strong>
            </div>
          ))}
        </div>
      )}

      <div className="trend-legend">
        {names.map((name) => (
          <span key={name} className="trend-legend-item">
            <span className="trend-dot" style={{ background: SERIES_COLORS[name] }} /> {name}
          </span>
        ))}
      </div>
    </div>
  );
}
