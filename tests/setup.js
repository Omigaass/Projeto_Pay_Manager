const http = require('http');
const app = require('../index');
const pool = require('../backend/src/config/database');

let server;

beforeAll(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  console.log(`Servidor de teste iniciado na porta ${server.address().port}`);

  const connection = await pool.getConnection();
  connection.release();
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
  console.log('Servidor de teste encerrado');
  await pool.end();
  console.log('Conexões encerradas');
});
