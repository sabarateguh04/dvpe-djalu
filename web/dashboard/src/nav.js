import {
  LayoutGrid, Plus, FileText, Search, Radar, ListChecks, FolderKanban, HeartHandshake,
  FileImage, CalendarClock, History, Users, Sparkles, Fingerprint, Map, BarChart3,
  BellRing, UserCog, Settings, ScrollText,
} from 'lucide-react';

// Sidebar nav model - kept as data so Sidebar.jsx stays a plain renderer.
// Routes without a dedicated page fall back to a shared "Placeholder"
// screen (still reachable, still shows the intended information
// architecture) so the mockup's navigation matches the reference design in
// full even though only the highest-value screens are fully built out.
export const navGroups = [
  {
    items: [{ label: 'Dashboard', to: '', icon: LayoutGrid }],
  },
  {
    title: 'Laporan & Kasus',
    items: [
      { label: 'Buat Laporan', to: 'buat-laporan', icon: Plus },
      { label: 'Daftar Kasus', to: 'kasus', icon: FileText },
      { label: 'Pencarian Kasus', to: 'pencarian', icon: Search },
      { label: 'Early Detection', to: 'early-detection', icon: Radar, badge: 'NEW' },
    ],
  },
  {
    title: 'Manajemen Kasus',
    items: [
      { label: 'Case Triage', to: 'triage', icon: ListChecks },
      { label: 'Manajemen Kasus', to: 'manajemen-kasus', icon: FolderKanban },
      { label: 'Layanan Korban', to: 'layanan-korban', icon: HeartHandshake },
      { label: 'Bukti Digital', to: 'bukti-digital', icon: FileImage },
      { label: 'Jadwal & Tugas', to: 'jadwal', icon: CalendarClock },
    ],
  },
  {
    title: 'Investigasi',
    items: [
      { label: 'Timeline Kasus', to: 'timeline', icon: History },
      { label: 'Saksi & Pelapor', to: 'saksi', icon: Users },
      { label: 'AI Assistant', to: 'ai-assistant', icon: Sparkles, badge: 'AI' },
      { label: 'e-Penyidikan', to: 'e-penyidikan', icon: Fingerprint },
    ],
  },
  {
    title: 'Analitik & Intelijen',
    items: [
      { label: 'Dashboard Intelijen', to: 'intelijen', icon: LayoutGrid },
      { label: 'Peta Kerawanan', to: 'peta', icon: Map },
      { label: 'Laporan & Statistik', to: 'statistik', icon: BarChart3 },
      { label: 'Early Warning', to: 'early-warning', icon: BellRing },
    ],
  },
  {
    title: 'Administrasi',
    items: [
      { label: 'Pengguna & Peran', to: 'pengguna', icon: UserCog },
      { label: 'Pengaturan Sistem', to: 'pengaturan', icon: Settings },
      { label: 'Audit Log', to: 'audit-log', icon: ScrollText },
    ],
  },
];
