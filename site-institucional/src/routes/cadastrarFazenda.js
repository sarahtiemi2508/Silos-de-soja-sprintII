var express = require("express");
var router = express.Router();

var cadastrarFazendaController = require("../controllers/cadastrarFazendaController");

router.post("/cadastrar_fazenda", function (req, res) {
    cadastrarFazendaController.cadastrar_fazenda(req, res);
})

module.exports = router;