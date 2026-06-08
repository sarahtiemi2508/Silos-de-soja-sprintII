// Trecho que faz consulta no banco de dados
var database = require("../database/config");

function listarInfos(id_usuario) {
var instrucao = `
SELECT
nome_usuario,
dt_nascimento,
cpf,
email,
senha
FROM usuario
WHERE id_usuario = ${id_usuario};
`;
console.log("Executando a instrução SQL: \n" + instrucao);
return database.executar(instrucao);
}

function updateInfos(nome, dtNasc, cpf, email, senha, id_usuario) {
console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, cpf, dtNasc, email, senha, id_usuario);

var instrucaoSql = `
UPDATE usuario
SET
nome_usuario = '${nome}',
dt_nascimento = '${dtNasc}',
cpf = '${cpf}',
email = '${email}',
senha = '${senha}'
WHERE id_usuario = ${id_usuario};
`;
console.log("Executando a instrução SQL: \n" + instrucaoSql);
return database.executar(instrucaoSql);
}

function delUser(id_usuario) {
var instrucao = `
DELETE
FROM usuario
WHERE id_usuario = ${id_usuario};
`;
console.log("Executando a instrução SQL: \n" + instrucao);
return database.executar(instrucao);
}

function delPermissoes(id_usuario) {
var instrucao = `
DELETE FROM permissao WHERE fk_usuario = ${id_usuario};
`;
console.log("Executando a instrução SQL: \n" + instrucao);
return database.executar(instrucao);
}

module.exports = {
listarInfos,
updateInfos,
delUser,
delPermissoes
};