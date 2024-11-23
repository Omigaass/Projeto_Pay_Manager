const request = require('supertest');
const app = require('../index');

describe('Movimentações Tests', () => {
  let server;

  beforeAll(async () => {
    server = app.listen(0);
    console.log(`Servidor de teste iniciado na porta ${server.address().port}`);
  });

  afterAll(async () => {
    await new Promise(resolve => server.close(resolve));
    console.log('Servidor de teste encerrado');
  });

  test('Deve criar uma nova movimentação', async () => {
    const res = await request(app).post('/api/movimentacao/create').send({
      desc: 'Salário',
      valor: "1000.00",
      data: '2024-11-01',
      usuario_id: 1,
      usuario_criacao: 1,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Movimentação inserida com sucesso!');
  });

  test('Deve listar movimentações', async () => {
    const res = await request(app).post('/api/movimentacao/read').send({
      usuario_id: 1,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('Deve atualizar uma movimentação', async () => {
    const res = await request(app).post('/api/movimentacao/update').send({
      mov_id: 1, 
      desc: 'Novo Salário',
      valor: "1200",
      data: '2024-11-01', 
      usuario_alteracao: 1,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Movimentação atualizada com sucesso!');
  });

  test('Deve excluir uma movimentação', async () => {
    const res = await request(app).post('/api/movimentacao/delete').send({
      mov_id: 1,
      usuario_exclusao: 1,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Movimentação excluída com sucesso!');
  });
});