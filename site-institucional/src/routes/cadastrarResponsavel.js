var express = require("express");
var router = express.Router();

var cadastrarResponsavelController = require("../controllers/cadastrarResponsavelController");

router.post("/", function (req, res) {
    cadastrarResponsavelController.cadastrar_responsavel(req, res);
})

module.exports = router;