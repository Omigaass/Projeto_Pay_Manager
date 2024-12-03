const express = require('express');
const pool = require('../config/database');
const router = express.Router();

router.post('/createBanco', async (req, res) => {
    const { nome, saldo, cor, usuario } = req.body;

    if(!nome || !saldo || !cor || !usuario) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const connection = await pool.getConnection();
        try {
            const query = 'CALL sp_create_banco(?, ?, ?, ?)';
            const values = [nome, saldo, cor, usuario];

            const [results] = await connection.query(query, values);
            connection.release();

            return res.status(201).json({ message: 'Banco registrado com sucesso!' });
        } catch (err) {
            connection.release();
            console.error('Erro ao adicionar banco:', err);
            return res.status(500).json({ message: 'Erro ao adicionar banco.' });
        }
    } catch (err) {
        console.error('Erro ao conectar ao banco:', err);
        return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
    }
})

router.post('/readBanco', async (req, res) => {
    const { usuario } = req.body;

    try {
        const connection = await pool.getConnection();
        try {
            const query = 'SELECT * FROM vw_banco_usuario WHERE bnu_id = ? AND bnu_ativo = 1';
            const [results] = await connection.query(query, [usuario]);

            connection.release();

            return res.status(200).json(results);
        } catch (err) {
            connection.release();
            console.error('Erro ao buscar bancos:', err);
            return res.status(500).json({ message: 'Erro ao buscar bancos.' });
        }
    } catch (err) {
        console.error('Erro ao conectar ao banco:', err);
        return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
    }
})

router.post('/updateBanco', async (req, res) => {
    const { banco, nome, saldo, cor, usuario } = req.body;

    try{
        const connection = await pool.getConnection();
        try {
            const query = 'CALL sp_update_banco(?, ?, ?, ?, ?)';
            const values = [banco, nome, saldo, cor, usuario];

            await connection.query(query, values);
            connection.release();

            return res.status(200).json({ message: 'Banco atualizado com sucesso!' });
        } catch (err) {
            connection.release();
            console.error('Erro ao atualizar banco:', err);
            return res.status(500).json({ message: 'Erro ao atualizar banco.' });
        }
    } catch (err) {
        console.error('Erro ao conectar ao banco:', err);
        return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
    }
})

router.post('/deleteBanco', async (req, res) => {
    const { banco } = req.body;

    try {
        const connection = await pool.getConnection();
        try {
            const query = 'CALL sp_delete_banco(?)';
            const values = [banco];

            await connection.query(query, values);
            connection.release();

            return res.status(200).json({ message: 'Banco excluído com sucesso!' });
        } catch (err) {
            connection.release();
            console.error('Erro ao excluir banco:', err);
            return res.status(500).json({ message: 'Erro ao excluir banco.' });
        }
    } catch (err) {
        console.error('Erro ao conectar ao banco:', err);
        return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
    }
})

module.exports = router;