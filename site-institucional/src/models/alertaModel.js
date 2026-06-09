// Trecho que faz consulta no banco de dados COM LIMITE
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
            iss.contato,
            iss.dt_registro
        FROM infos_situacao_silo AS iss
        JOIN permissao AS p ON p.fk_fazenda = iss.id_fazenda
        JOIN usuario AS u ON u.id_usuario = p.fk_usuario
        WHERE u.id_usuario = ${id_usuario}
        ORDER BY iss.dt_registro DESC
        LIMIT 50; 
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function listarAlertasEmpresa(id_empresa) {
    var instrucao = `
        SELECT
            iss.id_alerta,
            iss.situacao,
            iss.num_silo,
            iss.fazenda,
            iss.responsavel,
            iss.contato,
            iss.dt_registro
        FROM infos_situacao_silo AS iss
        JOIN empresa AS e ON e.id_empresa = iss.id_empresa
        WHERE e.id_empresa = ${id_empresa}
        ORDER BY iss.dt_registro DESC
        LIMIT 50;
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function confirmarLeitura(id_usuario, id_alerta) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", id_usuario, id_alerta);
    
    var instrucaoSql = `
    INSERT INTO confirmacao_leitura (confirmacao, fk_usuario, fk_alerta) VALUES
    (1, ${id_usuario}, ${id_alerta});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarAlertas,
    listarAlertasEmpresa,
    confirmarLeitura
};