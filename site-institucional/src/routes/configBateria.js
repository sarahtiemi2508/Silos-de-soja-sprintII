var express = require("express");
var router = express.Router();

var configBateriaController = require("../controllers/configBateriaController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrarBateria", function (req, res) {
    configBateriaController.cadastrarBateria(req, res);
    
})

router.get("/buscarDadosBateria", function (req, res) {
    configBateriaController.buscarDadosBateria(req, res);
});

router.post("/atualizarBateria", function (req, res) {
    configBateriaController.atualizarBateria(req, res);
});

module.exports = router;