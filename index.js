const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor rodando!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const sampleRoute = require('./src/routes/sampleRoute');
app.use('/api', sampleRoute);

const connection = require('./src/config/database');

connection.query('SELECT 1 + 1 AS result', (err, results) => {
  if (err) {
    console.error('Erro ao executar query:', err);
  } else {
    console.log('Query executada com sucesso:', results);
  }
});
