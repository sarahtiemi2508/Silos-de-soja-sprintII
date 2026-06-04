// Variável que puxa os itens do quizModel
var fazendaModel = require("../models/fazendaModel");

function listarFazendas(req, res) {
    let id_usuario = req.params.id_usuario;

    fazendaModel.listarFazendas(id_usuario).then(function(resultado){

        console.log("Puxei as fazendas" + resultado)
        res.status(200).json(resultado);
    }).catch(function(erro){
        console.erro("Erro ao listarFazendas: ", erro)
        res.status(500).json(erro.sqlMessage);
    })
}

module.exports = {
    listarFazendas
}