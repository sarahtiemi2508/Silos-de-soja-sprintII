var database = require("../database/config");

function inserir_endereco_fazenda(cep, logradouro_fazenda, num_logradouro, cidade_fazenda, uf_fazenda) {
  // Alterado: Retirados os '?' e colocadas as variáveis direto usando `${}`
  var instrucaoSql = `
        INSERT INTO endereco (cep, logradouro_fazenda, num_logradouro, cidade_fazenda, uf_fazenda) 
        VALUES ('${cep}', '${logradouro_fazenda}', '${num_logradouro}', '${cidade_fazenda}', '${uf_fazenda}');
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function inserir_dados_fazenda(nome_fazenda, fk_empresa, fk_endereco){
    // Alterado: Retirados os '?' e colocadas as variáveis direto usando `${}`
    var instrucaoSql = `
        INSERT INTO fazenda (nome_fazenda, fk_empresa, fk_endereco) 
        VALUES ('${nome_fazenda}', ${fk_empresa}, ${fk_endereco});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    inserir_endereco_fazenda,
    inserir_dados_fazenda
};