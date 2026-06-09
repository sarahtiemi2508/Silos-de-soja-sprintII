var configBateriaModel = require("../models/configBateriaModel");

function inserirDadosBateria(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var id_fazenda = req.params.id_fazenda;
    var nomeBateria = req.body.nomeBateriaServer;

    // Faça as validações dos valores
    if (nomeBateria == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else {

        configBateriaModel.inserirDadosBateria(nomeBateria, id_fazenda)
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

function atualizarDadosBateria(req, res) {

    var idBateria = req.body.idBateriaserver;
    var nomeBateria = req.body.nomeBateriaServer;

    if (nomeBateria == undefined) {
        res.status(400).send("O nome da bateria está undefined!");
    } else {

        configBateriaModel.atualizarDadosBateria(nomeBateria, idBateria)
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
    atualizarDadosBateria
}