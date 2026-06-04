var usuarioModel = require("../models/usuarioModel");

function cadastrarBateria(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nomeSilos = req.body.nomeBateriaServer;
    var qtdSilos = req.body.qtdSilosServer;
    var alturaSilos = req.body.alturaSiloServer;
    var diametroSilos = req.body.diametroSiloServer

    // Faça as validações dos valores
    if (nomeSilos == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (qtdSilos == undefined) {
        res.status(400).send("Seu CPF está undefined!");
    } else if (alturaSilos == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (diametroSilos == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {

        configBateriaModel.cadastrarBateria(nomeSilos, qtdSilos, alturaSilos, diametroSilos)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function buscarDadosBateria(req, res) {
    var idUsuario = req.params.id;

console.log("idUsuario recebido:", idUsuario);

    configBateriaModel.buscarDadosBateria(idUsuario, limite_linhas)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}


function atualizar(req, res) {
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


                        res.json({
                            id: resultadoAutenticar[0].id,
                            email: resultadoAutenticar[0].email,
                            nome: resultadoAutenticar[0].nome,
                            senha: resultadoAutenticar[0].senha,
                            grupo: resultadoAutenticar[0].grupo,
                            cpf: resultadoAutenticar[0].cpf
                        });
                    }
                    else if (resultadoAutenticar.length == 0) {
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


module.exports = {
    cadastrar,
    atualizar
}