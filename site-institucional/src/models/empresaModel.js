var database = require("../database/config");



function cadastrar(nomeFantasia, cnpj, razaoSocial ) {
  var instrucaoSql = `INSERT INTO empresa (nome_fantasia, cnpj_empresa, razao_social) VALUES ('${nomeFantasia}', '${cnpj}', '${razaoSocial}')`;

  return database.executar(instrucaoSql);
}

module.exports = {cadastrar};
