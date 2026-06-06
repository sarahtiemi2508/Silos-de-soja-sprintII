var usuarioModel = require("../models/usuarioModel");

function inserirDadosBateria(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nomeSilos = req.body.nomeBateriaServer;
    var qtdSilos = req.body.qtdSilosServer;
    var alturaSilos = req.body.alturaSiloServer;
    var diametroSilos = req.body.diametroSiloServer

    // Faça as validações dos valores
    if (nomeSilos == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (qtdSilos == undefined) {
        res.status(400).send("Seu CPF está undefined!");
    } else if (alturaSilos == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (diametroSilos == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {

        configBateriaModel.cadastrarBateria(nomeSilos, qtdSilos, alturaSilos, diametroSilos)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}


function buscarDadosBateria(req, res) {
    var nomeSilos = req.body.nomeBateriaServer;
    var qtdSilos = req.body.qtdSilosServer;
    var alturaSilos = req.body.alturaSiloServer;
    var diametroSilos = req.body.diametroSiloServer

console.log("idUsuario recebido:", idUsuario);

    configBateriaModel.buscarDadosBateria()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarDadosBateria(req, res) {
    var nomeSilos = req.body.nomeBateriaServer;
    var qtdSilos = req.body.qtdSilosServer;
    var alturaSilos = req.body.alturaSiloServer;
    var diametroSilos = req.body.diametroSiloServer

    if (nomeSilos == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (qtdSilos == undefined) {
        res.status(400).send("Seu CPF está undefined!");
    } else if (alturaSilos == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (diametroSilos == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {

        configBateriaModel.atualizarDadosBateria(alturaSilos, diametroSilos)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar a atualização! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}


module.exports = {
    inserirDadosBateria,
    buscarDadosBateria,
    atualizarDadosBateria
}