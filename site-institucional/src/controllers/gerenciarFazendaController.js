var gerenciarFazendaModel = require("../models/gerenciarFazendaModel");

function pegarInfoFazenda(req, res) {
    var idFazenda = req.params.id_fazenda;

    if (idFazenda == undefined) {
        res.status(400).send("O ID da fazenda está undefined!");
    } else {
        gerenciarFazendaModel.pegarInfoFazenda(idFazenda)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum resultado foi encontrado");
                }
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro buscando as informações da fazenda: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function atualizarFazenda(req, res) {
    var idFazenda = req.body.idFazendaServer;
    var nomeFazenda = req.body.nomeFazendaServer;
    var cep = req.body.cepServer;
    var logradouro = req.body.logradouroServer;
    var numero = req.body.numeroServer;
    var cidade = req.body.cidadeServer;
    var uf = req.body.ufServer;

    if (idFazenda == undefined) {
        res.status(400).send("O ID da fazenda está undefined");
    } else if (nomeFazenda == undefined) {
        res.status(400).send("O nome da fazenda está undefined");
    } else if (cep == undefined) {
        res.status(400).send("O CEP está undefined");
    } else if (logradouro == undefined) {
        res.status(400).send("O logradouro está undefined");
    } else if (numero == undefined) {
        res.status(400).send("O número está undefined");
    } else if (cidade == undefined) {
        res.status(400).send("A cidade está undefined");
    } else if (uf == undefined) {
        res.status(400).send("A UF está undefined");
    } else {
        gerenciarFazendaModel.atualizarFazenda(idFazenda, nomeFazenda, cep, logradouro, numero, cidade, uf)
            .then(function (resultado) {
                res.status(200).json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao atualizar a fazenda:", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function deletarFazenda(req, res) {
    var idFazenda = req.body.idFazendaServer;

    if (idFazenda == undefined) {
        res.status(400).send("O ID da fazenda está undefined");
    } else {
        gerenciarFazendaModel.deletarFazenda(idFazenda)
            .then(function (resultado) {
                res.status(200).json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao deletar a fazenda: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function pegarBaterias(req, res) {
    var idFazenda = req.params.id_fazenda;

    if (idFazenda == undefined) {
        res.status(400).send("O ID da fazenda está undefined");
    } else {
        gerenciarFazendaModel.pegarBaterias(idFazenda)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhuma bateria encontrada para esta fazenda");
                }
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao buscar as baterias dessa fazenda: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function pegarUsuariosFazenda(req, res) {
    var idFazenda = req.params.id_fazenda;

    if (idFazenda == undefined) {
        res.status(400).send("O ID da fazenda está undefined");
    } else {
        gerenciarFazendaModel.pegarUsuariosFazenda(idFazenda)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum usuário encontrado para essa fazenda");
                }
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao buscar os usuários da fazenda: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function addUsuarioFazenda(req, res) {
    var idFazenda = req.body.idFazendaServer;
    var idUsuario = req.body.idUsuarioServer;
    var tipoPermissao = req.body.tipoPermissaoServer;

    if (idFazenda == undefined) {
        res.status(400).send("O ID da fazenda está undefined");
    } else if (idUsuario == undefined) {
        res.status(400).send("O ID do usuário está undefined");
    } else if (tipoPermissao == undefined) {
        res.status(400).send("O tipo da permissão está undefined");
    } else {
        gerenciarFazendaModel.addUsuarioFazenda(idFazenda, idUsuario, tipoPermissao)
            .then(function (resultado) {
                res.status(201).json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao adicionar o usuário na fazenda: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function deletarUsuarioFazenda(req, res) {
    var idFazenda = req.body.idFazendaServer;
    var idUsuario = req.body.idUsuarioServer;

    if (idFazenda == undefined) {
        res.status(400).send("O ID da fazenda está undefined");
    } else if (idUsuario == undefined) {
        res.status(400).send("O ID do usuário está undefined");
    } else {
        gerenciarFazendaModel.deletarUsuarioFazenda(idFazenda, idUsuario)
            .then(function (resultado) {
                res.status(200).json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao remover o usuário da fazenda: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    pegarInfoFazenda,
    atualizarFazenda,
    deletarFazenda,
    pegarBaterias,
    pegarUsuariosFazenda,
    addUsuarioFazenda,
    deletarUsuarioFazenda
};