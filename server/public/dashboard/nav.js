// Sidebar nav model - plain data, no build step needed to consume it.
// Routes without a dedicated page fall back to placeholder.html?title=...
export const navGroups = [
  { items: [{ label: 'Dashboard', href: '/dashboard/', icon: '🏠' }] },
  {
    title: 'Laporan & Kasus',
    items: [
      { label: 'Buat Laporan', href: '/dashboard/placeholder.html?title=Buat+Laporan', icon: '➕' },
      { label: 'Daftar Kasus', href: '/dashboard/kasus.html', icon: '📄' },
      { label: 'Pencarian Kasus', href: '/dashboard/placeholder.html?title=Pencarian+Kasus', icon: '🔍' },
      { label: 'Early Detection', href: '/dashboard/placeholder.html?title=Early+Detection', icon: '📡', badge: 'NEW' },
    ],
  },
  {
    title: 'Manajemen Kasus',
    items: [
      { label: 'Case Triage', href: '/dashboard/placeholder.html?title=Case+Triage', icon: '🗂️' },
      { label: 'Manajemen Kasus', href: '/dashboard/placeholder.html?title=Manajemen+Kasus', icon: '📁' },
      { label: 'Layanan Korban', href: '/dashboard/placeholder.html?title=Layanan+Korban', icon: '💜' },
      { label: 'Bukti Digital', href: '/dashboard/placeholder.html?title=Bukti+Digital', icon: '🖼️' },
      { label: 'Jadwal & Tugas', href: '/dashboard/placeholder.html?title=Jadwal+%26+Tugas', icon: '📅' },
    ],
  },
  {
    title: 'Investigasi',
    items: [
      { label: 'Timeline Kasus', href: '/dashboard/placeholder.html?title=Timeline+Kasus', icon: '🕐' },
      { label: 'Saksi & Pelapor', href: '/dashboard/placeholder.html?title=Saksi+%26+Pelapor', icon: '👥' },
      { label: 'AI Assistant', href: '/dashboard/placeholder.html?title=AI+Assistant', icon: '✨', badge: 'AI' },
      { label: 'e-Penyidikan', href: '/dashboard/placeholder.html?title=e-Penyidikan', icon: '🔎' },
    ],
  },
  {
    title: 'Analitik & Intelijen',
    items: [
      { label: 'Dashboard Intelijen', href: '/dashboard/placeholder.html?title=Dashboard+Intelijen', icon: '📊' },
      { label: 'Peta Kerawanan', href: '/dashboard/placeholder.html?title=Peta+Kerawanan', icon: '🗺️' },
      { label: 'Laporan & Statistik', href: '/dashboard/placeholder.html?title=Laporan+%26+Statistik', icon: '📈' },
      { label: 'Early Warning', href: '/dashboard/placeholder.html?title=Early+Warning', icon: '🔔' },
    ],
  },
  {
    title: 'Administrasi',
    items: [
      { label: 'Pengguna & Peran', href: '/dashboard/placeholder.html?title=Pengguna+%26+Peran', icon: '👤' },
      { label: 'Pengaturan Sistem', href: '/dashboard/placeholder.html?title=Pengaturan+Sistem', icon: '⚙️' },
      { label: 'Audit Log', href: '/dashboard/audit-log.html', icon: '📜' },
    ],
  },
];
