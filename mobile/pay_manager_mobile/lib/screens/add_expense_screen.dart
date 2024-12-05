import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../services/api_config.dart'; // Para pegar o IP do servidor

class AddExpenseScreen extends StatefulWidget {
  @override
  _AddExpenseScreenState createState() => _AddExpenseScreenState();
}

class _AddExpenseScreenState extends State<AddExpenseScreen> {
  final _descController = TextEditingController();
  final _valueController = TextEditingController();

  Future<void> saveExpense() async {
    final description = _descController.text;
    final value = double.tryParse(_valueController.text);

    if (description.isEmpty || value == null || value <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Por favor, preencha todos os campos corretamente')),
      );
      return;
    }

    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/api/movimentacao/create'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'desc': description,
          'valor': -value, // Valores de despesas são negativos
          'data': DateTime.now().toIso8601String(),
          'usuario_id': 1, // Substitua pelo ID do usuário autenticado
          'usuario_criacao': 1, // Substitua pelo ID do usuário autenticado
        }),
      );

      if (response.statusCode == 201) {
        Navigator.pop(context); // Voltar para a tela anterior após salvar
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao salvar despesa')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao se conectar ao servidor: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Adicionar Despesa')),
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
              onPressed: saveExpense,
              child: Text('Salvar Despesa'),
            ),
          ],
        ),
      ),
    );
  }
}
