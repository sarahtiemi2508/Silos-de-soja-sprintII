var database = require("../database/config")

function inserirDadosBateria(nomeBateria, alturaSilos, diametroSilos) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nomeBateria, alturaSilos, diametroSilos);
    
    var instrucaoSql = `
    INSERT INTO bateria_silo (bateria_grupo, fk_fazenda) VALUES ('${nomeBateria}', ${fk_fazenda});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDadosBateria(){
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ")
    var instrucaoSql = ` SELECT
        id_bateria_silo AS idBateria,
        bateria_grupo AS nomeBateria
        FROM bateria_silo;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarDadosBateria(idBateria, alturaSilos, diametroSilos) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", idBateria, alturaSilos, diametroSilos)
    var instrucaoSql = `
        UPDATE silo_individual 
        SET altura_silo=${alturaSilos} AND diametro_silo=${diametroSilos}
        WHERE fk_bateria_silo=${idBateria};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    inserirDadosBateria,
    buscarDadosBateria,
    atualizarDadosBateria
};