let database = require("../database/config");

function buscarDadosSilo(idSilo) {
    let instrucaoSql = `
        SELECT 
            h.distancia_captada as distancia, 
            DATE_FORMAT(h.dt_hora_leitura, '%H:%i:%s') as momento_grafico,
            s.altura_silo
        FROM historico_sensor h
        JOIN sensor sen ON sen.id_sensor = h.fk_sensor
        JOIN gp_sensores gp ON gp.id_gp_sensores = sen.fk_gp_sensores
        JOIN silo_individual s ON s.id_silo_individual = gp.fk_silo
        WHERE s.id_silo_individual = ${idSilo}
        ORDER BY h.id_historico_sensor DESC 
        LIMIT 10;
    `;
    return database.executar(instrucaoSql);
}

function buscarSilosBateria(idBateria) {
    let instrucaoSql = `
        SELECT 
            id_silo_individual as idSilo, 
            modelo_silo_indiv as modelo, 
            preenchimento
        FROM volume_preenchido_bateria
        WHERE id = ${idBateria};
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarDadosSilo,
    buscarSilosBateria
};