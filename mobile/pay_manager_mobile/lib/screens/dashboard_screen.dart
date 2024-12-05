import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:pay_manager_mobile/services/api_config.dart';

class DashboardScreen extends StatefulWidget {
  final int userId;

  DashboardScreen({required this.userId});

  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  double totalIncome = 0.0;
  double totalExpense = 0.0;
  List<Map<String, dynamic>> incomes = [];
  List<Map<String, dynamic>> expenses = [];

  @override
  void initState() {
    super.initState();
    fetchMovements();
  }

  Future<void> fetchMovements() async {
    final response = await http.post(
      Uri.parse('http://20.0.24.163:3000/api/movimentacao/read'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'usuario_id': widget.userId}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        totalIncome = 0.0;
        totalExpense = 0.0;
        incomes = [];
        expenses = [];

        for (var item in data) {
          final value = item['mov_valor'];
          final description = item['mov_desc'];
          final id = item['mov_id'];

          if (value > 0) {
            totalIncome += value;
            incomes.add({'id': id, 'desc': description, 'value': value});
          } else {
            totalExpense += value.abs();
            expenses.add({'id': id, 'desc': description, 'value': value.abs()});
          }
        }
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao carregar movimentações')),
      );
    }
  }

  Future<void> deleteMovement(int id) async {
    final response = await http.post(
      Uri.parse('http://20.0.24.163:3000/api/movimentacao/delete'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'mov_id': id, 'usuario_exclusao': widget.userId}),
    );

    if (response.statusCode == 200) {
      fetchMovements();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao excluir movimentação')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Dashboard')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Saldo Atual
            Text(
              'Saldo Atual: R\$ ${(totalIncome - totalExpense).toStringAsFixed(2)}',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),

            // Receitas e Despesas
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  children: [
                    Text('Receitas: R\$ ${totalIncome.toStringAsFixed(2)}'),
                    ElevatedButton(
                      onPressed: () => Navigator.pushNamed(context, '/add-income'),
                      child: Text('Adicionar Receita'),
                    ),
                  ],
                ),
                Column(
                children: [
                  Text('Despesas: R\$ ${totalExpense.toStringAsFixed(2)}'),
                  ElevatedButton(
                    onPressed: () => Navigator.pushNamed(context, '/add-expense'), // Navega para a nova tela
                    child: Text('Adicionar Despesa'),
                  ),
                ],
              ),
              ],
            ),
            SizedBox(height: 20),

            // Listas de Receitas e Despesas
            Expanded(
              child: Row(
                children: [
                  // Lista de Receitas
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Receitas', style: TextStyle(fontSize: 18)),
                        Expanded(
                          child: ListView.builder(
                            itemCount: incomes.length,
                            itemBuilder: (context, index) {
                              final item = incomes[index];
                              return ListTile(
                                title: Text(item['desc']),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text('R\$ ${item['value'].toStringAsFixed(2)}'),
                                    IconButton(
                                      icon: Icon(Icons.delete, color: Colors.red),
                                      onPressed: () => deleteMovement(item['id']),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Lista de Despesas
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Despesas', style: TextStyle(fontSize: 18)),
                        Expanded(
                          child: ListView.builder(
                            itemCount: expenses.length,
                            itemBuilder: (context, index) {
                              final item = expenses[index];
                              return ListTile(
                                title: Text(item['desc']),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text('R\$ ${item['value'].toStringAsFixed(2)}'),
                                    IconButton(
                                      icon: Icon(Icons.delete, color: Colors.red),
                                      onPressed: () => deleteMovement(item['id']),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
