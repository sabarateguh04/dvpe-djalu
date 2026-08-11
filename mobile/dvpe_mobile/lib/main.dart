import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const DvpeApp());
}

class DvpeApp extends StatelessWidget {
  const DvpeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DVPE',
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(),
      home: const HomeScreen(),
    );
  }
}
