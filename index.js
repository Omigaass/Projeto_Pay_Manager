const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'web/src/public')));

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'web/src/pages/home.html'));
});


module.exports = app;

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});

// ------------------------------ //

const usuarioRoute = require('./backend/src/routes/usuarioRoute');
app.use('/api/auth', usuarioRoute);

const movimentacaoRoute = require('./backend/src/routes/movimentacaoRoute');
app.use('/api/movimentacao', movimentacaoRoute);

const bancoRoute = require('./backend/src/routes/bancoRoute');
app.use('/api/banco', bancoRoute);

const categoriaRoute = require('./backend/src/routes/categoriaRoute');
app.use('/api/categoria', categoriaRoute);