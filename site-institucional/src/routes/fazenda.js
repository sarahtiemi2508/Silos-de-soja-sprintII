// Bibliotecas do Node
var express = require("express");
var router = express.Router();

// Variável que vai importar os itens do Controller
var fazendaController = require("../controllers/fazendaController");

router.get("/listarFazendas/:id_usuario", function (req, res) {
    // função a ser chamada quando acessar /fazenda/listarFazendas/:id_usuario
    fazendaController.listarFazendas(req, res);
});

module.exports = router;