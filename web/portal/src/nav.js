import {
  Home, Plus, SearchCheck, Siren, MapPin, BookOpen, Shield, Lock, Sparkles,
  Info, FileText, Mail,
} from 'lucide-react';

export const navGroups = [
  { items: [{ label: 'Beranda', to: '', icon: Home }] },
  {
    title: 'Laporan',
    items: [
      { label: 'Buat Laporan', to: 'lapor', icon: Plus },
      { label: 'Cek Status Laporan', to: 'status', icon: SearchCheck },
      { label: 'Panic Button', to: 'panic', icon: Siren },
      { label: 'Cari Layanan Terdekat', to: 'layanan', icon: MapPin },
    ],
  },
  {
    title: 'Edukasi & Informasi',
    items: [
      { label: 'Kenali Kekerasan', to: 'kenali-kekerasan', icon: BookOpen },
      { label: 'Hak Korban', to: 'hak-korban', icon: Shield },
      { label: 'Tips Keamanan', to: 'tips-keamanan', icon: Lock },
      { label: 'Tanya Alesha (AI)', to: 'tanya-ai', icon: Sparkles },
    ],
  },
  {
    title: 'Tentang Kami',
    items: [
      { label: 'Tentang DVPE', to: 'tentang', icon: Info },
      { label: 'Kebijakan Privasi', to: 'privasi', icon: FileText },
      { label: 'Hubungi Kami', to: 'kontak', icon: Mail },
    ],
  },
];
