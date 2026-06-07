// Variável que puxa os itens do quizModel
var visuBateriaModel = require("../models/visuBateriaModel");

function visualizarBateria(req, res) {
    let id_fazenda= req.params.id_fazenda;

    visuBateriaModel.visualizarBateria(id_fazenda)
    .then(function(resultado){

        console.log("Puxei as baterias" + resultado)
        res.status(200).json(resultado);
    }).catch(function(erro){
        console.error("Erro ao listar baterias: ", erro)
        res.status(500).json(erro.sqlMessage);
    })

}

function detalhesBateria(req, res) {
    let id_fazenda = req.params.id_fazenda;

    visuBateriaModel.detalhesBateria(id_fazenda)
    .then(function(resultado){

        console.log("Puxei as baterias" + resultado)
        res.status(200).json(resultado);
    }).catch(function(erro){
        console.error("Erro ao listar baterias: ", erro)
        res.status(500).json(erro.sqlMessage);
    })

}


module.exports = {
    visualizarBateria,
    detalhesBateria
};