var express = require("express");
var router = express.Router();

var configUserController = require("../controllers/configUserController");

router.get("/listarInfos/:id_usuario", function (req, res) {
configUserController.listarInfos(req, res);
});

router.put("/updateInfos/:id_usuario", function (req, res) {
configUserController.updateInfos(req, res);
});

router.delete("/delUser/:id_usuario", function (req, res) {
configUserController.delUser(req, res);
});

router.delete("/delPermissoes/:id_usuario", function (req, res) {
configUserController.delPermissoes(req, res);
});

module.exports = router;