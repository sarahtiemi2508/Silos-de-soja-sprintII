var express = require("express");
var router = express.Router();

var siloController = require("../controllers/siloController");

router.get("/dados/:idSilo", function (req, res) {
    siloController.buscarDadosSilo(req, res);
}); // pra montar kpi de um silo específico

router.get("/bateria/:idBateria", function (req, res) {
    siloController.buscarSilosBateria(req, res);
}); // Pegar os silos da bateria pra montar os botoes de passar pra outros silos

module.exports = router;