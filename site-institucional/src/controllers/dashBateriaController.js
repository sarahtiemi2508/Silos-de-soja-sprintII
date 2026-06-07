var dashBateriaModel = require("../models/dashBateriaModel");

function selectVolumeTotal(req, res) {
    

console.log("idUsuario recebido:", idBateria);

    dashBateriaModel.selectVolumeTotal(idUsuario, limite_linhas)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectOcupacaoTotal(req, res) {
    

console.log("idUsuario recebido:", idBateria);

    dashBateriaModel.selectOcupacaoTotal(idBateria, limite_linhas)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectMaiorNivel(req, res) {
   

console.log("idUsuario recebido:", idBateria);

    dashBateriaModel.selectMaiorNivel(idBateria, limite_linhas)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectMenorNivel(req, res) {
    

console.log("idUsuario recebido:", idBateria);

    dashBateriaModel.selectMenorNivel(idBateria, limite_linhas)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectVolumeMensalBateria(req, res) {
    

console.log("idUsuario recebido:", idBateria);

    dashBateriaModel.selectVolumeMensalBateria(idBateria, limite_linhas)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    selectVolumeTotal,
   selectOcupacaoTotal, 
   selectMaiorNivel,
   selectMenorNivel,
   selectVolumeMensalBateria
}