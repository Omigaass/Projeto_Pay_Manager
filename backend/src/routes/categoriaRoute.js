const express = require('express');
const pool = require('../config/database');
const router = express.Router();

router.post('/createCategoria', async (req, res) => {
    const { desc, cor, usuario } = req.body;

    if(!desc || !cor || !usuario) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const connection = await pool.getConnection();
        try {
            const query = 'CALL sp_create_categoria(?, ?, ?)';
            const values = [desc, cor, usuario];

            const [results] = await connection.query(query, values);
            connection.release();

            return res.status(201).json({ message: 'Categoria registrada com sucesso!' });
        } catch (err) {
            connection.release();
            console.error('Erro ao adicionar categoria:', err);
            return res.status(500).json({ message: 'Erro ao adicionar categoria.' });
        }
    } catch (err) {
        console.error('Erro ao conectar ao banco:', err);
        return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
    }
})

router.post('/readCategoria', async (req, res) => {
    const { usuario } = req.body;

    try {
        const connection = await pool.getConnection();
        try {
            const query = 'SELECT * FROM vw_categoria_usuario WHERE ctu_id = ? AND ctu_ativo = 1';
            const [results] = await connection.query(query, [usuario]);

            connection.release();

            return res.status(200).json(results);
        } catch (err) {
            connection.release();
            console.error('Erro ao buscar categorias:', err);
            return res.status(500).json({ message: 'Erro ao buscar categorias.' });
        }
    } catch (err) {
        console.error('Erro ao conectar ao banco:', err);
        return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
    }
})

router.post('/updateCategoria', async (req, res) => {
    const { categoria, desc, cor, usuario } = req.body;

    try{
        const connection = await pool.getConnection();
        try {
            const query = 'CALL sp_update_categoria(?, ?, ?, ?)';
            const values = [categoria, desc, cor, usuario];

            await connection.query(query, values);
            connection.release();

            return res.status(200).json({ message: 'Categoria atualizada com sucesso!' });
        } catch (err) {
            connection.release();
            console.error('Erro ao atualizar categoria:', err);
            return res.status(500).json({ message: 'Erro ao atualizar categoria.' });
        }
    } catch (err) {
        console.error('Erro ao conectar ao banco:', err);
        return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
    }
})

router.post('/deleteCategoria', async (req, res) => {
    const { categoria } = req.body;

    try {
        const connection = await pool.getConnection();
        try {
            const query = 'CALL sp_delete_categoria(?)';
            const values = [categoria];

            await connection.query(query, values);
            connection.release();

            return res.status(200).json({ message: 'Categoria excluida com sucesso!' });
        } catch (err) {
            connection.release();
            console.error('Erro ao excluir categoria:', err);
            return res.status(500).json({ message: 'Erro ao excluir categoria.' });
        }
    } catch (err) {
        console.error('Erro ao conectar ao banco:', err);
        return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
    }
})

module.exports = router;