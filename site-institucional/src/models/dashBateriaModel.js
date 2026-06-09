var database = require("../database/config")

function selectInfoBateria(id_bateria) {
  var instrucaoSql = `
    SELECT 
      id_bateria_silo,
      bateria_grupo AS nome
    FROM bateria_silo
    WHERE id_bateria_silo = ${id_bateria};
`;

  return database.executar(instrucaoSql);
}
function selectInfoFazenda(id_fazenda) {
  var instrucaoSql = `
    SELECT 
      id_fazenda,
      nome_fazenda AS nome
    FROM fazenda
    WHERE id_fazenda = ${id_fazenda};
`;

  return database.executar(instrucaoSql);
}

function selectVolumeTotal(id_bateria) {
  var instrucaoSql = `
    SELECT 
      id,
      bateria,
      SUM(preenchimento) AS nivelTotal,
      count(*) AS quantidade
    FROM volume_preenchido_bateria
    WHERE id = ${id_bateria}
    GROUP BY bateria;
`;

  return database.executar(instrucaoSql);
}



function selectMaiorNivel() {
  var instrucaoSql = `
    SELECT 
      id_silo_individual as id_silo,
      modelo_silo_indiv as modelo,
      preenchimento,
      total
    FROM volume_preenchido_bateria
    WHERE id = ${idBateria}
    ORDER BY preenchimento DESC
    LIMIT 1;
`;

  return database.executar(instrucaoSql);
}

function selectMenorNivel(idBateria) {
  var instrucaoSql = `
    SELECT 
      id_silo_individual as id_silo,
      modelo_silo_indiv as modelo,
      preenchimento,
      total
    FROM volume_preenchido_bateria
    WHERE id=${idBateria}
    ORDER BY preenchimento
    LIMIT 1;
`;

  return database.executar(instrucaoSql);
}

function selectVolumeIndividual(idBateria) {
  var instrucaoSql = `
    SELECT
      id_silo_individual as id_silo,
      modelo_silo_indiv as modelo,
      preenchimento,
      total
    FROM volume_preenchido_bateria
    WHERE id = ${idBateria}
    LIMIT 6;
`;

  return database.executar(instrucaoSql);
}

function selectVolumeMensalBateria(idBateria) {
  var instrucaoSql = `
    SELECT 
      *
    FROM media_preenchimento_mensal_por_bateria 
    WHERE bateria = ${idBateria};
    ORDER BY mes
    LIMIT 12;
  `;

  return database.executar(instrucaoSql);
}

function selectInfoSiloIndividual(){
var instrucaoSql = `
    select 
si.id_silo_individual AS idSilo,
si.modelo_silo AS nome,
si.fk_bateria_silo as idBateria,
a.situacao AS situacao
FROM silo_individual si
JOIN gp_sensores gs 
ON gs.fk_silo = si.id_silo_individual
JOIN sensor s
ON s.fk_gp_sensores = gs.id_gp_sensores
JOIN historico_sensor hs
ON hs.fk_sensor = s.id_sensor
JOIN alerta a
ON a.fk_historico_sensor = hs.id_historico_sensor
WHERE si.fk_bateria_silo=${idBateria};
  `;

  return database.executar(instrucaoSql);
}

module.exports = {
  selectInfoBateria,
  selectInfoFazenda,
   selectVolumeTotal,
   selectMaiorNivel,
   selectMenorNivel,
   selectVolumeMensalBateria,
   selectInfoSiloIndividual
};