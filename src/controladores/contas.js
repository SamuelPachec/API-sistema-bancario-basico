let { contas, depositos, saques, transferencias } = require('../banco de dados/contas')

const visualizarContas = (req, res) => {

    contas.forEach((conta) => {
        conta.numero = parseInt(conta.numero, 10);
    });

    if (contas.length === 0) {
        return res.status(404).json({ mensagem: 'Nenhuma conta encontrada!' });
    }
    return res.status(200).json({ contas })

}

const criarConta = (req, res) => {

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.query;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
    }

    const contaExistente = contas.find((conta) => conta.usuario.cpf === cpf || conta.usuario.email === email);

    if (contaExistente) {
        return res.status(400).json({ mensagem: 'CPF ou E-mail já cadastrado!' });
    }

    const numeroConta = Number((contas.length + 1).toString());

    const novaConta = {
        numero: numeroConta,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha,
        },
    };

    contas.push(novaConta);

    res.status(201).json();
}

const atualizarConta = (req, res) => {

    const { numeroConta } = req.params;

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.query;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
    }

    const conta = contas.find((conta) => conta.numero === Number(numeroConta));

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (contas.some((conta) => conta.usuario.cpf === cpf && conta.numero !== Number(numeroConta))) {
        return res.status(400).json({ mensagem: 'CPF já cadastrado em outra conta' });
    }

    if (contas.some((conta) => conta.usuario.email === email && c.numero !== Number(numeroConta))) {
        return res.status(400).json({ mensagem: 'E-mail já cadastrado em outra conta' });
    }

    conta.usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,
    };

    res.status(204).json();
}

const excluirConta = (req, res) => {

    const { numero_conta } = req.params

    const contaSolicitada = contas.find((conta) => conta.numero === Number(numero_conta));

    if (!contaSolicitada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (contaSolicitada.saldo !== 0) {
        return res.status(403).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })

    }

    const novaListaDeContas = contas.filter((conta) => conta.numero !== Number(numero_conta));

    contas = novaListaDeContas;

    res.status(204).json();

}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.query

    if (!numero_conta || !valor) {
        return res.status(403).json({ mensagem: "O número da conta e o valor são obrigatórios!" })
    }

    const contaSolicitada = contas.find((conta) => conta.numero === Number(numero_conta));

    if (!contaSolicitada) {
        return res.status(404).json({ mensagem: "Conta não encontrada!" });
    }

    const valorNumerico = Number(valor);

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
        return res.status(400).json({ mensagem: "Valor de depósito inválido!" });
    }

    contaSolicitada.saldo += valorNumerico;

    const evento = new Date();


    depositos.push({
        data: evento.toLocaleString('pt-BR'),
        numeroConta: Number(numero_conta),
        valor: Number(valor)
    });

    res.status(204).json()

};

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.query;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: 'Você deve informar o número da conta, valor e senha para prosseguir com a transação!' });
    }

    const contaSolicitada = contas.find((conta) => conta.numero === Number(numero_conta))

    if (!contaSolicitada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada!' });
    }

    if (contaSolicitada.usuario.senha !== senha) {
        return res.status(403).json({ mensagem: 'Senha incorreta!' });
    }

    if (contaSolicitada.saldo < Number(valor) || Number(valor) <= 0) {
        return res.status(405).json({ mensagem: 'Saldo insuficiente ou valor inválido!' });
    }

    contaSolicitada.saldo -= Number(valor);

    const evento = new Date();

    saques.push({
        data: evento.toLocaleString('pt-BR'),
        numeroConta: Number(numero_conta),
        valor: Number(valor)
    });

    res.status(204).json();
};

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, senha, valor } = req.query

    if (!numero_conta_origem || !numero_conta_destino || !senha || !valor) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' })
    }

    const contaSolicitadaOrigem = contas.find((conta) => conta.numero === Number(numero_conta_origem));

    const contaSolicitadaDestino = contas.find((conta) => conta.numero === Number(numero_conta_destino));

    if (!contaSolicitadaOrigem || !contaSolicitadaDestino) {
        return res.status(400).json({ mensagem: 'Conta de origem/destino não econtrada(s)!' })
    }

    if (contaSolicitadaOrigem.usuario.senha !== senha) {
        return res.status(403).json({ mensagem: 'Senha incorreta!' });
    }

    if (contaSolicitadaOrigem.saldo < Number(valor) || Number(valor) <= 0) {
        return res.status(405).json({ mensagem: 'Saldo insuficiente ou valor inválido!' });
    }

    contaSolicitadaOrigem.saldo -= Number(valor)

    contaSolicitadaDestino.saldo += Number(valor)

    const evento = new Date();

    transferencias.push({
        data: evento.toLocaleString('pt-BR'),
        numero_conta_origem: Number(contaSolicitadaOrigem.numero),
        numero_conta_destino: Number(contaSolicitadaDestino.numero),
        valor: Number(valor)
    });

    res.status(201).json()

}

const consultarSaldo = (req, res) => {
    const { numero_conta } = req.query;

    const contaSolicitada = contas.find((conta) => conta.numero === Number(numero_conta))

    res.status(200).json({ saldo: contaSolicitada.saldo });
};

const emitirExtrato = (req, res) => {
    const { numero_conta } = req.query;

    const contaSolicitada = contas.find((conta) => conta.numero === Number(numero_conta));

    const depositosConta = depositos.filter((deposito) => deposito.numeroConta === Number(numero_conta));
    const saquesConta = saques.filter((saque) => saque.numeroConta === Number(numero_conta));

    const transferenciasEnviadas = transferencias.filter((transferencia) => transferencia.numero_conta_origem === Number(numero_conta));
    const transferenciasRecebidas = transferencias.filter((transferencia) => transferencia.numero_conta_destino === Number(numero_conta));

    const extrato = {
        depositos: depositosConta,
        saques: saquesConta,
        transferenciasEnviadas,
        transferenciasRecebidas
    };

    res.status(200).json(extrato);
};



const vizualizarDepositos = (req, res) => {

    if (depositos.length === 0) {
        res.status(404).json({ mensagem: 'Não há depósitos registrados neste Banco!' })
    }

    res.status(200).json(depositos)
}

const vizualizarSaques = (req, res) => {

    if (saques.length === 0) {
        res.status(404).json({ mensagem: 'Não há saques registrados neste Banco!' })
    }

    res.status(200).json(saques)
}

const vizualizarTransferencias = (req, res) => {

    if (transferencias.length === 0) {
        res.status(404).json({ mensagem: 'Não há transfeências registrados neste Banco!' })
    }

    res.status(200).json(transferencias)
}







module.exports = {
    visualizarContas,
    criarConta,
    atualizarConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    emitirExtrato,
    vizualizarDepositos,
    vizualizarSaques,
    vizualizarTransferencias
}