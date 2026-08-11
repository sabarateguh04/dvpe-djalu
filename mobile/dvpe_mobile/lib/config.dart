import 'dart:io' show Platform;

/// Base URL for the DVPE backend API, always port 4002 per the project's
/// single-port architecture (see ../../server and ../../web).
///
/// `10.0.2.2` is the special alias the Android emulator uses to reach the
/// host machine's `localhost`; a physical device or iOS simulator instead
/// needs the host machine's real LAN IP (override with --dart-define, see
/// below). This mockup intentionally keeps this simple and override-able
/// rather than hardcoding one environment.
String get apiBaseUrl {
  const override = String.fromEnvironment('DVPE_API_BASE_URL');
  if (override.isNotEmpty) return override;

  if (!Platform.isAndroid) return 'http://localhost:4002';
  return 'http://10.0.2.2:4002';
}

/// Run with e.g.
///   flutter run --dart-define=DVPE_API_BASE_URL=http://192.168.1.20:4002
/// when testing on a physical device against a backend on your LAN.
const bool isProductionBuild = bool.fromEnvironment('dart.vm.product');
