// Trecho que faz consulta no banco de dados
var database = require("../database/config");

function listarFazendas(id_usuario) {
    var instrucao = `
        SELECT 
            id_usuario,
            id_fazenda,
            responsavel,
            contato,
            endereco,
            nome,
            qtd_silos,
            qtd_bateria,
            estaveis,
            moderados,
            criticos
        FROM fazendas_do_usuario
        WHERE id_usuario = ${id_usuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    listarFazendas
};