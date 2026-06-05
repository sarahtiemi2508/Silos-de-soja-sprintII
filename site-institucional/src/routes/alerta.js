// Bibliotecas do Node
var express = require("express");
var router = express.Router();

// Variável que vai importar os itens do Controller
var alertaController = require("../controllers/alertaController");

router.get("/listarAlertas/:id_usuario", function (req, res) {
    // função a ser chamada quando acessar /fazenda/listarAlertas/:id_usuario
    alertaController.listarAlertas(req, res);
});

router.get("/listarAlertasEmpresa/:id_empresa", function (req, res) {
    // função a ser chamada quando acessar /fazenda/listarAlertasEmpresa/:id_empresa
    alertaController.listarAlertasEmpresa(req, res);
});

module.exports = router;