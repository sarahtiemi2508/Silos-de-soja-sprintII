var dashBateriaModel = require("../models/dashBateriaModel");

// Abrir uma rots so
function selectDashCompleta(req, res) {
    let id = req.params.id_bateria;
    Promise.all([
        dashBateriaModel.selectVolumeTotal(id),
        dashBateriaModel.selectMaiorNivel(id),
        dashBateriaModel.selectMenorNivel(id),
        dashBateriaModel.selectVolumeMedio(id),
        dashBateriaModel.selectVolumeIndividual(id),
        dashBateriaModel.selectVolumeMensalBateria(id)
    ]).then(function (resultados) {
        res.json({
            total: resultados[0],
            maior: resultados[1],
            menor: resultados[2],
            medio: resultados[3],
            individual: resultados[4],
            mensal: resultados[5]
        });
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    });
}

function selectInfoBateria(req, res) {
    let id_bateria = req.params.id_bateria;

    dashBateriaModel.selectInfoBateria(id_bateria)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectInfoFazenda(req, res) {
    let id_fazenda = req.params.id_fazenda;


    dashBateriaModel.selectInfoFazenda(id_fazenda)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectVolumeTotal(req, res) {

    let id_bateria = req.params.id_bateria;
    console.log(id_bateria);

    dashBateriaModel.selectVolumeTotal(id_bateria)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectOcupacaoTotal(req, res) {
    let id_bateria = req.params.id_bateria;

    console.log(id_bateria);

    dashBateriaModel.selectOcupacaoTotal(id_bateria)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectMaiorNivel(req, res) {
    let id_bateria = req.params.id_bateria;


    dashBateriaModel.selectMaiorNivel(id_bateria)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectMenorNivel(req, res) {
    let id_bateria = req.params.id_bateria;

    console.log(id_bateria);

    dashBateriaModel.selectMenorNivel(id_bateria)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectVolumeIndividual(req, res) {
    let id_bateria = req.params.id_bateria;

    console.log(id_bateria);

    dashBateriaModel.selectVolumeIndividual(id_bateria)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectVolumeMensalBateria(req, res) {
    let id_bateria = req.params.id_bateria;

    console.log(id_bateria);

    dashBateriaModel.selectVolumeMensalBateria(id_bateria)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function selectInfoSiloIndividual(req, res) {
    let id_bateria = req.params.id_bateria;

    console.log(id_bateria);

    dashBateriaModel.selectInfoSiloIndividual(id_bateria)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}


function selectVolumeMedio(req, res) {
    let id_bateria = req.params.id_bateria;

    console.log(id_bateria);

    dashBateriaModel.selectVolumeMedio(id_bateria)
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
    selectInfoSiloIndividual,
    selectVolumeIndividual,
    selectVolumeMedio
}