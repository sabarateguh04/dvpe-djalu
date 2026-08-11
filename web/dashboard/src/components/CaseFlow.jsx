import React from 'react';
import { FileInput, ClipboardList, Tag, Users2, CalendarCheck, Check } from 'lucide-react';

// Each stage has its own fixed accent color (not just a generic
// done/pending gray) to match the reference design - a completed step
// keeps the color it was always going to have, it doesn't get recolored
// to a uniform "done" green. Only the two stages the case hasn't reached
// yet stay muted/pending-looking.
const STEP_STYLE = [
  { icon: FileInput, bg: '#10b981', fg: '#fff' },
  { icon: ClipboardList, bg: '#f97316', fg: '#fff' },
  { icon: Tag, bg: '#8b5cf6', fg: '#fff' },
  { icon: Users2, bg: '#3b82f6', fg: '#fff' },
  { icon: CalendarCheck, bg: '#c7d2fe', fg: '#4338ca' },
  { icon: Check, bg: '#e5e7eb', fg: '#6b7280' },
];

export default function CaseFlow({ steps }) {
  return (
    <div className="case-flow">
      {steps.map((s, i) => {
        const style = STEP_STYLE[i] || STEP_STYLE[STEP_STYLE.length - 1];
        const Icon = style.icon;
        return (
          <div className="case-flow-step" key={s.label}>
            <div
              className={'case-flow-dot' + (s.active ? ' active' : '')}
              style={{ background: style.bg, color: style.fg }}
            >
              <Icon size={15} />
            </div>
            <div className="case-flow-label">{s.label}</div>
            <div className="case-flow-time">{s.time}</div>
          </div>
        );
      })}
    </div>
  );
}
