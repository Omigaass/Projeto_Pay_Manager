const express = require('express');
const moment = require('moment');
const pool = require('../config/database');
const router = express.Router();

// Rota de Criação (POST /create)
router.post('/create', async (req, res) => {
  const { desc, valor, data, usuario_id, usuario_criacao } = req.body;

  if (!desc || !valor || !data || !usuario_id || !usuario_criacao) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  const dataFormatada = data.split('-').reverse().join('-');
  // Garantir que o valor seja um número decimal válido
const valorNumerico = typeof valor === 'number' ? valor : parseFloat(valor.replace(',', '.'));


  try {
    const connection = await pool.getConnection();
    try {
      // Corrigir a quantidade de parâmetros para a chamada da procedure
      const query = 'CALL sp_inserir_movimentacao(?, ?, ?, ?, ?)';
      const values = [desc, valorNumerico, dataFormatada, usuario_id, usuario_criacao];


      await connection.query(query, values);

      const [result] = await connection.query('SELECT @mov_id AS mov_id');
      const movId = result[0].mov_id;

      connection.release();

      return res.status(201).json({
        message: 'Movimentação inserida com sucesso!',
        mov_id: movId,
      });
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
router.post('/read', async (req, res) => {
  const { usuario_id } = req.body;

  try {
    const connection = await pool.getConnection();
    try {
      const query = 'SELECT * FROM vw_movimentacoes_ativas WHERE mov_usuario_id = ?';
      const [results] = await connection.query(query, [usuario_id]);

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
router.post('/update', async (req, res) => {
  const { mov_id, desc, valor, data, usuario_alteracao } = req.body;
  let dataFormatada;
  let valorNumerico;

  if (!mov_id || !usuario_alteracao) {
    return res.status(400).json({ message: 'ID da movimentação e usuário de alteração são obrigatórios.' });
  }

  if (data) {
    dataFormatada = data.split('-').reverse().join('-');
  }

  if (valor) {
    valorNumerico = parseFloat(valor.replace(',', '.'));
  }

  try {
    const connection = await pool.getConnection();
    try {
      const query = 'CALL sp_atualizar_movimentacao(?, ?, ?, ?, ?)';
      const values = [mov_id, desc, valorNumerico, dataFormatada, usuario_alteracao];

      await connection.query(query, values);
      connection.release();

      return res.status(200).json({ 
        message: 'Movimentação atualizada com sucesso!',
        mov_id: mov_id,
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
router.post('/delete', async (req, res) => {
  const { mov_id, usuario_exclusao } = req.body;

  if (!mov_id || !usuario_exclusao) {
    return res.status(400).json({ message: 'ID da movimentação e usuário de exclusão são obrigatórios.' });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const query = 'CALL sp_excluir_movimentacao(?, ?)';
      const values = [mov_id, usuario_exclusao];

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