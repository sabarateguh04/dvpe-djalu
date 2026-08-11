import 'package:flutter/material.dart';
import '../models/report_category.dart';
import '../services/api_service.dart';
import 'report_success_screen.dart';

class ReportChronologyScreen extends StatefulWidget {
  final ReportCategory category;
  const ReportChronologyScreen({super.key, required this.category});

  @override
  State<ReportChronologyScreen> createState() => _ReportChronologyScreenState();
}

const _steps = ['Kronologi', 'Detail', 'Lampiran', 'Selesai'];

class _ReportChronologyScreenState extends State<ReportChronologyScreen> {
  int _step = 0;
  final _chronologyCtrl = TextEditingController();
  final _locationCtrl = TextEditingController();
  final _contactCtrl = TextEditingController();
  DateTime? _incidentAt;
  bool _anonymous = false;
  bool _submitting = false;
  String? _error;

  @override
  void dispose() {
    _chronologyCtrl.dispose();
    _locationCtrl.dispose();
    _contactCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() {
      _submitting = true;
      _error = null;
    });
    try {
      final res = await ApiService.instance.submitReport(
        categoryId: widget.category.id,
        reporterRole: 'mobile-app',
        chronology: _chronologyCtrl.text.trim(),
        incidentAt: _incidentAt?.toIso8601String(),
        location: _locationCtrl.text.trim().isEmpty ? null : _locationCtrl.text.trim(),
        contact: _anonymous ? null : (_contactCtrl.text.trim().isEmpty ? null : _contactCtrl.text.trim()),
        anonymous: _anonymous,
      );
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => ReportSuccessScreen(reportId: res['id'] as String, message: res['message'] as String)),
      );
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } catch (e) {
      setState(() => _error = 'Terjadi kesalahan jaringan. Coba lagi.');
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  void _next() {
    if (_step == 0 && _chronologyCtrl.text.trim().length < 10) {
      setState(() => _error = 'Ceritakan kronologi minimal 10 karakter.');
      return;
    }
    setState(() {
      _error = null;
      if (_step < _steps.length - 1) {
        _step++;
      }
    });
    if (_step == _steps.length - 1) _submit();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Buat Laporan')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: List.generate(_steps.length, (i) {
                final active = i <= _step;
                return Expanded(
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 12,
                        backgroundColor: active ? Theme.of(context).colorScheme.primary : Colors.grey.shade300,
                        child: Text('${i + 1}', style: const TextStyle(fontSize: 11, color: Colors.white)),
                      ),
                      if (i < _steps.length - 1) Expanded(child: Divider(color: active ? Theme.of(context).colorScheme.primary : Colors.grey.shade300, thickness: 2)),
                    ],
                  ),
                );
              }),
            ),
            const SizedBox(height: 18),
            Expanded(child: _buildStepBody()),
            if (_error != null) Padding(padding: const EdgeInsets.only(bottom: 10), child: Text(_error!, style: const TextStyle(color: Colors.red))),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _submitting ? null : _next,
                child: Text(_submitting ? 'Mengirim...' : (_step == _steps.length - 2 ? 'Kirim Laporan' : 'Selanjutnya')),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepBody() {
    switch (_step) {
      case 0:
        return ListView(
          children: [
            const Text('Ceritakan Kronologi', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 4),
            const Text('Tuliskan secara singkat apa yang terjadi.', style: TextStyle(color: Colors.black54, fontSize: 12.5)),
            const SizedBox(height: 12),
            TextField(
              controller: _chronologyCtrl,
              maxLength: 2000,
              maxLines: 8,
              decoration: const InputDecoration(hintText: 'Mulai ceritakan kronologi kejadian...'),
            ),
            const SizedBox(height: 8),
            OutlinedButton.icon(
              icon: const Icon(Icons.calendar_today, size: 16),
              label: Text(_incidentAt == null ? 'Pilih tanggal & waktu kejadian' : _incidentAt.toString()),
              onPressed: () async {
                final d = await showDatePicker(context: context, initialDate: DateTime.now(), firstDate: DateTime(2000), lastDate: DateTime.now());
                if (d != null) setState(() => _incidentAt = d);
              },
            ),
          ],
        );
      case 1:
        return ListView(
          children: [
            const Text('Detail Tambahan', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            TextField(controller: _locationCtrl, decoration: const InputDecoration(labelText: 'Lokasi kejadian (opsional)')),
            const SizedBox(height: 10),
            CheckboxListTile(
              contentPadding: EdgeInsets.zero,
              value: _anonymous,
              onChanged: (v) => setState(() => _anonymous = v ?? false),
              title: const Text('Kirim sebagai laporan anonim', style: TextStyle(fontSize: 13.5)),
            ),
            if (!_anonymous)
              TextField(controller: _contactCtrl, decoration: const InputDecoration(labelText: 'Kontak Anda (opsional)')),
          ],
        );
      case 2:
        return Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: const [
              Icon(Icons.attach_file, size: 40, color: Colors.black38),
              SizedBox(height: 10),
              Text('Unggah Bukti (Opsional)', style: TextStyle(fontWeight: FontWeight.bold)),
              SizedBox(height: 6),
              Text(
                'Fitur unggah foto/video/dokumen bukti akan tersedia pada iterasi berikutnya.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.black54, fontSize: 12.5),
              ),
            ],
          ),
        );
      default:
        return const SizedBox.shrink();
    }
  }
}
