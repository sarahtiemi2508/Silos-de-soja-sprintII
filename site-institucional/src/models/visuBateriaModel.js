var database = require("../database/config")

//
function visualizarBateria(id_fazenda) {

    var instrucaoSql = `
   SELECT
	nome_empresa,
    cnpj_empresa,
	id_empresa,
	id_usuario,
	id_fazenda,
    end_cep,
    end_log,
    end_num,
    end_cidade,
    end_uf,
	responsavel,
    resp_email,
    contato,
    endereco,
	nome_fazenda,
	COUNT(DISTINCT id_silo) AS qtd_silos,
	COUNT(DISTINCT id_bateria) AS qtd_bateria,
	SUM(CASE WHEN situacao_silo = 'Estável' THEN 1 ELSE 0 END) AS estaveis,
	SUM(CASE WHEN situacao_silo = 'Moderado' THEN 1 ELSE 0 END) AS moderados,
	SUM(CASE WHEN situacao_silo = 'Crítico' THEN 1 ELSE 0 END) AS criticos
FROM (

	SELECT
		e.nome_fantasia as nome_empresa,
        e.cnpj_empresa as cnpj_empresa,
		f.fk_empresa AS id_empresa,
		rf.id_usuario AS id_usuario,
		rf.responsavel AS responsavel,
		rf.contato AS contato,
        rf.email AS resp_email,
		rf.endereco AS endereco,
		f.id_fazenda AS id_fazenda,
		f.nome_fazenda AS nome_fazenda,
        ende.cep AS end_cep,
        ende.logradouro_fazenda AS end_log,
        ende.num_logradouro AS end_num,
        ende.cidade_fazenda AS end_cidade,
        ende.uf_fazenda AS end_uf,
		b.id_bateria_silo AS id_bateria,
		b.bateria_grupo AS bateria,
		s.id_silo_individual AS id_silo,
		s.modelo_silo AS silo,
		a.situacao AS situacao_silo
	FROM fazenda AS f
    JOIN endereco ende ON f.fk_endereco = ende.id_endereco
	JOIN bateria_silo AS b ON b.fk_fazenda = f.id_fazenda
	JOIN silo_individual AS s ON s.fk_bateria_silo = b.id_bateria_silo
	JOIN gp_sensores AS gs ON gs.fk_silo = s.id_silo_individual
	JOIN sensor AS sr ON sr.fk_gp_sensores = gs.id_gp_sensores
	JOIN historico_sensor AS hs ON hs.fk_sensor = sr.id_sensor
	JOIN alerta AS a ON a.fk_historico_sensor = hs.id_historico_sensor
    JOIN responsavel_fazenda AS rf ON rf.id_fazenda = f.id_fazenda
    JOIN empresa AS e ON e.id_empresa = f.fk_empresa
) AS qtd_situacoes
 WHERE id_fazenda = ${id_fazenda}
GROUP BY nome_fazenda, responsavel, contato, endereco, id_fazenda, id_usuario, cnpj_empresa;


`;
    return database.executar(instrucaoSql);
}



function detalhesBateria(id_fazenda){
    var instrucaoSql = `
   SELECT
    id_bateria_silo,
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

    WHERE b.fk_fazenda = ${id_fazenda}

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
    return database.executar(instrucaoSql);
}
module.exports = {
    visualizarBateria,
    detalhesBateria
};