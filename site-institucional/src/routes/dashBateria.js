var express = require("express");
var router = express.Router();

var dashBateriaController = require("../controllers/dashBateriaController");

router.get("/selectInfoBateria/:id_bateria", function (req, res) {
    dashBateriaController.selectInfoBateria(req, res);
});

router.get("/selectInfoFazenda/:id_fazenda", function (req, res) {
    dashBateriaController.selectInfoFazenda(req, res);
});

router.get("/selectVolumeTotal/:id_bateria", function (req, res) {
    dashBateriaController.selectVolumeTotal(req, res);
});


router.get("/selectMaiorNivel", function (req, res) {
    dashBateriaController.selectMaiorNivel(req, res);
});

router.get("/selectMenorNivel", function (req, res) {
    dashBateriaController.selectMenorNivel(req, res);
});

router.get("/selectVolumeMensalBateria", function (req, res) {
    dashBateriaController.selectVolumeMensalBateria(req, res);
});

router.get("/selectInfoSiloIndividual", function (req, res) {
    dashBateriaController.selectInfoSiloIndividual(req, res);
});

module.exports = router;