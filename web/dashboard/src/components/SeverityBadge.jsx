import React from 'react';

// Reserved status palette (never reused for categorical series). Solid
// fills to match the reference dashboard's badge treatment; always paired
// with the level's text label so meaning never rides on hue alone.
const STYLE = {
  CRITICAL: { bg: '#dc2626' },
  HIGH: { bg: '#ea580c' },
  MEDIUM: { bg: '#d97706' },
  LOW: { bg: '#059669' },
};

export default function SeverityBadge({ level }) {
  const s = STYLE[level] || STYLE.MEDIUM;
  return (
    <span className="severity-badge" style={{ background: s.bg }}>
      {level}
    </span>
  );
}
