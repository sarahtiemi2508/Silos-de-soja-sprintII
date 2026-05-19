var database = require("../database/config");

function buscarCodigo(codEmpresa) {
  // Pega o id da empresa com o cod inserido pelo user
    var instrucaoSql = `
        SELECT id_empresa, nome_fantasia 
        FROM empresa 
        WHERE cod_empresa = '${codEmpresa}';
    `;
    
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarCodigo,
};

