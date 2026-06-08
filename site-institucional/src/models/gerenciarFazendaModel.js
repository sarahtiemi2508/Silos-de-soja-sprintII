var database = require("../database/config");

function pegarInfoFazenda(idFazenda) {
    console.log("Entrei na função pegarInfoFazenda do gerenciarFazendaModel com o id da fazenda ", idFazenda);

    var instrucaoSql = `
    SELECT
	    e.nome_fantasia AS nome_empresa,
	    e.cnpj_empresa,
	    f.id_fazenda,
	    f.nome_fazenda,
	    ende.cep AS end_cep,
	    ende.logradouro_fazenda AS end_log,
	    ende.num_logradouro AS end_num,
	    ende.cidade_fazenda AS end_cidade,
	    ende.uf_fazenda AS end_uf,
	    rf.id_usuario AS id_responsavel,
	    rf.responsavel,
	    rf.email AS resp_email,
	    rf.contato
    FROM fazenda AS f
    JOIN endereco AS ende
	    ON f.fk_endereco = ende.id_endereco
    JOIN empresa AS e 
	    ON e.id_empresa = f.fk_empresa
    JOIN responsavel_fazenda AS rf
	    ON rf.id_fazenda = f.id_fazenda
    WHERE f.id_fazenda = ${idFazenda};
    `;

    console.log("Executando o comando sql: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarFazenda(idFazenda, nomeFazenda, cep, logradouro, numero, cidade, uf) {
    console.log("Entrei na função atualizarFazenda do gerenciarFazendaModel com o id da fazenda", idFazenda, nomeFazenda);

    var instrucaoSql = `
    UPDATE endereco AS ende
    JOIN fazenda AS f
        ON f.fk_endereco = ende.id_endereco
    SET
        ende.cep = '${cep}',
        ende.logradouro_fazenda = '${logradouro}',
        ende.num_logradouro = '${numero}',
        ende.cidade_fazenda = '${cidade}',
        ende.uf_fazenda = '${uf}',
        f.nome_fazenda = '${nomeFazenda}'
        WHERE f.id_fazenda = ${idFazenda};
    `;

    console.log("Executando o comando sql: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletarFazenda(idFazenda) {
    var sqlAlerta = `DELETE a FROM alerta a JOIN historico_sensor hs ON a.fk_historico_sensor = hs.id_historico_sensor JOIN sensor sr ON hs.fk_sensor = sr.id_sensor JOIN gp_sensores gs ON sr.fk_gp_sensores = gs.id_gp_sensores JOIN silo_individual s ON gs.fk_silo = s.id_silo_individual JOIN bateria_silo b ON s.fk_bateria_silo = b.id_bateria_silo WHERE b.fk_fazenda = ${idFazenda};`;
    var sqlHistorico = `DELETE hs FROM historico_sensor hs JOIN sensor sr ON hs.fk_sensor = sr.id_sensor JOIN gp_sensores gs ON sr.fk_gp_sensores = gs.id_gp_sensores JOIN silo_individual s ON gs.fk_silo = s.id_silo_individual JOIN bateria_silo b ON s.fk_bateria_silo = b.id_bateria_silo WHERE b.fk_fazenda = ${idFazenda};`;
    var sqlSensor = `DELETE sr FROM sensor sr JOIN gp_sensores gs ON sr.fk_gp_sensores = gs.id_gp_sensores JOIN silo_individual s ON gs.fk_silo = s.id_silo_individual JOIN bateria_silo b ON s.fk_bateria_silo = b.id_bateria_silo WHERE b.fk_fazenda = ${idFazenda};`;
    var sqlGp = `DELETE gs FROM gp_sensores gs JOIN silo_individual s ON gs.fk_silo = s.id_silo_individual JOIN bateria_silo b ON s.fk_bateria_silo = b.id_bateria_silo WHERE b.fk_fazenda = ${idFazenda};`;
    var sqlSilo = `DELETE s FROM silo_individual s JOIN bateria_silo b ON s.fk_bateria_silo = b.id_bateria_silo WHERE b.fk_fazenda = ${idFazenda};`;
    var sqlBateria = `DELETE FROM bateria_silo WHERE fk_fazenda = ${idFazenda};`;
    var sqlPermissao = `DELETE FROM permissao WHERE fk_fazenda = ${idFazenda};`;
    var sqlFazenda = `DELETE FROM fazenda WHERE id_fazenda = ${idFazenda};`;

    console.log("Apagando a fazenda toda");

    return database.executar(sqlAlerta)
        .then(function () { return database.executar(sqlHistorico); })
        .then(function () { return database.executar(sqlSensor); })
        .then(function () { return database.executar(sqlGp); })
        .then(function () { return database.executar(sqlSilo); })
        .then(function () { return database.executar(sqlBateria); })
        .then(function () { return database.executar(sqlPermissao); })
        .then(function () { return database.executar(sqlFazenda); });
}

function pegarBaterias(idFazenda) {
    console.log("Entrei na função pegarBaterias do gerenciarFazendaModel com o id da fazenda ", idFazenda);

    // A query vai somar na quantidade contando
    var instrucaoSql = `
    SELECT 
            id_bateria_silo AS id_bateria,
            nome_bateria,
            COUNT(DISTINCT id_silo_individual) AS qtd_silos,
            COUNT(CASE WHEN situacao = 'Crítico' THEN 1 END) AS criticos,
            COUNT(CASE WHEN situacao = 'Moderado' THEN 1 END) AS moderados,
            COUNT(CASE WHEN situacao = 'Estável' THEN 1 END) AS estaveis
        FROM (
            SELECT 
                b.id_bateria_silo,
                b.bateria_grupo AS nome_bateria,
                s.id_silo_individual,
                CASE 
                    WHEN AVG(hs.distancia_captada) >= s.altura_silo * 0.85 
                        THEN 'Crítico'
                    WHEN AVG(hs.distancia_captada) >= s.altura_silo * 0.60 
                        THEN 'Moderado'
                    ELSE 'Estável'
                END AS situacao
            FROM bateria_silo b
            JOIN silo_individual s 
                ON s.fk_bateria_silo = b.id_bateria_silo
            JOIN gp_sensores gs 
                ON gs.fk_silo = s.id_silo_individual
            JOIN sensor sr 
                ON sr.fk_gp_sensores = gs.id_gp_sensores
            JOIN historico_sensor hs 
                ON hs.fk_sensor = sr.id_sensor
            WHERE b.fk_fazenda = ${idFazenda}
            GROUP BY 
                b.id_bateria_silo,
                b.bateria_grupo,
                s.id_silo_individual,
                s.altura_silo
        ) AS situacoes_silo
        GROUP BY 
            id_bateria_silo,
            nome_bateria;
    `;

    console.log("Executando o comando sql: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function pegarUsuariosFazenda(idFazenda) {
    console.log("Entrei na função pegarUsuariosFazenda do gerenciarFazendaModel com o id da fazenda ", idFazenda);

    var instrucaoSql = `
    SELECT
        u.id_usuario,
        u.nome_usuario,
        u.email,
        p.tipo_permissao
    FROM permissao AS p
    JOIN usuario AS u
        ON u.id_usuario = p.fk_usuario
    WHERE p.fk_fazenda = ${idFazenda}
    ORDER BY
        CASE p.tipo_permissao
            WHEN 'Empresa' THEN 1
            WHEN 'Responsável' THEN 2
            ELSE 3
        END;
    `;

    console.log("Executando o comando sql: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function addUsuarioFazenda(idFazenda, idUsuario, tipoPermissao) {
    console.log("Entrei na função addUsuarioFazenda do gerenciarFazendaModel com o id da fazenda, id do usuario e o tipo desse usuario sendo: ", idFazenda, idUsuario, tipoPermissao);

    var instrucaoSql = `
        INSERT INTO permissao (fk_usuario, fk_fazenda, tipo_permissao)
        VALUES (${idUsuario}, ${idFazenda}, '${tipoPermissao}');
    `;

    console.log("Executando o comando sql: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletarUsuarioFazenda(idFazenda, idUsuario) {
    console.log("Entrei na função deletarUsuarioFazenda do gerenciarFazendaModel com o id da fazenda e id do usuario sendo: ", idFazenda, idUsuario);

    var instrucaoSql = `
        DELETE FROM permissao
        WHERE fk_fazenda = ${idFazenda}
        AND fk_usuario = ${idUsuario};
    `;

    console.log("Executando o comando sql: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletarBateria(idBateria) {
    var sqlAlerta = `DELETE a FROM alerta a JOIN historico_sensor hs ON a.fk_historico_sensor = hs.id_historico_sensor JOIN sensor sr ON hs.fk_sensor = sr.id_sensor JOIN gp_sensores gs ON sr.fk_gp_sensores = gs.id_gp_sensores JOIN silo_individual s ON gs.fk_silo = s.id_silo_individual WHERE s.fk_bateria_silo = ${idBateria};`;
    var sqlHistorico = `DELETE hs FROM historico_sensor hs JOIN sensor sr ON hs.fk_sensor = sr.id_sensor JOIN gp_sensores gs ON sr.fk_gp_sensores = gs.id_gp_sensores JOIN silo_individual s ON gs.fk_silo = s.id_silo_individual WHERE s.fk_bateria_silo = ${idBateria};`;
    var sqlSensor = `DELETE sr FROM sensor sr JOIN gp_sensores gs ON sr.fk_gp_sensores = gs.id_gp_sensores JOIN silo_individual s ON gs.fk_silo = s.id_silo_individual WHERE s.fk_bateria_silo = ${idBateria};`;
    var sqlGp = `DELETE gs FROM gp_sensores gs JOIN silo_individual s ON gs.fk_silo = s.id_silo_individual WHERE s.fk_bateria_silo = ${idBateria};`;
    var sqlSilo = `DELETE FROM silo_individual WHERE fk_bateria_silo = ${idBateria};`;
    var sqlBateria = `DELETE FROM bateria_silo WHERE id_bateria_silo = ${idBateria};`;

    console.log("Apagando a bateria");

    // Pra ir fazendo se a anterior der certo
    return database.executar(sqlAlerta)
        .then(function () { return database.executar(sqlHistorico); })
        .then(function () { return database.executar(sqlSensor); })
        .then(function () { return database.executar(sqlGp); })
        .then(function () { return database.executar(sqlSilo); })
        .then(function () { return database.executar(sqlBateria); });
}

module.exports = {
    pegarInfoFazenda,
    atualizarFazenda,
    deletarFazenda,
    pegarBaterias,
    pegarUsuariosFazenda,
    addUsuarioFazenda,
    deletarUsuarioFazenda,
    deletarBateria
};