import { randomBytes } from 'crypto';

// In-memory mock data store standing in for the real Case Management /
// Reporting & Intake services described in the DVPE proposal. Numbers below
// mirror the values shown in the reference dashboard mockup so the UI reads
// as a faithful clickable prototype rather than placeholder lorem ipsum.

export const summary = {
  newToday: { value: 148, deltaLabel: '18% dari kemarin' },
  inProgress: { value: 914, deltaLabel: '12% dari minggu lalu' },
  resolved: { value: 256, deltaLabel: '8% dari minggu lalu' },
  victimsProtected: { value: 732, deltaLabel: '15% dari minggu lalu' },
};

export const trend = {
  days: ['28 Apr', '29 Apr', '30 Apr', '1 Mei', '2 Mei', '3 Mei', '4 Mei'],
  series: {
    TPKS: [140, 150, 158, 165, 170, 178, 190],
    KDRT: [70, 78, 82, 88, 95, 100, 110],
    TPPO: [40, 42, 45, 48, 50, 55, 58],
    Bullying: [20, 22, 25, 24, 28, 30, 32],
  },
};

// Six case-lifecycle stages, each a distinct categorical hue (slots 1-6 of
// the validated default palette: blue, orange, aqua, yellow, magenta,
// green - see references/palette.md). This reads as "stacks/bars" for CVD
// safety purposes (every stage is visible at once, same as a stacked bar),
// which the palette's default ordering clears on all 8 slots adjacently -
// six is comfortably inside that safe range.
export const caseStatusBreakdown = [
  { label: 'Assessment', value: 120, pct: 13, color: '#2a78d6' },
  { label: 'Dalam Penanganan', value: 412, pct: 45, color: '#eb6834' },
  { label: 'Penyidikan', value: 178, pct: 19, color: '#1baf7a' },
  { label: 'Persidangan', value: 98, pct: 11, color: '#eda100' },
  { label: 'Rehabilitasi', value: 60, pct: 7, color: '#e87ba4' },
  { label: 'Selesai', value: 46, pct: 5, color: '#008300' },
];

export const caseFlow = [
  { label: 'Laporan Masuk', time: '04 Mei 09:15', done: true },
  { label: 'Assessment', time: '04 Mei 09:30', done: true },
  { label: 'Triage', time: '04 Mei 09:45', done: true },
  { label: 'Penanganan', time: 'Sedang Berjalan', done: false, active: true },
  { label: 'Pemulihan', time: '-', done: false },
  { label: 'Selesai', time: '-', done: false },
];

export const priorityCases = [
  { id: 'DVPE-2026-000892', severity: 'CRITICAL', category: 'TPKS', victim: '14 th - Perkosaan', location: 'Bandung, Jawa Barat', ago: '2 jam lalu' },
  { id: 'DVPE-2026-000891', severity: 'HIGH', category: 'KDRT', victim: '28 th - Fisik & Psikis', location: 'Bekasi, Jawa Barat', ago: '3 jam lalu' },
  { id: 'DVPE-2026-000890', severity: 'HIGH', category: 'TPPO', victim: '21 th - Eksploitasi', location: 'Pontianak, Kalimantan Barat', ago: '4 jam lalu' },
  { id: 'DVPE-2026-000889', severity: 'MEDIUM', category: 'Bullying', victim: '16 th - Verbal', location: 'Surabaya, Jawa Timur', ago: '5 jam lalu' },
  { id: 'DVPE-2026-000888', severity: 'MEDIUM', category: 'TPKS', victim: '15 th - Pencabulan', location: 'Yogyakarta, DI Yogyakarta', ago: '6 jam lalu' },
];

export const riskMap = {
  region: 'Jawa Barat',
  riskScore: 'TINGGI',
  breakdown: [
    { label: 'TPPO', value: 124 },
    { label: 'TPKS', value: 198 },
    { label: 'KDRT', value: 167 },
    { label: 'Bullying', value: 89 },
  ],
};

export const reminders = [
  { text: 'Follow up korban DVPE-2026-000812', when: 'Hari ini 10:00' },
  { text: 'Kirim berkas ke JPU DVPE-2026-000783', when: 'Terlambat', late: true },
  { text: 'Pendampingan psikologis DVPE-2026-000801', when: 'Besok 09:00' },
];

export const systemNotifications = [
  { text: 'Peringatan: Peningkatan kasus TPPO di Jawa Barat. Risk Score naik 18% dalam 7 hari terakhir.', when: '20 menit lalu' },
  { text: 'SOP Baru: Pedoman Penanganan Korban Anak. Silakan pelajari SOP terbaru yang sudah tersedia.', when: '2 jam lalu' },
];

export const nearbyServices = [
  { name: 'UPTD PPA Kota Bandung', distanceKm: 2.4 },
  { name: 'RSUP Dr. Hasan Sadikin', distanceKm: 3.1 },
  { name: 'LBH Apik Bandung', distanceKm: 2.8 },
];

export const reportCategories = [
  { id: 'kekerasan-seksual', label: 'Kekerasan Seksual', desc: 'Perkosaan, pencabulan, pelecehan, dll' },
  { id: 'kdrt', label: 'KDRT', desc: 'Kekerasan dalam rumah tangga' },
  { id: 'tppo', label: 'TPPO', desc: 'Perdagangan orang / pekerja migran' },
  { id: 'bullying', label: 'Perundungan (Bullying)', desc: 'Di sekolah, kampus, atau lingkungan' },
  { id: 'eksploitasi-anak', label: 'Eksploitasi Anak', desc: 'Eksploitasi ekonomi / seksual, dll' },
  { id: 'kekerasan-siber', label: 'Kekerasan Siber', desc: 'Ancaman, perundungan online, dll' },
  { id: 'lainnya', label: 'Lainnya', desc: 'Kekerasan lainnya' },
];

export const reporterPersonas = [
  { id: 'korban', label: 'Saya Korban', desc: 'Saya mengalami kekerasan' },
  { id: 'saksi', label: 'Saya Saksi', desc: 'Saya melihat atau mengetahui' },
  { id: 'keluarga', label: 'Saya Keluarga', desc: 'Keluarga / Orang terdekat korban' },
  { id: 'guru', label: 'Saya Guru', desc: 'Melaporkan kasus di lingkungan sekolah' },
  { id: 'tenaga-medis', label: 'Saya Tenaga Medis', desc: 'Melaporkan dari layanan kesehatan' },
  { id: 'anonim', label: 'Laporan Anonim', desc: 'Saya tidak ingin menyebut identitas' },
];

export const partnerAgencies = [
  'Kepolisian RI', 'UPTD PPA', 'Dinas Sosial', 'Rumah Sakit', 'Psikolog / Konselor',
  'LBH / Bantuan Hukum', 'Shelter / Rumah Aman', 'LPSK', 'Kementerian PPA', 'Komnas Perempuan', 'Kemlu (Perlindungan PMI)',
];

// Reports submitted at runtime (via web portal wizard or the mobile app)
// live here, separate from the seeded priorityCases list above.
export const submittedReports = [];

export function genReportId() {
  const year = new Date().getFullYear();
  const suffix = randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
  // Deliberately non-sequential so a report ID can't be enumerated/guessed
  // by walking an incrementing counter to snoop on other victims' status.
  return `DVPE-${year}-${suffix}`;
}
