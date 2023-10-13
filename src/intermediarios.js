const { banco, contas } = require('./banco de dados/contas')

const senha_banco = (req, res, next) => {
    const { senha_banco } = req.query
    
    if (senha_banco !== banco.senha) {
        return res.status(401).json({ mensagem: 'A senha do banco informada é inválida!' })
    }
    next();
}

const senha_usuario = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'Você deve informar o número da conta e a senha para consultar o saldo!' });
    }

    const contaSolicitada = contas.find((conta) => conta.numero === Number(numero_conta))

    if (!contaSolicitada) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
    }

    if (contaSolicitada.usuario.senha !== senha) {
        return res.status(403).json({ mensagem: 'A senha está incorreta!' });
    }
    
    next();
}

module.exports = {
    senha_banco,
    senha_usuario
}