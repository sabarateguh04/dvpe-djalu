import React from 'react';
import { useLocation } from 'react-router-dom';
import { navGroups } from '../nav.js';

const allItems = navGroups.flatMap((g) => g.items);

export default function Placeholder() {
  const location = useLocation();
  const slug = location.pathname.split('/').filter(Boolean).pop();
  const item = allItems.find((i) => i.to === slug);

  return (
    <div className="dvpe-card pad placeholder-card">
      <div className="placeholder-icon">🚧</div>
      <h2>{item?.label || 'Halaman'}</h2>
      <p className="text-muted">
        Konten halaman ini akan dilengkapi pada iterasi berikutnya. Navigasi sudah disiapkan sesuai
        rancangan portal sehingga struktur informasi lengkap dapat ditinjau.
      </p>
    </div>
  );
}
