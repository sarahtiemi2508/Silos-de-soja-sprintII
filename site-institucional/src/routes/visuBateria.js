var express = require("express");
var router = express.Router();

var visuBateriaController = require("../controllers/visuBateriaController");


router.get("/visualizarBateria/:id_fazenda", function (req, res) {
    visuBateriaController.visualizarBateria(req, res);
})

router.get("/detalhesBateria/:id_fazenda", function (req, res) {
    visuBateriaController.detalhesBateria(req, res);
})


module.exports = router;
