import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/placeholder_screen.dart';
import 'report_category_screen.dart';
import 'status_check_screen.dart';
import 'panic_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _tab = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      _BerandaTab(),
      const ReportCategoryScreen(embedded: true),
      const PlaceholderScreen(title: 'Edukasi'),
      const PlaceholderScreen(title: 'Akun'),
    ];

    return Scaffold(
      body: SafeArea(child: pages[_tab]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Beranda'),
          NavigationDestination(icon: Icon(Icons.description_outlined), selectedIcon: Icon(Icons.description), label: 'Laporan'),
          NavigationDestination(icon: Icon(Icons.menu_book_outlined), selectedIcon: Icon(Icons.menu_book), label: 'Edukasi'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Akun'),
        ],
      ),
    );
  }
}

class _BerandaTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [AppColors.purple, AppColors.blue]),
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: const Text('DVPE', style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(width: 10),
            const Expanded(
              child: Text('Hai, Anda tidak sendiri 💜', style: TextStyle(fontWeight: FontWeight.w600)),
            ),
            IconButton(onPressed: () {}, icon: const Icon(Icons.notifications_none)),
          ],
        ),
        const Text('Kami siap membantu Anda 24/7', style: TextStyle(color: Colors.black54, fontSize: 12)),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [AppColors.purple, AppColors.indigo900]),
            borderRadius: BorderRadius.circular(18),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('🛡️', style: TextStyle(fontSize: 28)),
              const SizedBox(height: 10),
              const Text(
                'Laporkan dengan aman, kami melindungi Anda.',
                style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 14),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: AppColors.purple600),
                  onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ReportCategoryScreen())),
                  child: const Text('Buat Laporan'),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),
        const Text('Layanan Cepat', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
        const SizedBox(height: 10),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 10,
          crossAxisSpacing: 10,
          childAspectRatio: 2.6,
          children: [
            _QuickTile(icon: '🆘', label: 'Panic Button', color: const Color(0xFFFEF2F2), onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const PanicScreen()))),
            _QuickTile(icon: '🔍', label: 'Cek Status', color: const Color(0xFFEFF6FF), onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const StatusCheckScreen()))),
            _QuickTile(icon: '💬', label: 'Chat AI', color: const Color(0xFFF5F3FF), onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const PlaceholderScreen(title: 'Chat dengan AI')))),
            _QuickTile(icon: '📍', label: 'Cari Layanan', color: const Color(0xFFECFDF5), onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const PlaceholderScreen(title: 'Cari Layanan Terdekat')))),
          ],
        ),
        const SizedBox(height: 20),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(12)),
          child: const Text(
            'ℹ️ Data Anda dienkripsi end-to-end dan hanya dapat diakses oleh pihak berwenang sesuai kewenangan.',
            style: TextStyle(fontSize: 12, color: Color(0xFF1E40AF)),
          ),
        ),
      ],
    );
  }
}

class _QuickTile extends StatelessWidget {
  final String icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  const _QuickTile({required this.icon, required this.label, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(12)),
        child: Row(
          children: [
            Text(icon, style: const TextStyle(fontSize: 20)),
            const SizedBox(width: 8),
            Flexible(child: Text(label, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12.5))),
          ],
        ),
      ),
    );
  }
}
