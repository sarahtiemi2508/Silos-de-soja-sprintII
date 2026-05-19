var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.send("A API do Projeto Ceres está online e funcionando perfeitamente!");
});

module.exports = router;