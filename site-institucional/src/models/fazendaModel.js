// Trecho que faz consulta no banco de dados
const { listarUsuario } = require("../controllers/fazendaController");
var database = require("../database/config");

function listarFazendas(id_usuario) {
    var instrucao = `
        
SELECT

    id_empresa,
    id_usuario,
    id_fazenda,
    responsavel,
    contato,
    email,
    endereco,
    nome,
    COUNT(DISTINCT id_silo) AS qtd_silos,
    COUNT(DISTINCT id_bateria) AS qtd_bateria,
    SUM(CASE WHEN situacao_silo = 'Estável' THEN 1 ELSE 0 END) AS estaveis,
    SUM(CASE WHEN situacao_silo = 'Moderado' THEN 1 ELSE 0 END) AS moderados,
    SUM(CASE WHEN situacao_silo = 'Crítico' THEN 1 ELSE 0 END) AS criticos
FROM (
    SELECT
        f.fk_empresa AS id_empresa,
        rf.id_usuario AS id_usuario,
        rf.responsavel AS responsavel,
        rf.contato AS contato,
        rf.email AS email,
        rf.endereco AS endereco,
        
        f.id_fazenda AS id_fazenda,
        f.nome_fazenda AS nome,

                b.id_bateria_silo AS id_bateria,
                
                s.id_silo_individual AS id_silo,

                CASE
                    WHEN AVG(ultima_leitura.distancia_captada) >= s.altura_silo * 0.85
                        THEN 'Crítico'
                    WHEN AVG(ultima_leitura.distancia_captada) >= s.altura_silo * 0.60
                        THEN 'Moderado'
                    ELSE 'Estável'
                END AS situacao_silo

            FROM fazenda f
            JOIN bateria_silo b ON b.fk_fazenda = f.id_fazenda
            JOIN silo_individual s ON s.fk_bateria_silo = b.id_bateria_silo
            JOIN gp_sensores gs ON gs.fk_silo = s.id_silo_individual
            JOIN sensor sr ON sr.fk_gp_sensores = gs.id_gp_sensores
            JOIN responsavel_fazenda rf ON rf.id_fazenda = f.id_fazenda
            JOIN (
                SELECT hs_dados.fk_sensor, hs_dados.distancia_captada
                FROM historico_sensor hs_dados
                JOIN (
                    SELECT fk_sensor, MAX(id_historico_sensor) AS max_id
                    FROM historico_sensor
                    GROUP BY fk_sensor
                ) hs_max ON hs_dados.id_historico_sensor = hs_max.max_id
            ) ultima_leitura ON ultima_leitura.fk_sensor = sr.id_sensor
            
            WHERE rf.id_usuario = ${id_usuario}
            
            GROUP BY
                f.fk_empresa, rf.id_usuario, rf.responsavel, rf.contato, rf.endereco,
                f.id_fazenda, f.nome_fazenda, b.id_bateria_silo, s.id_silo_individual, s.altura_silo
                
        ) AS qtd_situacoes
        GROUP BY
            id_empresa, id_usuario, id_fazenda, responsavel, contato, endereco, nome;
    `;
    console.log("Executando a instrução SQL da Fazenda: \n" + instrucao);
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