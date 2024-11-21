const express = require('express');
const app = express();

app.use(express.json());

const usuarioRoute = require('./src/routes/usuarioRoute');
app.use('/api/auth', usuarioRoute);

const movimentacaoRoute = require('./src/routes/movimentacaoRoute');
app.use('/api/movimentacao', movimentacaoRoute);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});