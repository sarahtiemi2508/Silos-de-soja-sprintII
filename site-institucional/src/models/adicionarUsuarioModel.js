var database = require("../database/config")



// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, email, cpf, senha, id_empresa, id_fazenda) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, cpf, senha);

    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO usuario (nome_usuario, email, cpf, senha, tipo_usuario, fk_empresa) VALUES ('${nome}', '${email}','${cpf}', '${senha}', 'Colaborador', '${id_empresa}');

        

       

   INSERT INTO permissao
    (fk_usuario, fk_fazenda, tipo_permissao)
    VALUES
    (
        (SELECT id_usuario FROM usuario WHERE cpf = '${cpf}'),
        ${id_fazenda},
        'Outros'
    );
   
   
    
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {

    cadastrar
};