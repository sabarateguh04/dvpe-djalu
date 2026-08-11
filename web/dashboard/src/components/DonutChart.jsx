import React, { useState } from 'react';

const SIZE = 160;
const STROKE = 26;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;
const GAP_DEG = 2.2; // ~2px surface gap between adjacent segments

export default function DonutChart({ data, total }) {
  const [hover, setHover] = useState(null);
  let cursor = 0;

  return (
    <div className="donut-wrap">
      <div className="donut-svg-wrap">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Status penanganan kasus">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#e1e0d9" strokeWidth={STROKE} />
          {data.map((seg, i) => {
            const frac = seg.value / total;
            const gapFrac = GAP_DEG / 360;
            const segLen = Math.max(frac - gapFrac, 0.002) * C;
            const offset = cursor * C;
            cursor += frac;
            return (
              <circle
                key={seg.label}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={seg.color}
                strokeWidth={hover === i ? STROKE + 4 : STROKE}
                strokeDasharray={`${segLen} ${C - segLen}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                style={{ transition: 'stroke-width 0.1s ease', cursor: 'pointer' }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            );
          })}
          <text x={SIZE / 2} y={SIZE / 2 - 4} textAnchor="middle" fontSize="22" fontWeight="700" fill="#0b0b0b">{total}</text>
          <text x={SIZE / 2} y={SIZE / 2 + 14} textAnchor="middle" fontSize="11" fill="#898781">Total</text>
        </svg>
      </div>
      <div className="donut-legend">
        {data.map((seg, i) => (
          <div key={seg.label} className={'donut-legend-row' + (hover === i ? ' hover' : '')} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <span className="trend-dot" style={{ background: seg.color }} />
            <span className="donut-legend-label">{seg.label}</span>
            <span className="donut-legend-value">{seg.value} ({seg.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
