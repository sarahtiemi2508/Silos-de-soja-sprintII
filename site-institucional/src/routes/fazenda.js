// Bibliotecas do Node
var express = require("express");
var router = express.Router();

// Variável que vai importar os itens do Controller
var fazendaController = require("../controllers/fazendaController");

router.get("/listarFazendas/:id_usuario", function (req, res) {
    // função a ser chamada quando acessar /fazenda/listarFazendas/:id_usuario
    fazendaController.listarFazendas(req, res);
});

router.get("/listarFazendasEmpresa/:id_empresa", function (req, res) {
    // função a ser chamada quando acessar /fazenda/listarFazendasEmpresa/:id_empresa
    fazendaController.listarFazendasEmpresa(req, res);
});

router.get("/listarTipoUsuario/:id_usuario", function (req, res) {
    // função a ser chamada quando acessar /fazenda/listarUsuario/:id_usuario
    fazendaController.listarTipoUsuario(req, res);
});

module.exports = router;