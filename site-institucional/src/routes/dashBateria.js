var express = require("express");
var router = express.Router();

var dashBateriaController = require("../controllers/dashBateriaController");

router.get("/selectVolumeTotal/:id", function (req, res) {
    dashBateriaController.selectVolumeTotal(req, res);
});

router.get("/selectOcupacaoTotal/:id", function (req, res) {
    dashBateriaController.selectOcupacaoTotal(req, res);
});

router.get("/selectMaiorNivel/:id", function (req, res) {
    dashBateriaController.selectMaiorNivel(req, res);
});

router.get("/selectMenorNivel/:id", function (req, res) {
    dashBateriaController.selectMenorNivel(req, res);
});

router.get("/selectVolumeMensalBateria/:id", function (req, res) {
    dashBateriaController.selectVolumeMensalBateria(req, res);
});


module.exports = router;