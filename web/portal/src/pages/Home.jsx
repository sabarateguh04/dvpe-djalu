import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Siren, SearchCheck, MessageSquareText, MapPin, BookOpenCheck,
  User, Eye, Users, GraduationCap, Stethoscope, EyeOff,
  Bell, GraduationCap as EdukasiIcon, Shield, Lock,
  ListChecks, FileEdit, Paperclip, Send, HeartHandshake,
  CheckCircle2, ShieldAlert, PhoneCall, Landmark, Building2, Scale, Home as HomeIcon,
  ShieldCheck, Globe2, HeartPulse, Heart,
} from 'lucide-react';
import { api } from '../../../shared/api.js';

const quickServices = [
  { icon: Plus, label: 'Buat Laporan', desc: 'Sampaikan kejadian', to: 'lapor', tone: 'purple' },
  { icon: Siren, label: 'Panic Button', desc: 'Darurat, butuh bantuan', to: 'panic', tone: 'red' },
  { icon: SearchCheck, label: 'Cek Status', desc: 'Lihat perkembangan', to: 'status', tone: 'blue' },
  { icon: MessageSquareText, label: 'Chat dengan AI', desc: 'Tanya atau konsultasi', to: 'tanya-ai', tone: 'violet' },
  { icon: MapPin, label: 'Cari Layanan', desc: 'Temukan bantuan', to: 'layanan', tone: 'green' },
  { icon: BookOpenCheck, label: 'Panduan Korban', desc: 'Informasi & hak Anda', to: 'hak-korban', tone: 'orange' },
];

const personaIcons = { korban: User, saksi: Eye, keluarga: Users, guru: GraduationCap, 'tenaga-medis': Stethoscope, anonim: EyeOff };

const modulUtama = [
  { n: 1, icon: Plus, label: 'Buat Laporan', desc: 'Sampaikan laporan dengan aman melalui berbagai kanal.', to: 'lapor' },
  { n: 2, icon: Siren, label: 'Panic Button', desc: 'Tombol darurat untuk situasi berbahaya.', to: 'panic' },
  { n: 3, icon: SearchCheck, label: 'Cek Status Laporan', desc: 'Pantau perkembangan penanganan laporan Anda.', to: 'status' },
  { n: 4, icon: MessageSquareText, label: 'Chat dengan AI', desc: 'Konsultasi, tanya jawab, dan dapatkan informasi.', to: 'tanya-ai' },
  { n: 5, icon: MapPin, label: 'Cari Layanan', desc: 'Temukan layanan bantuan terdekat.', to: 'layanan' },
  { n: 6, icon: EdukasiIcon, label: 'Edukasi', desc: 'Materi edukasi kekerasan & hak korban.', to: 'kenali-kekerasan' },
  { n: 7, icon: Shield, label: 'Hak Korban', desc: 'Informasi hak korban menurut perundangan.', to: 'hak-korban' },
  { n: 8, icon: Lock, label: 'Tips Keamanan', desc: 'Panduan menjaga keselamatan diri.', to: 'tips-keamanan' },
];

const alur = [
  { n: 1, icon: ListChecks, label: 'Pilih Kanal & Jenis Laporan', desc: 'Isi peran dan jenis laporan yang ingin disampaikan.' },
  { n: 2, icon: FileEdit, label: 'Ceritakan Kejadian', desc: 'Isi kronologi, waktu, dan pihak terkait.' },
  { n: 3, icon: Paperclip, label: 'Unggah Bukti (Opsional)', desc: 'Foto, video, dokumen, atau rekaman suara.' },
  { n: 4, icon: Send, label: 'Kirim Laporan', desc: 'Laporan terenkripsi dan tersampaikan dengan aman.' },
  { n: 5, icon: HeartHandshake, label: 'Dapatkan Bantuan', desc: 'Laporan diterima & diproses pihak berwenang.' },
];

const setelahLaporan = [
  'Laporan diterima & diverifikasi. Anda akan mendapatkan nomor laporan.',
  'Kasus diarahkan ke unit penanganan yang sesuai. Anda akan diperbarui secara berkala.',
  'Anda dapat berkomunikasi aman melalui fitur chat. Identitas Anda selalu dilindungi.',
];

const ingat = [
  'Anda berhak mendapatkan perlindungan.',
  'Anda berhak mendapatkan layanan pemulihan.',
  'Anda berhak mendapatkan pendampingan hukum.',
];

const partnerIconFor = (name) => {
  const n = name.toLowerCase();
  if (n.includes('kepolisian')) return Landmark;
  if (n.includes('uptd')) return Building2;
  if (n.includes('dinas sosial')) return HeartHandshake;
  if (n.includes('rumah sakit')) return Stethoscope;
  if (n.includes('psikolog')) return HeartPulse;
  if (n.includes('lbh') || n.includes('hukum')) return Scale;
  if (n.includes('shelter') || n.includes('rumah aman')) return HomeIcon;
  if (n.includes('lpsk')) return ShieldCheck;
  if (n.includes('kementerian')) return Landmark;
  if (n.includes('komnas')) return Users;
  if (n.includes('kemlu') || n.includes('pmi')) return Globe2;
  return HeartHandshake;
};

export default function Home() {
  const [content, setContent] = useState(null);
  useEffect(() => {
    api.get('/api/portal/content').then(setContent).catch(() => {});
  }, []);

  return (
    <div className="portal-home">
      <div className="portal-hero-row">
        <div className="portal-hero">
          <div className="portal-hero-icon"><Heart size={28} /></div>
          <h1>Laporkan dengan Aman,<br />Kami Melindungi Anda</h1>
          <p>Sampaikan laporan kekerasan terhadap perempuan &amp; anak, TPPO, bullying, dan bentuk kekerasan lainnya. Identitas Anda terjaga.</p>
          <div className="portal-hero-actions">
            <Link to="lapor" className="dvpe-btn portal-hero-btn-primary">Buat Laporan Sekarang</Link>
            <Link to="tentang" className="dvpe-btn portal-hero-btn-ghost">Pelajari Lebih Lanjut</Link>
          </div>
        </div>
        <div className="dvpe-card pad portal-quick-services">
          <div className="card-title">Layanan Cepat</div>
          <div className="portal-quick-grid">
            {quickServices.map((s) => (
              <Link key={s.label} to={s.to} className={`portal-quick-item ${s.tone}`}>
                <span className="portal-quick-icon"><s.icon size={17} /></span>
                <span>
                  <span className="portal-quick-label">{s.label}</span>
                  <span className="portal-quick-desc">{s.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="dvpe-card pad">
        <div className="card-title">Saya ingin melaporkan sebagai</div>
        <div className="persona-grid">
          {(content?.reporterPersonas || []).map((p) => {
            const Icon = personaIcons[p.id] || User;
            return (
              <Link key={p.id} to={`lapor?persona=${p.id}`} className="persona-item">
                <div className="persona-icon"><Icon size={20} /></div>
                <div className="persona-label">{p.label}</div>
                <div className="persona-desc">{p.desc}</div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="dvpe-alert dvpe-alert-info portal-info-banner">
        <Bell size={16} className="portal-info-icon" />
        <div className="portal-info-text">
          <strong>Informasi Penting</strong>
          <div>DVPE melindungi kerahasiaan laporan Anda. Data hanya diakses oleh pihak berwenang sesuai kewenangan.</div>
        </div>
        <div className="portal-info-links">
          <a href="#" className="link-sm">Pelajari Hak Anda →</a>
          <a href="#" className="link-sm">Cara Melapor Aman →</a>
        </div>
      </div>

      <div className="portal-4col">
        <div className="dvpe-card pad">
          <div className="card-title center">Modul Utama untuk Masyarakat</div>
          <div className="modul-grid">
            {modulUtama.map((m) => (
              <Link key={m.n} to={m.to} className="modul-item">
                <span className="modul-icon"><m.icon size={17} /></span>
                <div>
                  <div className="modul-label">{m.label}</div>
                  <div className="modul-desc">{m.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="dvpe-card pad">
          <div className="card-title center">Alur Pelaporan (Masyarakat)</div>
          <div className="alur-col">
            {alur.map((a) => (
              <div className="alur-item" key={a.n}>
                <div className="alur-icon"><a.icon size={16} /></div>
                <div>
                  <div className="alur-label">{a.n}. {a.label}</div>
                  <div className="alur-desc">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="alur-security-banner">
            <ShieldCheck size={15} />
            <span><strong>Keamanan &amp; Kerahasiaan Terjamin:</strong> Data Anda dienkripsi end-to-end. Hanya pihak berwenang yang dapat mengakses sesuai kewenangan.</span>
          </div>
        </div>

        <div className="portal-4col-stack">
          <div className="dvpe-card pad">
            <div className="card-title upper">Setelah Laporan Dikirim</div>
            {setelahLaporan.map((t) => (
              <div className="check-row" key={t}>
                <CheckCircle2 size={15} className="check-row-icon good" />
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div className="dvpe-card pad">
            <div className="card-title upper">Ingat!</div>
            {ingat.map((t) => (
              <div className="check-row" key={t}>
                <ShieldAlert size={15} className="check-row-icon warn" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="portal-hotline-card">
          <div className="card-title upper" style={{ color: '#fff' }}>Butuh Bantuan Sekarang?</div>
          <p>Gunakan Panic Button atau hubungi layanan 24 jam kami.</p>
          <div className="portal-hotline-number"><PhoneCall size={16} /> 0811-1000-129</div>
        </div>
      </div>

      <div className="dvpe-card pad">
        <div className="card-title center">Mitra Layanan Terintegrasi</div>
        <div className="partner-row">
          {(content?.partnerAgencies || []).map((p) => {
            const Icon = partnerIconFor(p);
            return (
              <div key={p} className="partner-chip">
                <span className="partner-chip-icon"><Icon size={18} /></span>
                {p}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
