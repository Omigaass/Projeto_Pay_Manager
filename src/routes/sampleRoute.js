const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
    res.send('Olá, rota modular!');
});

module.exports = router;