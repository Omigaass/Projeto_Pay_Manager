const express = require('express');
const app = express();

app.use(express.json());

const authRoute = require('./src/routes/authRoute');
app.use('/api/auth', authRoute);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});