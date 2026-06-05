var express = require("express");
var router = express.Router();

var addUserController = require("../controllers/adicionarUsuarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    addUserController.cadastrar(req, res);
})

module.exports = router;