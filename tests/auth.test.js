const request = require('supertest');
const app = require('../index');

describe('Auth Tests', () => {
  let cpfCnpj = '12345678901234';

  test('Deve registrar um novo usuário', async () => {
    const res = await request(app).post('/api/auth/register').send({
      nome: 'Test User',
      email: 'testuser@example.com',
      cpf_cnpj: cpfCnpj,
      senha: 'password123',
      confirma_senha: 'password123',
    });
    expect(res.body.message).toBe('Usuário registrado com sucesso!');
  });

  test('Deve fazer login com o usuário registrado', async () => {
    const res = await request(app).post('/api/auth/login').send({
      cpf_cnpj: cpfCnpj,
      senha: 'password123',
    });
    expect(res.body.message).toBe('Login realizado com sucesso!');
  });

  afterAll(async () => {
    const res = await request(app).delete('/api/auth/delete-user-p-teste').send({
      cpf_cnpj: cpfCnpj,
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Usuário excluído com sucesso!');
  });
});