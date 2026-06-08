// Trecho que faz consulta no banco de dados
var database = require("../database/config");

function listarAlertas(id_usuario) {
    var instrucao = `
        SELECT
        iss.id_bateria,
        iss.id_fazenda,
            iss.id_silo_individual,
            iss.situacao,
            iss.num_silo,
            iss.fazenda,
            iss.responsavel,
            iss.contato
        FROM infos_situacao_silo AS iss
        JOIN permissao AS p ON p.fk_fazenda = iss.id_fazenda
        JOIN usuario AS u ON u.id_usuario = p.fk_usuario
        WHERE u.id_usuario = ${id_usuario}
        ORDER BY iss.prioridade;
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function listarAlertasEmpresa(id_empresa) {
    var instrucao = `
        SELECT
            iss.situacao,
            iss.num_silo,
            iss.fazenda,
            iss.responsavel,
            iss.contato
        FROM infos_situacao_silo AS iss
        JOIN empresa AS e ON e.id_empresa = iss.id_empresa
        WHERE e.id_empresa = ${id_empresa};
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    listarAlertas,
    listarAlertasEmpresa
};