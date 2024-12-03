import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/dashboard_screen.dart';

void main() {
  runApp(PayManagerApp());
}

class PayManagerApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pay Manager Mobile',
      initialRoute: '/',
      routes: {
        '/': (context) => LoginScreen(),
        '/register': (context) => RegisterScreen(),
        '/dashboard': (context) => DashboardScreen(
              userId: ModalRoute.of(context)!.settings.arguments as int,
            ),
      },
    );
  }
}
