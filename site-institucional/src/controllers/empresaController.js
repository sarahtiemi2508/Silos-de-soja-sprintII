var empresaModel = require("../models/empresaModel");


function cadastrar(req, res) {
  var nomeFantasia = req.body.nomeFantasiaServer;
  var cnpj = req.body.cnpjServer;
  var razaoSocial = req.body.razaoSocialServer;

  res.status(201).json(resultado);
  
}

module.exports = {
  cadastrar,
};
