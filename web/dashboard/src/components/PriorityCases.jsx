import React from 'react';
import { ChevronRight } from 'lucide-react';
import SeverityBadge from './SeverityBadge.jsx';

export default function PriorityCases({ cases }) {
  return (
    <div className="priority-list">
      {cases.map((c) => (
        <div className="priority-row" key={c.id}>
          <span className="priority-ago">
            {c.ago} <ChevronRight size={12} />
          </span>
          <div className="priority-id-line">
            <SeverityBadge level={c.severity} />
            <span className="priority-id">{c.id}</span>
          </div>
          <div className="priority-meta">{c.category} &bull; {c.victim}</div>
          <div className="priority-loc">{c.location}</div>
        </div>
      ))}
    </div>
  );
}
