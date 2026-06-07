var database = require("../database/config");

function inserir_endereco_fazenda(cep, logradouro_fazenda, num_logradouro, cidade_fazenda, uf_fazenda) {
  var instrucaoSql = `
        insert into endereco (cep, logradouro_fazenda, num_logradouro, cidade_fazenda, uf_fazenda) values (?, ?, ?, ?, ?);
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql, [cep, logradouro_fazenda, num_logradouro, cidade_fazenda, uf_fazenda]);
}

function inserir_dados_fazenda(nome_fazenda, fk_empresa, fk_endereco){
    var instrucaoSql = `
        insert into fazenda (nome_fazenda, fk_empresa, fk_endereco) values (?, ?, ?);
    `;
      console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql, [nome_fazenda, fk_empresa, fk_endereco]);
}


module.exports = {
    inserir_endereco_fazenda,
    inserir_dados_fazenda
};
