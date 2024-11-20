const express = require('express');
const bcrypt = require('bcryptjs');
const connection = require('../config/database');
const router = express.Router();

// Rota de registro (POST /register)
router.post('/register', (req, res) => {
  const { nome, email, cpf_cnpj, senha, confirma_senha } = req.body;

  if (!nome || !email || !cpf_cnpj || !senha || !confirma_senha) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  if (senha !== confirma_senha) {
      return res.status(400).json({ message: 'As senhas não coincidem.' });
  }

  // Gerar hash da senha e armazenar no banco de dados
  bcrypt.hash(senha, 10, (err, hash) => {
      if (err) {
          return res.status(500).json({ message: 'Erro ao gerar hash da senha.' });
      }

      const query = 'CALL sp_adicionar_usuario(?, ?, ?, ?)';
      const values = [nome, email, cpf_cnpj, hash];

      connection.query(query, values, (err, results) => {
          connection.end();

          if (err) {
              return res.status(500).json({ message: 'Erro ao registrar usuário.' });
          }

          return res.status(201).json({ message: 'Usuário registrado com sucesso!' });
      });
  });
});

// Rota de login (POST /login)
router.post('/login', (req, res) => {
    const { cpf_cnpj, senha } = req.body;
    
    if (!cpf_cnpj || !senha) {
        return res.status(400).json({ message: 'CPF/CNPJ e senha são obrigatórios.' });
    }

    const query = 'SELECT * FROM vw_usuario_login WHERE usu_cpf_cnpj = ?';

    connection.query(query, [cpf_cnpj], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco:', err);
            return res.status(500).json({ message: 'Erro ao autenticar usuário.' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Usuário não encontrado.' });
        }

        // Comparação de senha com bcrypt
        bcrypt.compare(senha, results[0].usu_senha, (err, isMatch) => {
            if (err) {
                console.error('Erro ao comparar senha:', err);
                return res.status(500).json({ message: 'Erro ao comparar as senhas.' });
            }

            if (!isMatch) {
                return res.status(400).json({ message: 'Senha incorreta.' });
            }

            return res.status(200).json({ message: 'Login realizado com sucesso!' });
        });
    });
});

module.exports = router;
