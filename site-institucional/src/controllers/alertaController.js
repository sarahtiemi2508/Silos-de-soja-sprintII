// Variável que puxa os itens do quizModel
var alertaModel = require("../models/alertaModel");

function listarAlertas(req, res) {
    let id_usuario = req.params.id_usuario;

    alertaModel.listarAlertas(id_usuario).then(function(resultado){

        console.log("Puxei os alertas" + resultado)
        res.status(200).json(resultado);
    }).catch(function(erro){
        console.error("Erro ao listarAlertas: ", erro)
        res.status(500).json(erro.sqlMessage);
    })

}

function listarAlertasEmpresa(req, res) {
    let id_empresa = req.params.id_empresa;

    alertaModel.listarAlertasEmpresa(id_empresa).then(function(resultado){

        console.log("Puxei os alertas da empresa" + resultado)
        res.status(200).json(resultado);
    }).catch(function(erro){
        console.error("Erro ao listarAlertasEmpresa: ", erro)
        res.status(500).json(erro.sqlMessage);
    })

}

module.exports = {
    listarAlertas,
    listarAlertasEmpresa
}