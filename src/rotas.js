const express = require('express');
const { visualizarContas, criarConta, atualizarConta, excluirConta, depositar,  sacar, transferir, consultarSaldo, emitirExtrato } = require('./controladores/contas');
const { senha_banco, senha_usuario } = require('./intermediarios');

const rotas = express();

rotas.get('/contas', senha_banco, visualizarContas)
rotas.post('/contas', criarConta)
rotas.put('/contas/:numeroConta/usuario',atualizarConta)
rotas.delete('/contas/:numeroConta', excluirConta)
rotas.post('/transacoes/depositar', depositar)
rotas.post('/transacoes/sacar', sacar)
rotas.post('/transacoes/transferir', transferir)
rotas.get('/contas/saldo', senha_usuario, consultarSaldo)
rotas.get('/contas/extrato', senha_usuario, emitirExtrato)

module.exports = rotas