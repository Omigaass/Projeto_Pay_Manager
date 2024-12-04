import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:pay_manager_mobile/services/api_config.dart';


class AddIncomeScreen extends StatefulWidget {
  @override
  _AddIncomeScreenState createState() => _AddIncomeScreenState();
}

class _AddIncomeScreenState extends State<AddIncomeScreen> {
  final _descController = TextEditingController();
  final _valueController = TextEditingController();

  Future<void> saveIncome() async {
    // Lógica para salvar a receita no backend
    final description = _descController.text;
    final value = double.tryParse(_valueController.text);

    if (description.isEmpty || value == null || value <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Por favor, preencha todos os campos corretamente')),
      );
      return;
    }

    // Substitua pelo endpoint correto do seu backend
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/api/movimentacao/create'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'desc': description,
        'valor': value,
        'data': DateTime.now().toIso8601String(),
        'usuario_id': 1, // Substitua pelo ID do usuário autenticado
        'usuario_criacao': 1, // Substitua pelo ID do usuário autenticado
      }),
    );

    if (response.statusCode == 201) {
      Navigator.pop(context); // Volta para a tela anterior
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao salvar receita')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Adicionar Receita')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _descController,
              decoration: InputDecoration(labelText: 'Descrição'),
            ),
            TextField(
              controller: _valueController,
              decoration: InputDecoration(labelText: 'Valor'),
              keyboardType: TextInputType.number,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: saveIncome,
              child: Text('Salvar Receita'),
            ),
          ],
        ),
      ),
    );
  }
}
