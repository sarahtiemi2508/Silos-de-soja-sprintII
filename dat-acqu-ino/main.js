// importa as bibliotecas necessárias
const serialport = require('serialport');
const express = require('express');
const mysql = require('mysql2');

// constantes para configurações
const SERIAL_BAUD_RATE = 9600;
const SERVIDOR_PORTA = 3300;

// habilita ou desabilita a inserção de dados no banco de dados
const HABILITAR_OPERACAO_INSERIR = true;

// Altura do que vamos usar como silo fake. pode ser a garrafinha de 15cm
const alturaSiloProt = 15.0;
const alturaSiloRealM = 20.0; // Altura em metros do silos da bateria 1 no BD

function pegarSituacaoAlerta(porcentagemPreenchida) {
    if (porcentagemPreenchida > 85) {
        return 'Crítico';
    } else if (porcentagemPreenchida >= 76) {
        return 'Moderado';
    } else if (porcentagemPreenchida >= 26 && porcentagemPreenchida <= 75) {
        return 'Estável';
    } else if (porcentagemPreenchida >= 15) {
        return 'Moderado';
    } else {
        return 'Crítico'; // menos de 15
    }
}

function pegarPrioridadeAlerta(porcentagemPreenchida) {
    if (porcentagemPreenchida > 85) {
        return 1;
    } else if (porcentagemPreenchida >= 76) {
        return 3; // Moderado alto
    } else if (porcentagemPreenchida >= 26 && porcentagemPreenchida <= 75) {
        return 5; // Ok ideal
    } else if (porcentagemPreenchida >= 15) {
        return 4; // Moderado baixo
    } else {
        return 2; // Crítico baixo
    }
}

let ultimoEstadoInserido = null;

const serial = async (valoresSensorUltrassonico) => {
    // conexão com o banco de dados MySQL
    let poolBancoDados = mysql.createPool({
        host: 'localhost',
        user: 'ceresADMIN',
        password: 'Urubu@67',
        database: 'ceres',
        port: 3306
    }).promise();

    // procurar arduino
    const portas = await serialport.SerialPort.list();
    const portaArduino = portas.find(porta => porta.vendorId == '1A86' || porta.vendorId == '2341');

    if (!portaArduino) {
        // Mostrar o erro no terminal
        console.log("Nenhum Arduino encontrado");
        console.log("Verifique se o cabo USB está bem conectado");
        return;
    }

    console.log(`Arduino conectado na porta: ${portaArduino.path}`);
    const arduino = new serialport.SerialPort({ path: portaArduino.path, baudRate: SERIAL_BAUD_RATE });

    // processa os dados recebidos do Arduino
    arduino.pipe(new serialport.ReadlineParser({ delimiter: '\r\n' })).on('data', async (data) => {
        const valores = data.split(';');
        let leituraVerdadeira = parseFloat(valores[0]);

        // Se nao for número nao continua se for dado sujo
        if (isNaN(leituraVerdadeira)) {
            return;
        }
        // Se passar do limite do silo fake atualiza pra ser o máximo dele
        let distanciaSoja = leituraVerdadeira;
        if (distanciaSoja > 15.0) {
            distanciaSoja = 15.0;
        }
        // Se ficar negativo atualiza pra ser 0. As vezes pode ficar negativo por conta da simulação
        if (distanciaSoja < 0) {
            distanciaSoja = 0;
        }

        // calcular quanto conteudo esta preenchendo o recipiente do prototipo em porcentagem tirando os 20% do cone
        let porcentagemPreenchida = (1.0 - (distanciaSoja / alturaSiloProt)) * 1.25;
        if (porcentagemPreenchida > 1.0) porcentagemPreenchida = 1.0;


        // o silo 1 vai usar o dado fiel do sensor
        let varSilo1Cheio = porcentagemPreenchida;
        // silo 2 vai ser um pouco mais cheio q a leitura verdadeira
        let varSilo2Cheio = porcentagemPreenchida + 0.02;
        if (varSilo2Cheio > 1) varSilo2Cheio = 1;
        // o 3 vai ser um pouco mais vazio
        let varSilo3Cheio = porcentagemPreenchida - 0.01;
        if (varSilo3Cheio < 0) varSilo3Cheio = 0;

        // vai guardar no banco o oposto. qntd que esta vazia distancia
        let distRealSilo1 = (1.0 - varSilo1Cheio) * alturaSiloRealM;
        let distRealSilo2 = (1.0 - varSilo2Cheio) * alturaSiloRealM;
        let distRealSilo3 = (1.0 - varSilo3Cheio) * alturaSiloRealM;

        valoresSensorUltrassonico.push(distRealSilo1);

        if (HABILITAR_OPERACAO_INSERIR) {
            // data atual pra ficar sempre junto as leituras sincronizadas
            const agora = new Date().toISOString().slice(0, 19).replace('T', ' ');

            try {
                // silo 1 com 3 sensores
                let sitSilo1 = pegarSituacaoAlerta(varSilo1Cheio * 100);
                let prioSilo1 = pegarPrioridadeAlerta(varSilo1Cheio * 100);
                let sensoresSilo1 = [1, 2, 3];

                for (let i = 0; i < sensoresSilo1.length; i++) {
                    let idSensor = sensoresSilo1[i];

                    const [res1] = await poolBancoDados.execute(
                        'INSERT INTO historico_sensor (distancia_captada, fk_sensor, dt_hora_leitura) VALUES (?, ?, ?)',
                        [distRealSilo1, idSensor, agora]
                    );
                    await poolBancoDados.execute(
                        'INSERT INTO alerta (prioridade, situacao, dt_registro, fk_historico_sensor) VALUES (?, ?, ?, ?)',
                        [prioSilo1, sitSilo1, agora, res1.insertId]
                    );
                }

                //silo 2 com 3 sensores agr
                let sitSilo2 = pegarSituacaoAlerta(varSilo2Cheio * 100);
                let prioSilo2 = pegarPrioridadeAlerta(varSilo2Cheio * 100);
                let sensoresSilo2 = [4, 5, 6];

                for (let i = 0; i < sensoresSilo2.length; i++) {
                    let idSensor = sensoresSilo2[i];

                    const [res2] = await poolBancoDados.execute(
                        'INSERT INTO historico_sensor (distancia_captada, fk_sensor, dt_hora_leitura) VALUES (?, ?, ?)',
                        [distRealSilo2, idSensor, agora]
                    );
                    await poolBancoDados.execute(
                        'INSERT INTO alerta (prioridade, situacao, dt_registro, fk_historico_sensor) VALUES (?, ?, ?, ?)',
                        [prioSilo2, sitSilo2, agora, res2.insertId]
                    );
                }

                //silo 3 com 3 sensores
                let sitSilo3 = pegarSituacaoAlerta(varSilo3Cheio * 100);
                let prioSilo3 = pegarPrioridadeAlerta(varSilo3Cheio * 100);
                let sensoresSilo3 = [7, 8, 9];

                for (let i = 0; i < sensoresSilo3.length; i++) {
                    let idSensor = sensoresSilo3[i];

                    const [res3] = await poolBancoDados.execute(
                        'INSERT INTO historico_sensor (distancia_captada, fk_sensor, dt_hora_leitura) VALUES (?, ?, ?)',
                        [distRealSilo3, idSensor, agora]
                    );
                    await poolBancoDados.execute(
                        'INSERT INTO alerta (prioridade, situacao, dt_registro, fk_historico_sensor) VALUES (?, ?, ?, ?)',
                        [prioSilo3, sitSilo3, agora, res3.insertId]
                    );
                }

                console.log(`Salvo em 9 sensores! S1: ${distRealSilo1.toFixed(2)}m (${sitSilo1}) | S2: ${distRealSilo2.toFixed(2)}m (${sitSilo2}) | S3: ${distRealSilo3.toFixed(2)}m (${sitSilo3})`);

            } catch (erro) {
                console.error("Erro ao inserir no banco: ", erro);
            }
        }
    });
}

const servidor = (valoresSensorUltrassonico) => {
    const app = express();

    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        next();
    });

    app.listen(SERVIDOR_PORTA, () => {
        console.log(`API executada com sucesso na porta ${SERVIDOR_PORTA}`);
    });

    app.get('/sensores/analogico', (_, response) => {
        return response.json(valoresSensorUltrassonico);
    });
}

(async () => {
    const valoresSensorUltrassonico = [];
    await serial(valoresSensorUltrassonico);
    servidor(valoresSensorUltrassonico);
})();