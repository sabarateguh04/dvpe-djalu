import 'package:flutter/material.dart';
import '../services/api_service.dart';

class StatusCheckScreen extends StatefulWidget {
  const StatusCheckScreen({super.key});

  @override
  State<StatusCheckScreen> createState() => _StatusCheckScreenState();
}

class _StatusCheckScreenState extends State<StatusCheckScreen> {
  final _ctrl = TextEditingController();
  Map<String, dynamic>? _result;
  String? _error;
  bool _loading = false;

  Future<void> _check() async {
    setState(() {
      _loading = true;
      _error = null;
      _result = null;
    });
    try {
      final res = await ApiService.instance.checkStatus(_ctrl.text.trim());
      setState(() => _result = res);
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } catch (e) {
      setState(() => _error = 'Terjadi kesalahan jaringan.');
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cek Status Laporan')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Masukkan nomor laporan Anda (contoh: DVPE-2026-A1B2C3).', style: TextStyle(color: Colors.black54, fontSize: 12.5)),
            const SizedBox(height: 12),
            TextField(controller: _ctrl, decoration: const InputDecoration(hintText: 'DVPE-2026-XXXXXX')),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(onPressed: _loading ? null : _check, child: Text(_loading ? 'Memeriksa...' : 'Cek Status')),
            ),
            const SizedBox(height: 16),
            if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
            if (_result != null)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(12)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${_result!['id']} • ${_result!['category']}', style: const TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text('Status: ${_result!['status']}'),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
