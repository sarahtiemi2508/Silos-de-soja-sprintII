var express = require("express");
var router = express.Router();

var dashBateriaController = require("../controllers/dashBateriaController");

router.get("/selectDashCompleta/:id_bateria", function (req, res) {
    dashBateriaController.selectDashCompleta(req, res);
});

router.get("/selectInfoBateria/:id_bateria", function (req, res) {
    dashBateriaController.selectInfoBateria(req, res);
});

router.get("/selectInfoFazenda/:id_fazenda", function (req, res) {
    dashBateriaController.selectInfoFazenda(req, res);
});

router.get("/selectVolumeTotal/:id_bateria", function (req, res) {
    dashBateriaController.selectVolumeTotal(req, res);
});


router.get("/selectMaiorNivel/:id_bateria", function (req, res) {
    dashBateriaController.selectMaiorNivel(req, res);
});

router.get("/selectMenorNivel/:id_bateria", function (req, res) {
    dashBateriaController.selectMenorNivel(req, res);
});

router.get("/selectVolumeMensalBateria/:id_bateria", function (req, res) {
    dashBateriaController.selectVolumeMensalBateria(req, res);
});

router.get("/selectInfoSiloIndividual/:id_bateria", function (req, res) {
    dashBateriaController.selectInfoSiloIndividual(req, res);
});

router.get("/selectVolumeMedio/:id_bateria", function (req, res) {
    dashBateriaController.selectVolumeMedio(req, res);
});


router.get("/selectVolumeIndividual/:id_bateria", function (req, res) {
    dashBateriaController.selectVolumeIndividual(req, res);
});

module.exports = router;