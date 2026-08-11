class ReportCategory {
  final String id;
  final String label;
  final String desc;
  final String icon;
  const ReportCategory(this.id, this.label, this.desc, this.icon);
}

// Mirrors server/src/data/store.js `reportCategories`. Shipped as a static
// reference list in the app (typical for native clients) rather than
// fetched at runtime, since submitting a report never requires the mobile
// app to authenticate against the portal's demo-gated /api/portal/content
// endpoint - only the public /api/reports endpoint is used.
const reportCategories = [
  ReportCategory('kekerasan-seksual', 'Kekerasan Seksual', 'Perkosaan, pencabulan, pelecehan, dll', '🧍'),
  ReportCategory('kdrt', 'KDRT', 'Kekerasan dalam rumah tangga', '🏠'),
  ReportCategory('tppo', 'TPPO', 'Perdagangan orang / pekerja migran', '⚠️'),
  ReportCategory('bullying', 'Perundungan (Bullying)', 'Di sekolah, kampus, atau lingkungan', '💢'),
  ReportCategory('eksploitasi-anak', 'Eksploitasi Anak', 'Eksploitasi ekonomi / seksual, dll', '🧒'),
  ReportCategory('kekerasan-siber', 'Kekerasan Siber', 'Ancaman, perundungan online, dll', '💻'),
  ReportCategory('lainnya', 'Lainnya', 'Kekerasan lainnya', '➕'),
];
