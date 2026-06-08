// importa as bibliotecas necessárias
const serialport = require('serialport');
const express = require('express');
const mysql = require('mysql2');

// constantes para configurações
const SERIAL_BAUD_RATE = 9600;
const SERVIDOR_PORTA = 3300;

// habilita ou desabilita a inserção de dados no banco de dados
const HABILITAR_OPERACAO_INSERIR = true;

// altura máxima do pote/silo da POC em cm
const ALTURA_SILO = 30;

// função para comunicação serial
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

    const portaArduino = portas.find(function (porta) {
        return porta.vendorId == '1A86' || porta.vendorId == '2341';
    });

    // Mostrar o erro no terminal
    if (!portaArduino) {
        console.log("Nenhum Arduino encontrado");
        console.log("Verifique se o cabo USB está bem conectado");
        return;
    }

    // Avisa qual porta está
    console.log(`Arduino foi detectado automaticamente na porta: ${portaArduino.path}`);

    // Configura usando a que achou
    const arduino = new serialport.SerialPort({
        path: portaArduino.path,
        baudRate: SERIAL_BAUD_RATE
    });

    // processa os dados recebidos do Arduino
    arduino.pipe(new serialport.ReadlineParser({ delimiter: '\r\n' })).on('data', async (data) => {
        const valores = data.split(';');
        
        // salva em cm
        const sensorUltrassonico = parseFloat(valores[0]);

        // ignora leitura se vier valor inválido
        if (isNaN(sensorUltrassonico)) {
            console.log("Leitura inválida, ignorando...");
            return;
        }

        valoresSensorUltrassonico.push(sensorUltrassonico);

        // insere os dados no banco de dados
        if (HABILITAR_OPERACAO_INSERIR) {

            const agora = new Date().toISOString().slice(0, 19).replace('T', ' ');

            // Silo 1 leitura certa
            let distanciaSilo1 = Math.min(Math.max(sensorUltrassonico, 0), ALTURA_SILO);
            
            // Silo 2 mais cheio
            let distanciaSilo2 = Math.min(Math.max(sensorUltrassonico - 5, 0), ALTURA_SILO);
            
            // Silo 3 mais vazio
            let distanciaSilo3 = Math.min(Math.max(sensorUltrassonico + 10, 0), ALTURA_SILO);

            // Insere no banco pro 1 sensor
            await poolBancoDados.execute(
                'INSERT INTO historico_sensor (distancia_captada, fk_sensor, dt_hora_leitura) VALUES (?, 1, ?)',
                [distanciaSilo1, agora]
            );

            await poolBancoDados.execute(
                'INSERT INTO historico_sensor (distancia_captada, fk_sensor, dt_hora_leitura) VALUES (?, 4, ?)',
                [distanciaSilo2, agora]
            );

            await poolBancoDados.execute(
                'INSERT INTO historico_sensor (distancia_captada, fk_sensor, dt_hora_leitura) VALUES (?, 7, ?)',
                [distanciaSilo3, agora]
            );

            console.log(`Inserido às ${agora} — Silo1: ${distanciaSilo1}cm | Silo2: ${distanciaSilo2}cm | Silo3: ${distanciaSilo3}cm`);
        }
    });

    arduino.on('error', (mensagem) => {
        console.error(`Erro no arduino (Mensagem: ${mensagem})`);
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