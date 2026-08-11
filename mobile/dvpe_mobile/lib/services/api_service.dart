import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  ApiException(this.message, {this.statusCode});
  @override
  String toString() => message;
}

/// Thin client for the public, unauthenticated report/panic endpoints the
/// backend exposes at /api/reports and /api/panic (see
/// server/src/routes/reports.routes.js). These endpoints deliberately do NOT
/// require login - matching how a real victim/witness would use this app -
/// so no token handling lives here. Protection on the server side comes from
/// rate limiting, input validation, and non-guessable report IDs instead.
class ApiService {
  ApiService._();
  static final ApiService instance = ApiService._();

  Uri _uri(String path) => Uri.parse('$apiBaseUrl$path');

  Future<Map<String, dynamic>> submitReport({
    required String categoryId,
    required String reporterRole,
    required String chronology,
    String? incidentAt,
    String? location,
    String? contact,
    bool anonymous = false,
  }) async {
    final res = await http
        .post(
          _uri('/api/reports'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'categoryId': categoryId,
            'reporterRole': reporterRole,
            'chronology': chronology,
            'incidentAt': incidentAt,
            'location': location,
            'contact': anonymous ? null : contact,
            'anonymous': anonymous,
          }),
        )
        .timeout(const Duration(seconds: 15));
    return _decode(res);
  }

  Future<Map<String, dynamic>> checkStatus(String reportId) async {
    final res = await http.get(_uri('/api/reports/${Uri.encodeComponent(reportId)}/status')).timeout(const Duration(seconds: 15));
    return _decode(res);
  }

  Future<Map<String, dynamic>> triggerPanic({String? location}) async {
    final res = await http
        .post(
          _uri('/api/panic'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'location': location}),
        )
        .timeout(const Duration(seconds: 15));
    return _decode(res);
  }

  Map<String, dynamic> _decode(http.Response res) {
    Map<String, dynamic> body = {};
    try {
      body = jsonDecode(res.body) as Map<String, dynamic>;
    } catch (_) {
      // non-JSON body, fall through to status-based error below
    }
    if (res.statusCode >= 200 && res.statusCode < 300) return body;
    final message = body['error']?.toString() ?? 'Permintaan gagal (${res.statusCode})';
    throw ApiException(message, statusCode: res.statusCode);
  }
}
