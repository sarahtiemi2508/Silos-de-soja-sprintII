var database = require("../database/config");

function inserirDadosBateria(nomeBateria, id_fazenda) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nomeBateria, id_fazenda);
    
    var instrucaoSql = `
    INSERT INTO bateria_silo (bateria_grupo, fk_fazenda) VALUES ('${nomeBateria}', '${id_fazenda}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarDadosBateria(nomeBateria, idBateria) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", nomeBateria, idBateria)
    var instrucaoSql = `
        UPDATE bateria_silo 
        SET bateria_grupo = '${nomeBateria}'
        WHERE id_bateria_silo = ${idBateria};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    inserirDadosBateria,
    atualizarDadosBateria
};