import 'package:flutter/material.dart';
import '../services/api_service.dart';

class PanicScreen extends StatefulWidget {
  const PanicScreen({super.key});

  @override
  State<PanicScreen> createState() => _PanicScreenState();
}

class _PanicScreenState extends State<PanicScreen> {
  bool _sending = false;
  Map<String, dynamic>? _result;
  String? _error;

  Future<void> _confirmAndSend() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Kirim Sinyal Darurat?'),
        content: const Text('Tim respons akan segera dihubungi.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Batal')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Ya, Kirim'),
          ),
        ],
      ),
    );
    if (ok != true) return;

    setState(() {
      _sending = true;
      _error = null;
    });
    try {
      final res = await ApiService.instance.triggerPanic();
      setState(() => _result = res);
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } catch (e) {
      setState(() => _error = 'Terjadi kesalahan jaringan.');
    } finally {
      setState(() => _sending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Panic Button')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('🆘', style: TextStyle(fontSize: 44)),
              const SizedBox(height: 12),
              const Text('Gunakan tombol ini hanya jika Anda dalam situasi darurat.', textAlign: TextAlign.center),
              const SizedBox(height: 20),
              if (_result == null)
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                    onPressed: _sending ? null : _confirmAndSend,
                    child: Text(_sending ? 'Mengirim...' : 'Aktifkan Panic Button'),
                  ),
                ),
              if (_error != null) Padding(padding: const EdgeInsets.only(top: 10), child: Text(_error!, style: const TextStyle(color: Colors.red))),
              if (_result != null)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(12)),
                  child: Column(
                    children: [
                      Text(_result!['message'] as String, textAlign: TextAlign.center),
                      const SizedBox(height: 6),
                      Text('Hotline 24 jam: ${_result!['hotline']}', style: const TextStyle(fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
