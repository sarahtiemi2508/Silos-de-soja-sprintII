var express = require("express");
var router = express.Router();

var gerenciarFazendaController = require("../controllers/gerenciarFazendaController");

// Fazendas
router.get("/info/:id_fazenda", function (req, res) {
    gerenciarFazendaController.pegarInfoFazenda(req, res);
});
router.put("/atualizar", function (req, res) {
    gerenciarFazendaController.atualizarFazenda(req, res);
});
router.delete("/excluir", function (req, res) {
    gerenciarFazendaController.deletarFazenda(req, res);
});

// Baterias
router.get("/baterias/:id_fazenda", function (req, res) {
    gerenciarFazendaController.pegarBaterias(req, res);
});
router.delete("/deletarBateria", function (req, res) {
    gerenciarFazendaController.deletarBateria(req, res);
});

// Funcionarios
router.get("/usuarios/:id_fazenda", function (req, res) {
    gerenciarFazendaController.pegarUsuariosFazenda(req, res);
});
router.post("/usuarios/adicionar", function (req, res) {
    gerenciarFazendaController.addUsuarioFazenda(req, res);
});
router.delete("/usuarios/remover", function (req, res) {
    gerenciarFazendaController.deletarUsuarioFazenda(req, res);
});

module.exports = router;