const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, 'web/src/public')));
// Rota para a página Home
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'web/src/pages/home.html'));
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/web/src/pages/index.html');
});

// ------------------------------ //

const usuarioRoute = require('./backend/src/routes/usuarioRoute');
app.use('/api/auth', usuarioRoute);

const movimentacaoRoute = require('./backend/src/routes/movimentacaoRoute');
app.use('/api/movimentacao', movimentacaoRoute);