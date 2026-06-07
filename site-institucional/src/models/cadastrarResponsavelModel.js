var database = require("../database/config");

function inserir_responsavel_fazenda(nome, email, cpf, senha, tipo_usuario, fk_empresa) {
  var instrucaoSql = `
        INSERT INTO usuario (nome_usuario, cpf, senha, email, tipo_usuario, fk_empresa) 
        VALUES ('${nome}', '${cpf}', '${senha}', '${email}', '${tipo_usuario}', ${fk_empresa});
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function inserir_permissao_responsavel(fk_usuario, fk_fazenda) {
  var instrucaoSql = `
        INSERT INTO permissao (fk_usuario, fk_fazenda, tipo_permissao) 
        VALUES (${fk_usuario}, ${fk_fazenda}, 'Responsável');
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
    inserir_responsavel_fazenda,
    inserir_permissao_responsavel
};