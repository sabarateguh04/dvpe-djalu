import { mountLayout } from '/portal/layout.js';
import { api } from '/shared/api.js';

await mountLayout();

const quickServices = [
  { icon: '➕', label: 'Buat Laporan', desc: 'Sampaikan kejadian', href: '/portal/lapor.html', tone: 'purple' },
  { icon: '🆘', label: 'Panic Button', desc: 'Darurat, butuh bantuan', href: '/portal/panic.html', tone: 'red' },
  { icon: '🔍', label: 'Cek Status', desc: 'Lihat perkembangan', href: '/portal/status.html', tone: 'blue' },
  { icon: '💬', label: 'Chat dengan AI', desc: 'Tanya atau konsultasi', href: '/portal/placeholder.html?title=Chat+dengan+AI', tone: 'violet' },
  { icon: '📍', label: 'Cari Layanan', desc: 'Temukan bantuan', href: '/portal/placeholder.html?title=Cari+Layanan', tone: 'green' },
  { icon: '📖', label: 'Panduan Korban', desc: 'Informasi & hak Anda', href: '/portal/placeholder.html?title=Panduan+Korban', tone: 'orange' },
];
const personaIcons = { korban: '🧍', saksi: '👁️', keluarga: '👪', guru: '🎓', 'tenaga-medis': '⚕️', anonim: '🎭' };
const modulUtama = [
  { n: 1, icon: '➕', label: 'Buat Laporan', desc: 'Sampaikan laporan dengan aman melalui berbagai kanal.', href: '/portal/lapor.html' },
  { n: 2, icon: '🆘', label: 'Panic Button', desc: 'Tombol darurat untuk situasi berbahaya.', href: '/portal/panic.html' },
  { n: 3, icon: '🔍', label: 'Cek Status Laporan', desc: 'Pantau perkembangan penanganan laporan Anda.', href: '/portal/status.html' },
  { n: 4, icon: '💬', label: 'Chat dengan AI', desc: 'Konsultasi, tanya jawab, dan dapatkan informasi.', href: '/portal/placeholder.html?title=Chat+dengan+AI' },
  { n: 5, icon: '📍', label: 'Cari Layanan', desc: 'Temukan layanan bantuan terdekat.', href: '/portal/placeholder.html?title=Cari+Layanan' },
  { n: 6, icon: '🎓', label: 'Edukasi', desc: 'Materi edukasi kekerasan & hak korban.', href: '/portal/placeholder.html?title=Edukasi' },
  { n: 7, icon: '🛡️', label: 'Hak Korban', desc: 'Informasi hak korban menurut perundangan.', href: '/portal/placeholder.html?title=Hak+Korban' },
  { n: 8, icon: '🔒', label: 'Tips Keamanan', desc: 'Panduan menjaga keselamatan diri.', href: '/portal/placeholder.html?title=Tips+Keamanan' },
];
const alur = [
  { n: 1, icon: '📋', label: 'Pilih Kanal & Jenis Laporan', desc: 'Isi peran dan jenis laporan yang ingin disampaikan.' },
  { n: 2, icon: '📝', label: 'Ceritakan Kejadian', desc: 'Isi kronologi, waktu, dan pihak terkait.' },
  { n: 3, icon: '📎', label: 'Unggah Bukti (Opsional)', desc: 'Foto, video, dokumen, atau rekaman suara.' },
  { n: 4, icon: '📤', label: 'Kirim Laporan', desc: 'Laporan terenkripsi dan tersampaikan dengan aman.' },
  { n: 5, icon: '💜', label: 'Dapatkan Bantuan', desc: 'Laporan diterima & diproses pihak berwenang.' },
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
function partnerIconFor(name) {
  const n = name.toLowerCase();
  if (n.includes('kepolisian')) return '🏛️';
  if (n.includes('uptd')) return '🏢';
  if (n.includes('dinas sosial')) return '💜';
  if (n.includes('rumah sakit')) return '⚕️';
  if (n.includes('psikolog')) return '🫂';
  if (n.includes('lbh') || n.includes('hukum')) return '⚖️';
  if (n.includes('shelter') || n.includes('rumah aman')) return '🏠';
  if (n.includes('lpsk')) return '🛡️';
  if (n.includes('kementerian')) return '🏛️';
  if (n.includes('komnas')) return '👥';
  if (n.includes('kemlu') || n.includes('pmi')) return '🌐';
  return '💜';
}

const content = document.getElementById('pageContent');
try {
  const data = await api.get('/api/portal/content');

  content.innerHTML = `
    <div class="portal-home">
      <div class="portal-hero-row">
        <div class="portal-hero">
          <div class="portal-hero-icon">❤️</div>
          <h1>Laporkan dengan Aman,<br />Kami Melindungi Anda</h1>
          <p>Sampaikan laporan kekerasan terhadap perempuan &amp; anak, TPPO, bullying, dan bentuk kekerasan lainnya. Identitas Anda terjaga.</p>
          <div class="portal-hero-actions">
            <a href="/portal/lapor.html" class="dvpe-btn portal-hero-btn-primary">Buat Laporan Sekarang</a>
            <a href="/portal/placeholder.html?title=Tentang+DVPE" class="dvpe-btn portal-hero-btn-ghost">Pelajari Lebih Lanjut</a>
          </div>
        </div>
        <div class="dvpe-card pad portal-quick-services">
          <div class="card-title">Layanan Cepat</div>
          <div class="portal-quick-grid">
            ${quickServices
              .map((s) => `<a href="${s.href}" class="portal-quick-item ${s.tone}"><span class="portal-quick-icon">${s.icon}</span><span><span class="portal-quick-label">${s.label}</span><span class="portal-quick-desc">${s.desc}</span></span></a>`)
              .join('')}
          </div>
        </div>
      </div>

      <div class="dvpe-card pad">
        <div class="card-title">Saya ingin melaporkan sebagai</div>
        <div class="persona-grid">
          ${data.reporterPersonas
            .map((p) => `<a href="/portal/lapor.html?persona=${p.id}" class="persona-item"><div class="persona-icon">${personaIcons[p.id] || '🧍'}</div><div class="persona-label">${p.label}</div><div class="persona-desc">${p.desc}</div></a>`)
            .join('')}
        </div>
      </div>

      <div class="dvpe-alert dvpe-alert-info portal-info-banner">
        🔔
        <div class="portal-info-text">
          <strong>Informasi Penting</strong>
          <div>DVPE melindungi kerahasiaan laporan Anda. Data hanya diakses oleh pihak berwenang sesuai kewenangan.</div>
        </div>
        <div class="portal-info-links">
          <a href="#" class="link-sm">Pelajari Hak Anda →</a>
          <a href="#" class="link-sm">Cara Melapor Aman →</a>
        </div>
      </div>

      <div class="portal-4col">
        <div class="dvpe-card pad">
          <div class="card-title center">Modul Utama untuk Masyarakat</div>
          <div class="modul-grid">
            ${modulUtama.map((m) => `<a href="${m.href}" class="modul-item"><span class="modul-icon">${m.icon}</span><div><div class="modul-label">${m.label}</div><div class="modul-desc">${m.desc}</div></div></a>`).join('')}
          </div>
        </div>

        <div class="dvpe-card pad">
          <div class="card-title center">Alur Pelaporan (Masyarakat)</div>
          <div class="alur-col">
            ${alur.map((a) => `<div class="alur-item"><div class="alur-icon">${a.icon}</div><div><div class="alur-label">${a.n}. ${a.label}</div><div class="alur-desc">${a.desc}</div></div></div>`).join('')}
          </div>
          <div class="alur-security-banner">🛡️ <span><strong>Keamanan &amp; Kerahasiaan Terjamin:</strong> Data Anda dienkripsi end-to-end. Hanya pihak berwenang yang dapat mengakses sesuai kewenangan.</span></div>
        </div>

        <div class="portal-4col-stack">
          <div class="dvpe-card pad">
            <div class="card-title upper">Setelah Laporan Dikirim</div>
            ${setelahLaporan.map((t) => `<div class="check-row"><span class="check-row-icon good">✅</span><span>${t}</span></div>`).join('')}
          </div>
          <div class="dvpe-card pad">
            <div class="card-title upper">Ingat!</div>
            ${ingat.map((t) => `<div class="check-row"><span class="check-row-icon warn">🛡️</span><span>${t}</span></div>`).join('')}
          </div>
        </div>

        <div class="portal-hotline-card">
          <div class="card-title upper" style="color:#fff">Butuh Bantuan Sekarang?</div>
          <p>Gunakan Panic Button atau hubungi layanan 24 jam kami.</p>
          <div class="portal-hotline-number">📞 0811-1000-129</div>
        </div>
      </div>

      <div class="dvpe-card pad">
        <div class="card-title center">Mitra Layanan Terintegrasi</div>
        <div class="partner-row">
          ${data.partnerAgencies.map((p) => `<div class="partner-chip"><span class="partner-chip-icon">${partnerIconFor(p)}</span>${p}</div>`).join('')}
        </div>
      </div>
    </div>`;
} catch (err) {
  content.innerHTML = `<div class="dvpe-alert dvpe-alert-error">${err.message}</div>`;
}
