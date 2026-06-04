// Trecho que faz consulta no banco de dados
const { listarUsuario } = require("../controllers/fazendaController");
var database = require("../database/config");

function listarFazendas(id_usuario) {
    var instrucao = `
        SELECT 
            fu.id_usuario,
            fu.id_fazenda,
            fu.responsavel,
            fu.contato,
            fu.endereco,
            fu.nome,
            fu.qtd_silos,
            fu.qtd_bateria,
            fu.estaveis,
            fu.moderados,
            fu.criticos
        FROM usuario AS u
        JOIN permissao AS p ON u.id_usuario = p.fk_usuario
        JOIN fazendas_do_usuario AS fu ON fu.id_fazenda = p.fk_fazenda
        WHERE u.id_usuario = ${id_usuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function listarFazendasEmpresa(id_empresa) {
    var instrucao = `
        SELECT 
            fu.id_usuario,
            fu.id_fazenda,
            fu.responsavel,
            fu.contato,
            fu.endereco,
            fu.nome,
            fu.qtd_silos,
            fu.qtd_bateria,
            fu.estaveis,
            fu.moderados,
            fu.criticos
        FROM fazendas_do_usuario AS fu
        JOIN empresa AS e ON fu.id_empresa = e.id_empresa
        JOIN usuario AS u ON u.fk_empresa = e.id_empresa
        WHERE u.fk_empresa = ${id_empresa}
        GROUP BY fu.id_fazenda, fu.id_usuario;
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function listarTipoUsuario(id_usuario) {
    var instrucao = `
        SELECT fk_empresa, id_usuario, nome_usuario, tipo_usuario FROM usuario WHERE id_usuario = ${id_usuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    listarFazendas,
    listarFazendasEmpresa,
    listarTipoUsuario
};