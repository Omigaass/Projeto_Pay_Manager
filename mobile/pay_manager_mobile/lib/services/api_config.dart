import 'dart:io';

class ApiConfig {
  static late String baseUrl;

  static Future<void> initialize() async {
    // Descobrir o IP do dispositivo
    final ip = await _getLocalIp();
    baseUrl = 'http://192.168.86.11:3000';
  }

  static Future<String> _getLocalIp() async {
    try {
      for (var interface in await NetworkInterface.list()) {
        for (var address in interface.addresses) {
          // Filtra apenas os endereços IPv4
          if (address.type == InternetAddressType.IPv4 &&
              !address.isLoopback) {
            return address.address;
          }
        }
      }
    } catch (e) {
      print('Erro ao obter IP local: $e');
    }
    return '127.0.0.1'; // IP padrão caso falhe
  }
}
