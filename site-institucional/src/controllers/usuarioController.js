var usuarioModel = require("../models/usuarioModel");
var empresaModel = require("../models/empresaModel");


function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);
                        res.json(resultadoAutenticar[0]);

                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var codEmpresa = req.body.codEmpresaServer;
    var nome = req.body.nomeServer;
    var cpf = req.body.cpfServer;
    var dtNasc = req.body.dtNascServer
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var telefone = req.body.telefoneServer

    // Faça as validações dos valores
    if (codEmpresa == undefined) {
        res.status(400).send("Código da empresa está undefined!");
    } else if (nome == undefined) {
        res.status(400).send("Seu CPF está undefined!");
    } else if (cpf == undefined) {
        res.status(400).send("Seu CPF está undefined!");
    } else if (dtNasc == undefined) {
        res.status(400).send("Sua data de nascimento está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (telefone == undefined) {
        res.status(400).send("Seu telefone está undefined!");
    } else {

        // Verifica se a empresa existe
        empresaModel.buscarCodigo(codEmpresa)
            .then(function(resultadoEmpresa) {
                // Se o resultado retornar mais que 0, a empresa foi encontrada
                if (resultadoEmpresa.length > 0) {

                    // Pega o ID da empresa que veio na consulta do bd
                    var idEmpresa = resultadoEmpresa[0].id_empresa;

                    // Como ele tem o código e ta se cadastrando pelo cadastro, ele é o adm da empresa
                    var tipoUsuario = 'AdmEmpresa'; 

                    // Chama a função de cadastrar
                    usuarioModel.cadastrar(nome, cpf, dtNasc, email, senha, telefone, tipoUsuario, idEmpresa)
                        .then(function (resultadoCadastro) {
                            res.json(resultadoCadastro);
                        }).catch(function (erro) {
                            console.log("Erro no cadastro do usuário:", erro.sqlMessage);
                            res.status(500).json(erro.sqlMessage);
                        });

                } else {
                    // Se o length for 0 então o cód da empresa não está no banco
                    res.status(403).send("Código de empresa inválido ou não encontrado!");
                }

            }).catch(function (erro) {
                console.log("Erro ao buscar a empresa:", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    autenticar,
    cadastrar
}