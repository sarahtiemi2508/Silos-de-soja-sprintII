// importa os bibliotecas necessários
const serialport = require('serialport');
const express = require('express');
const mysql = require('mysql2');

// constantes para configurações
const SERIAL_BAUD_RATE = 9600;
const SERVIDOR_PORTA = 3300;

// habilita ou desabilita a inserção de dados no banco de dados
const HABILITAR_OPERACAO_INSERIR = true;

// função para comunicação serial
const serial = async (
    valoresSensorUltrassonico,
) => {

    // conexão com o banco de dados MySQL
    let poolBancoDados = mysql.createPool(
        {
            host: 'localhost',
            user: 'insert_user',
            password: 'Urubu@100',
            database: 'ceres',
            port: 3307
        }
    ).promise();

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
        console.log(data);
        const valores = data.split(';');
        const sensorUltrassonico = parseFloat(valores[0]);

        // armazena os valores dos sensores nos arrays correspondentes
        valoresSensorUltrassonico.push(sensorUltrassonico);

        // insere os dados no banco de dados (se habilitado)
        if (HABILITAR_OPERACAO_INSERIR) {

            // este insert irá inserir os dados na tabela "medida"
            await poolBancoDados.execute(
                'INSERT INTO historico_sensor (distancia_captada, fk_sensor) VALUES (?, 2)',
                [sensorUltrassonico]
            );
            console.log("Sensor centro inserido no banco: ", sensorUltrassonico);

            let simular_distancia = sensorUltrassonico - 8;
            await poolBancoDados.execute(
                'INSERT INTO historico_sensor (distancia_captada, fk_sensor) VALUES (?, 1)',
                [simular_distancia]
            );
            console.log("Sensor esquerda inserido no banco: ", simular_distancia);

            let simular_distancia2 = sensorUltrassonico - 8;
            await poolBancoDados.execute(
                'INSERT INTO historico_sensor (distancia_captada, fk_sensor) VALUES (?, 3)',
                [simular_distancia2]
            );
            console.log("Sensor direita inserido no banco: ", simular_distancia2);

        }

    });

    // evento para lidar com erros na comunicação serial
    arduino.on('error', (mensagem) => {
        console.error(`Erro no arduino (Mensagem: ${mensagem}`)
    });
}

// função para criar e configurar o servidor web
const servidor = (
    valoresSensorUltrassonico
) => {
    const app = express();

    // configurações de requisição e resposta
    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        next();
    });

    // inicia o servidor na porta especificada
    app.listen(SERVIDOR_PORTA, () => {
        console.log(`API executada com sucesso na porta ${SERVIDOR_PORTA}`);
    });

    // define os endpoints da API para cada tipo de sensor
    app.get('/sensores/analogico', (_, response) => {
        return response.json(valoresSensorUltrassonico);
    });
}

// função principal assíncrona para iniciar a comunicação serial e o servidor web
(async () => {
    // arrays para armazenar os valores dos sensores
    const valoresSensorUltrassonico = [];

    // inicia a comunicação serial
    await serial(
        valoresSensorUltrassonico
    );

    // inicia o servidor web
    servidor(
        valoresSensorUltrassonico
    );
})();