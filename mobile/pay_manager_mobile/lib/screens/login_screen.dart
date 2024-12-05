import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dashboard_screen.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _cpfCnpjController = TextEditingController();
  final TextEditingController _senhaController = TextEditingController();

  bool _isLoading = false;

  Future<void> login() async {
    if (_cpfCnpjController.text.isEmpty || _senhaController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('CPF/CNPJ e senha são obrigatórios.')),
      );
      return;
    }

    setState(() {
      _isLoading = true; // Ativa o indicador de carregamento
    });

    try {
      final response = await http.post(
        Uri.parse('http://20.0.24.163:3000/api/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'cpf_cnpj': _cpfCnpjController.text,
          'senha': _senhaController.text,
        }),
      );

      setState(() {
        _isLoading = false; // Desativa o indicador de carregamento
      });

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('Resposta do login: $data'); // Log da resposta completa

        if (data['usu_id'] != null) {
          print('usu_id recebido: ${data['usu_id']}');
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => DashboardScreen(userId: data['usu_id']),
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(data['message'] ?? 'Erro no login')),
          );
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro: ${response.statusCode} - ${response.reasonPhrase}')),
        );
      }
    } catch (e) {
      setState(() {
        _isLoading = false; // Desativa o indicador de carregamento em caso de erro
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao se conectar ao servidor: $e')),
      );
      print('Erro ao fazer login: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _cpfCnpjController,
              decoration: InputDecoration(
                labelText: 'CPF/CNPJ',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            SizedBox(height: 20),
            TextField(
              controller: _senhaController,
              decoration: InputDecoration(
                labelText: 'Senha',
                border: OutlineInputBorder(),
              ),
              obscureText: true,
            ),
            SizedBox(height: 20),
            _isLoading
                ? CircularProgressIndicator() // Mostra o indicador de carregamento
                : ElevatedButton(
                    onPressed: login,
                    child: Text('Entrar'),
                  ),
            SizedBox(height: 10),
            TextButton(
              onPressed: () => Navigator.pushNamed(context, '/register'),
              child: Text('Registrar-se'),
            ),
          ],
        ),
      ),
    );
  }
}
