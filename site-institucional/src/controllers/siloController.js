let siloModel = require("../models/siloModel");

function buscarDadosSilo(req, res) {
    let idSilo = req.params.idSilo;

    siloModel.buscarDadosSilo(idSilo).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nao teve resultado");
        }

    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarSilosBateria(req, res) {
    let idBateria = req.params.idBateria;

    siloModel.buscarSilosBateria(idBateria).then(function (resultado) {
        console.log("Todos silos da bateria: " + resultado)
        res.status(200).json(resultado);
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    buscarDadosSilo,
    buscarSilosBateria
};