var configUserModel = require("../models/configUserModel");

function listarInfos(req, res) {

let id_usuario = req.params.id_usuario;

configUserModel.listarInfos(id_usuario).then(function(resultado){

console.log("Puxei as informações do usuário" + resultado)
res.status(200).json(resultado);
}).catch(function(erro){
console.error("Erro ao listarInfos(): ", erro)
res.status(500).json(erro.sqlMessage);
})
}

function updateInfos(req, res) {

let id_usuario = req.params.id_usuario;

var nome = req.body.nomeServer;
var dtNasc = req.body.dtNascServer;
var cpf = req.body.cpfServer;
var email = req.body.emailServer;
var senha = req.body.senhaServer;

if (nome == undefined) {
res.status(400).send("Seu nome está undefined!");
} else if (cpf == undefined) {
res.status(400).send("Seu CPF está undefined!");
} else if (dtNasc == undefined) {
res.status(400).send("Sua data de nascimento está undefined!");
} else if (email == undefined) {
res.status(400).send("Seu email está undefined!");
} else if (senha == undefined) {
res.status(400).send("Sua senha está undefined!");
} else {

// Chama a função de atualizar informações
configUserModel.updateInfos(nome, dtNasc, cpf, email, senha, id_usuario)
.then(function (resultadoUpdate) {
res.json(resultadoUpdate);
}).catch(function (erro) {
console.log("Erro no updateInfos do usuario:", erro);
res.status(500).json(erro);
});

}
}

function delUser(req, res) {

let id_usuario = req.params.id_usuario;

configUserModel.delUser(id_usuario).then(function(resultado){

console.log("Deletei o usuário: " + resultado)
res.status(200).json(resultado);
}).catch(function(erro){
console.error("Erro ao executar delUser(): ", erro)
res.status(500).json(erro.sqlMessage);
})
}

function delPermissoes(req, res) {

let id_usuario = req.params.id_usuario;

configUserModel.delPermissoes(id_usuario).then(function(resultado){

console.log("Deletei o usuário: " + resultado)
res.status(200).json(resultado);
}).catch(function(erro){
console.error("Erro ao executar delUser(): ", erro)
res.status(500).json(erro.sqlMessage);
})
}

module.exports = {
listarInfos,
updateInfos,
delUser,
delPermissoes
}