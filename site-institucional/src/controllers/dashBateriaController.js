var dashBateriaModel = require("../models/dashBateriaModel");

function selectInfoBateria(req, res) {


    dashBateriaModel.selectVolumeTotal()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectInfoFazenda(req, res) {



    dashBateriaModel.selectInfoFazenda()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectVolumeTotal(req, res) {

console.log(idBateria);

    dashBateriaModel.selectVolumeTotal(idBateria)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectOcupacaoTotal(req, res) {
    

console.log(idBateria);

    dashBateriaModel.selectOcupacaoTotal(idBateria)
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

    dashBateriaModel.selectMaiorNivel(idBateria)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectMenorNivel(req, res) {
    

console.log(idBateria);

    dashBateriaModel.selectMenorNivel(idBateria)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectVolumeIndividual(req, res) {
    

console.log(idBateria);

    dashBateriaModel.selectVolumeIndividual(idBateria)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectVolumeMensalBateria(req, res) {
    

console.log(idBateria);

    dashBateriaModel.selectVolumeMensalBateria(idBateria)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectInfoSiloIndividual(req, res) {

console.log(idBateria);

    dashBateriaModel.selectInfoSiloIndividual(idBateria)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
   selectInfoBateria,
  selectInfoFazenda,
   selectVolumeTotal,
   selectMaiorNivel,
   selectMenorNivel,
   selectVolumeMensalBateria,
   selectInfoSiloIndividual
}