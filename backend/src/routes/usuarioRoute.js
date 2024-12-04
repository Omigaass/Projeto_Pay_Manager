const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// Rota de registro (POST /register)
router.post('/register', async (req, res) => {
  const { nome, email, cpf_cnpj, senha, confirma_senha } = req.body;

  if (!nome || !email || !cpf_cnpj || !senha || !confirma_senha) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  if (senha !== confirma_senha) {
      return res.status(400).json({ message: 'As senhas não coincidem.' });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const query = 'CALL sp_create_usuario(?, ?, ?, ?)';
      const values = [senha, nome, email, cpf_cnpj];

      await connection.query(query, values);
      connection.release();

      return res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (err) {
      connection.release();
      return res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }

  } catch (err) {
    return res.status(500).json({ message: 'Erro ao gerar hash da senha.' });
  }
});

// Rota de login (POST /login)
router.post('/login', async (req, res) => {
  const { cpf_cnpj, senha } = req.body;

  if (!cpf_cnpj || !senha) {
    return res.status(400).json({ message: 'CPF/CNPJ e senha são obrigatórios.' });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const query = 'SELECT * FROM vw_usuario WHERE usu_cpfcnpj = ?';
      const [results] = await connection.query(query, [cpf_cnpj]);
      connection.release();

      if (results.length === 0) {
        return res.status(400).json({ message: 'Usuário não encontrado.' });
      }

      const usuario = results[0];

      const isMatch = senha == usuario.usu_senha ? true : false;

      if (!isMatch) {
        return res.status(400).json({ message: 'Senha incorreta.' });
      }

      return res.status(200).json({
        message: 'Login realizado com sucesso!',
      });
    } catch (err) {
      connection.release();
      console.error('Erro ao consultar o banco:', err);
      return res.status(500).json({ message: 'Erro ao autenticar usuário.' });
    }
  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
    return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
  }
});

router.post('/deleteUsuario', async (req, res) => {
  const { usuario } = req.body;

  if (!usuario) {
    return res.status(400).json({ message: 'Usuário não encontrado.' });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const query = 'CALL sp_delete_usuario(?)';
      const values = [usuario];

      await connection.query(query, values);
      connection.release();

      return res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (err) {
      connection.release();
      return res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }

  } catch (err) {
    return res.status(500).json({ message: 'Erro ao gerar hash da senha.' });
  }
})

router.delete('/delete-user-p-teste', async (req, res) => {
  const { cpf_cnpj } = req.body;

  if (!cpf_cnpj) {
    return res.status(400).json({ message: 'CPF/CNPJ é obrigatório.' });
  }

  try {
    const [result] = await pool.query('DELETE FROM tbl_usuario WHERE usu_cpf_cnpj = ?', [cpf_cnpj]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.status(200).json({ message: 'Usuário excluído com sucesso!' });
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    return res.status(500).json({ message: 'Erro ao excluir usuário.' });
  }
});

module.exports = router;