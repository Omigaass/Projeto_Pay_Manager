const express = require('express');
const moment = require('moment');
const pool = require('../config/database');
const router = express.Router();

// Rota de Criação (POST /create)
router.post('/createMovimentacao', async (req, res) => {
  const { desc, valor, data, detalhamento, categoria, banco, tipo, usuario } = req.body;

  if (!desc || !valor || !data || !detalhamento || !categoria || !banco || !tipo || !usuario) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  const dataFormat = moment(data).format('YYYY-MM-DD');
  const valorFormat = parseFloat(valor.replace(',', '.')).toFixed(2);

  try {
    const connection = await pool.getConnection();
    try {
      // Corrigir a quantidade de parâmetros para a chamada da procedure
      const query = 'CALL sp_create_movimentacao(?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [desc, valorFormat, dataFormat, detalhamento, categoria, banco, tipo, usuario];

      await connection.query(query, values);

      connection.release();

      return res.status(201).json({ message: 'Movimentação inserida com sucesso!' });
    } catch (err) {
      connection.release();
      console.error('Erro ao inserir movimentação:', err);
      return res.status(500).json({ message: 'Erro ao inserir movimentação.' });
    }
  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
    return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
  }
});

// Rota de Leitura (POST /read)
router.post('/readMovimentacao', async (req, res) => {
  const { usuario } = req.body;

  try {
    const connection = await pool.getConnection();
    try {
      const query = 'SELECT * FROM vw_movimentacao WHERE mov_id = ? AND mov_ativo = 1';
      const [results] = await connection.query(query, [usuario]);

      connection.release();

      const formattedResults = results.map(result => {
        result.mov_data = moment(result.mov_data).format('YYYY-MM-DD');
        return result;
      });

      return res.status(200).json(formattedResults);
    } catch (err) {
      connection.release();
      console.error('Erro ao buscar movimentações:', err);
      return res.status(500).json({ message: 'Erro ao buscar movimentações.' });
    }
  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
    return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
  }
});

// Rota de Atualização (POST /update)
router.post('/updateMovimentacao', async (req, res) => {
  const { movimentacao, desc, valor, data, detalhamento, categoria, banco, tipo } = req.body;
  let dataFormat;
  let valorFormat;

  if(!movimentacao) {
    return res.status(400).json({ message: 'Movimentação não encontrada.' });
  }

  if (data) {
    dataFormat = data.split('-').reverse().join('-');
  }

  if (valor) {
    valorFormat = parseFloat(valor.replace(',', '.'));
  }

  try {
    const connection = await pool.getConnection();
    try {
      const query = 'CALL sp_update_movimentacao(?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [movimentacao, desc, valorFormat, dataFormat, detalhamento, categoria, banco, tipo];

      await connection.query(query, values);
      connection.release();

      return res.status(200).json({ 
        message: 'Movimentação atualizada com sucesso!',
      });
    } catch (err) {
      connection.release();
      console.error('Erro ao atualizar movimentação:', err);
      return res.status(500).json({ message: 'Erro ao atualizar movimentação.' });
    }
  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
    return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
  }
});

// Rota de Remoção (POST /delete)
router.post('/deleteMovimentacao', async (req, res) => {
  const { movimentacao } = req.body;

  if (movimentacao) {
    return res.status(400).json({ message: 'Movimentação nao encontrada.' });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const query = 'CALL sp_delete_movimentacao(?)';
      const values = [movimentacao];

      await connection.query(query, values);
      connection.release();

      return res.status(200).json({ message: 'Movimentação excluída com sucesso!' });
    } catch (err) {
      connection.release();
      console.error('Erro ao excluir movimentação:', err);
      return res.status(500).json({ message: 'Erro ao excluir movimentação.' });
    }
  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
    return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
  }
});

module.exports = router;