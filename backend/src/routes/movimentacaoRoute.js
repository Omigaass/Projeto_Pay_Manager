const express = require('express');
const moment = require('moment');
const connection = require('../config/database');
const router = express.Router();

// Rota de Criação (POST /create)
router.post('/create', (req, res) => {
  const { desc, valor, data, usuario_id, usuario_criacao } = req.body;

  // Verificar se todos os campos obrigatórios foram passados
  if (!desc || !valor || !data || !usuario_id || !usuario_criacao) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  // Corrigir o formato da data (deve ser no formato 'YYYY-MM-DD')
  const dataFormatada = data.split('-').reverse().join('-');

  // Garantir que o valor seja um número decimal
  const valorNumerico = parseFloat(valor.replace(',', '.'));

  const query = 'CALL sp_inserir_movimentacao(?, ?, ?, ?, ?)';
  const values = [desc, valorNumerico, dataFormatada, usuario_id, usuario_criacao];

  connection.query(query, values, (err, results) => {
      if (err) {
          console.error('Erro ao inserir movimentação:', err);
          return res.status(500).json({ message: 'Erro ao inserir movimentação.' });
      }
      return res.status(201).json({ message: 'Movimentação inserida com sucesso!' });
  });
});


// Rota de Leitura (POST /read)
router.post('/read', (req, res) => {
  const { usuario_id } = req.body;

  const query = 'SELECT * FROM vw_movimentacoes_ativas WHERE mov_usuario_id = ?';

  connection.query(query, [usuario_id], (err, results) => {
      if (err) {
          console.error('Erro ao buscar movimentações:', err);
          return res.status(500).json({ message: 'Erro ao buscar movimentações.' });
      }

      const formattedResults = results.map(result => {
          result.mov_data = moment(result.mov_data).format('YYYY-MM-DD');
          return result;
      });

      return res.status(200).json(formattedResults);
  });
});



// Rota de Atualização (POST /update)
router.post('/update', (req, res) => {
  const { mov_id, desc, valor, data, usuario_alteracao } = req.body;
  let dataFormatada
  let valorNumerico

  if (!mov_id || !usuario_alteracao) {
      return res.status(400).json({ message: 'ID da movimentação e usuário de alteração são obrigatórios.' });
  }

  if(data) {
    dataFormatada = data.split('-').reverse().join('-');
  }

  if(valor) {
    valorNumerico = parseFloat(valor.replace(',', '.'));
  }

  const query = 'CALL sp_atualizar_movimentacao(?, ?, ?, ?, ?)';
  const values = [mov_id, desc, valorNumerico, dataFormatada, usuario_alteracao];''

  connection.query(query, values, (err, results) => {
      if (err) {
          console.error('Erro ao atualizar movimentação:', err);
          return res.status(500).json({ message: 'Erro ao atualizar movimentação.' });
      }
      return res.status(200).json({ message: 'Movimentação atualizada com sucesso!' });
  });
});


// Rota de Remoção (POST /delete)
router.post('/delete', (req, res) => {
  const { mov_id, usuario_exclusao } = req.body;

  if (!mov_id || !usuario_exclusao) {
      return res.status(400).json({ message: 'ID da movimentação e usuário de exclusão são obrigatórios.' });
  }

  const query = 'CALL sp_excluir_movimentacao(?, ?)';
  const values = [mov_id, usuario_exclusao];

  connection.query(query, values, (err, results) => {
      if (err) {
          console.error('Erro ao excluir movimentação:', err);
          return res.status(500).json({ message: 'Erro ao excluir movimentação.' });
      }
      return res.status(200).json({ message: 'Movimentação excluída com sucesso!' });
  });
});


module.exports = router;
