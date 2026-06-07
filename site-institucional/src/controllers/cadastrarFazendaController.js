var cadastrarFazendaModel = require("../models/cadastrarFazendaModel");

function cadastrar_fazenda(req, res) {
  //
  var nome_fazenda = req.body.nomeFazendaServer;
  var logradouro = req.body.logradouroServer;
  var cep = req.body.cepServer;
  var numero = req.body.numeroServer;
  var uf = req.body.ufServer;
  var cidade = req.body.cidadeServer;
  var fk_empresa = req.body.fkEmpresaServer;

  cadastrarFazendaModel
    .inserir_endereco_fazenda(cep, logradouro, numero, cidade, uf)
    .then((resultadoEndereco) => {
      var fk_endereco = resultadoEndereco.insertId;
      return cadastrarFazendaModel.inserir_dados_fazenda(
        nome_fazenda,
        fk_empresa,
        fk_endereco,
      );
      
    })

    .then((resultadoFazenda) => {
      res.status(201).json({
        mensagem: "Cadastro de fazenda e endereço realizado com sucesso!",
        resultado: resultadoFazenda,
      });
    })
    .catch((erro) => {
      console.error("Erro no processo de cadastro_fazenda:", erro);
      res.status(500).json({ erro: erro.sqlMessage });
    });
}

module.exports = {
    cadastrar_fazenda
};
