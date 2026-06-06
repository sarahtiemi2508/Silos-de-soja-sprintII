var database = require("../database/config")

function selectVolumeTotal(idBateria) {
  var instrucaoSql = `SELECT 
 bateria,
 SUM(total) AS total
 FROM volume_total
 WHERE id=${idBateria}
 GROUP BY id, bateria;`;

  return database.executar(instrucaoSql);
}

function selectOcupacaoTotal(idBateria) {
  var instrucaoSql = `SELECT
id_silo_individual as id_silo,
modelo_silo_indiv as modelo,
preenchimento
FROM volume_preenchido_bateria
WHERE id = ${idBateria};`;

  return database.executar(instrucaoSql);
}

function selectMaiorNivel() {
  var instrucaoSql = `SELECT 
	id_silo_individual as id_silo,
	modelo_silo_indiv as modelo,
	preenchimento
FROM volume_preenchido_bateria
WHERE id=${idBateria}
ORDER BY preenchimento DESC
LIMIT 1;`;

  return database.executar(instrucaoSql);
}

function selectMenorNivel(idBateria) {
  var instrucaoSql = `SELECT 
	id_silo_individual as id_silo,
	modelo_silo_indiv as modelo,
	preenchimento
FROM volume_preenchido_bateria
WHERE id=${idBateria}
ORDER BY preenchimento
LIMIT 1;`;

  return database.executar(instrucaoSql);
}

function selectVolumeIndividual(idBateria) {
  var instrucaoSql = `SELECT
id_silo_individual as id_silo,
modelo_silo_indiv as modelo,
preenchimento
FROM volume_preenchido_bateria
WHERE id = ${idBateria};`;

  return database.executar(instrucaoSql);
}

function selectVolumeMensalBateria(idBateria) {
  var instrucaoSql = `
  SELECT 
  *
  FROM media_preenchimento_mensal_por_bateria 
  WHERE bateria = ${idBateria};
  ORDER BY mes
  LIMIT 12;`;

  return database.executar(instrucaoSql);
}


module.exports = {
   selectVolumeTotal,
   selectOcupacaoTotal, 
   selectMaiorNivel,
   selectMenorNivel,
   selectVolumeMensalBateria
};