import 'package:flutter/material.dart';
import '../models/report_category.dart';
import 'report_chronology_screen.dart';

class ReportCategoryScreen extends StatelessWidget {
  final bool embedded;
  const ReportCategoryScreen({super.key, this.embedded = false});

  @override
  Widget build(BuildContext context) {
    final body = ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('Pilih jenis laporan', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 4),
        const Text(
          'Pilih kategori yang paling sesuai dengan kejadian yang Anda alami atau ketahui.',
          style: TextStyle(color: Colors.black54, fontSize: 12.5),
        ),
        const SizedBox(height: 14),
        for (final c in reportCategories)
          Card(
            margin: const EdgeInsets.only(bottom: 10),
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: Colors.grey.shade300)),
            child: ListTile(
              leading: Text(c.icon, style: const TextStyle(fontSize: 22)),
              title: Text(c.label, style: const TextStyle(fontWeight: FontWeight.w600)),
              subtitle: Text(c.desc, style: const TextStyle(fontSize: 11.5)),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => ReportChronologyScreen(category: c)),
              ),
            ),
          ),
      ],
    );

    if (embedded) return body;
    return Scaffold(appBar: AppBar(title: const Text('Buat Laporan')), body: body);
  }
}
