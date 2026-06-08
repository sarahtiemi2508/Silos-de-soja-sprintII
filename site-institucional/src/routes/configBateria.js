var express = require("express");
var router = express.Router();

var configBateriaController = require("../controllers/configBateriaController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/inserirDadosBateria/:id_fazenda", function (req, res) {
    configBateriaController.inserirDadosBateria(req, res);
});

router.get("/buscarDadosBateria", function (req, res) {
    configBateriaController.buscarDadosBateria(req, res);
});

router.post("/atualizarDadosBateria/:id_bateria", function (req, res) {
    configBateriaController.atualizarDadosBateria(req, res);
});

module.exports = router;