var cadastrarResponsavelModel = require("../models/cadastrarResponsavelModel");

function cadastrar_responsavel(req, res) {
  //
  var nome = req.body.nomeServer;
  var email = req.body.emailServer;
  var cpf = req.body.cpfServer;
  var senha = req.body.senhaServer;
  var tipo_usuario = req.body.tipoServer;
  var fk_empresa = req.body.fkEmpresaServer;

  var fk_fazenda = req.body.fkFazendaServer;

    cadastrarResponsavelModel.inserir_responsavel_fazenda(nome, email, cpf, senha, tipo_usuario, fk_empresa)
        .then((resultado_responsavel) => {
            var fk_usuario = resultado_responsavel.insertId;
            return cadastrarResponsavelModel.inserir_permissao_responsavel(fk_usuario, fk_fazenda);
        })
        .then((resultadoPermissao) => {
      // se os dois inserts darem certo
      res.status(201).json({
        mensagem: "Responsável e permissão cadastrados com sucesso!",
        resultado: resultadoPermissao,
      });
    })
    .catch((erro) => {
      console.error("Erro no processo de cadastro do responsável:", erro);
      res.status(500).json({ erro: erro.sqlMessage });
    });

}

module.exports = {
    cadastrar_responsavel
};