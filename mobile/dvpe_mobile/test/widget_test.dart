// Basic smoke test: the app boots and shows the Beranda home screen.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:dvpe_mobile/main.dart';

void main() {
  testWidgets('DVPE app boots to Beranda', (WidgetTester tester) async {
    await tester.pumpWidget(const DvpeApp());
    await tester.pump();

    expect(find.text('Buat Laporan'), findsWidgets);
    expect(find.byIcon(Icons.home), findsOneWidget);
  });
}
