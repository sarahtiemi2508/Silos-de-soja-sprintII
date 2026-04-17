// Configs do pote
const ALTURA_MAXIMA_POTE_CM = 30; // Altura do pote em cm
const ENDPOINT_DISTANCIA = 'http://localhost:3300/sensores/analogico'; // Endpoint que a API envia os dados

let paginacao = 0; // Pra controlar qual o último dado 
let tempo = 0; // pra controlar o eixo x de tempo
let tempoInicioAlerta = null; // Guarda a hora q o alerta começou e null pq não tem alerta

// Configs do chart js
const contextoGrafico = document.getElementById('graficoSilo').getContext('2d');
const graficoLinha = new Chart(contextoGrafico, {
    type: 'line',
    data: {
        labels: [], // Vetor vazio pro eixo x de tempo
        datasets: [{
            label: 'Nível de preenchimento do silo em cm',
            borderColor: '#FFBA00',
            backgroundColor: 'rgba(255, 186, 0, 0.2)',
            borderWidth: 3,
            fill: true,
            data: [] // Vetor vazio pras leituras 
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true, max: ALTURA_MAXIMA_POTE_CM }
        }
    }
});

// Função pra atualizar as KPIs de acordo com os dados pegos da API
function obterDadosDaAPI() {
    // O fetch que vai até o endpoint
    fetch(ENDPOINT_DISTANCIA)
        .then(function (resposta) {
            // Faz a resposta virar um array que o js entende
            return resposta.json();
        })
        .then(function (vetorValores) {
            // Se não tiver nada no array ele nem executa o resto e para
            if (vetorValores.length === 0) {
                return;
            }

            // Pega só a última posição do vetor pra atualizar as KPIs
            let ultimoIndice = vetorValores.length - 1;
            let ultimaLeitura = parseFloat(vetorValores[ultimoIndice]);

            // Chama a função que atualiza o painel usando a última leitura como parametro
            atualizarPainelSilo(ultimaLeitura);

            // Lógica do gráfico
            // Percorre o vetor A PARTIR do que parou na última vez
            for (let i = paginacao; i < vetorValores.length; i++) {

                let distanciaLida = parseFloat(vetorValores[i]);

                // Pra não bugar com a letura errada
                if (distanciaLida < 0) {
                    distanciaLida = 0;
                }
                if (distanciaLida > ALTURA_MAXIMA_POTE_CM) {
                    distanciaLida = ALTURA_MAXIMA_POTE_CM;
                }

                // Pra definir quanto ele está cheio
                let nivelPreenchido = ALTURA_MAXIMA_POTE_CM - distanciaLida;

                // Se o gráfico já tem 10 pontos na tela, tira o mais antigo
                if (graficoLinha.data.labels.length >= 10) {
                    graficoLinha.data.labels.shift(); // tira do eixo x
                    graficoLinha.data.datasets[0].data.shift(); // tira do eixo y
                }

                // pusha diciona o NOVO VALOR CALCULADO no final dos vetores do gráfico
                graficoLinha.data.labels.push(tempo);
                graficoLinha.data.datasets[0].data.push(nivelPreenchido);

                tempo++; // Aumenta o tempo pro próximo ponto no grafico
            }

            // Atualiza a paginação pra não repetir os mesmos dados na próxima vez
            paginacao = vetorValores.length;

            // Pro gráfico se redesenhar
            graficoLinha.update();
        })
        .catch(error => console.error('Erro ao obter dados:', error));

}
// Faz um loop infinito pra ficar chamando a função a cada 1 seg
setInterval(obterDadosDaAPI, 1000);

// Lógica pra atulizar as KPIs
function atualizarPainelSilo(distanciaSensor) {
    // Pra não continuar dando erro
    if (distanciaSensor < 0) {
        distanciaSensor = 0;
    }
    if (distanciaSensor > ALTURA_MAXIMA_POTE_CM) {
        distanciaSensor = ALTURA_MAXIMA_POTE_CM;
    }

    // Regra de 3 para descobrir a porcentagem que tá livre
    let porcentagemLivre = (distanciaSensor / ALTURA_MAXIMA_POTE_CM) * 100;
    let porcentagemCheia = 100 - porcentagemLivre;

    // Muda a altura da barra do silo
    const barraSilo = document.getElementById('silo-preenchimento');
    barraSilo.style.height = `${porcentagemCheia}%`;

    // Atualiza os textos de número
    document.querySelector('.kpi-live h3').innerHTML = `${distanciaSensor.toFixed(1)} cm`;
    document.querySelector('.kpi-live h4').innerHTML = `${Math.round(porcentagemLivre)}% livre`;

    // Pega os elementos de texto pra poder mudar dps
    const statusTitulo = document.querySelector('.kpi-status h3');
    const statusSub = document.querySelector('.kpi-status h4');
    const tempoAlertaHtml = document.querySelector('.kpi-tempo-alerta h3');

    // Muda os textos de acordo com o if e else que entrar
    if (porcentagemLivre >= 30 && porcentagemLivre <= 70) {
        // IDEAL
        statusTitulo.innerHTML = "IDEAL";
        statusTitulo.style.color = "green";
        statusSub.innerHTML = "Estoque equilibrado";
        barraSilo.style.backgroundColor = "green";

        tempoInicioAlerta = null; // Zera a variável do tempo pq não ta em alerta
        tempoAlertaHtml.innerHTML = "0D 0h 0m";

    } else {
        // NÃO IDEAL e inicia o cronômetro se ele ainda tiver nulo
        if (tempoInicioAlerta == null) {
            tempoInicioAlerta = new Date(); // Salva a data e hora atual que começou o alerta seja qual for
        }
        atualizarCronometro(tempoAlertaHtml);

        if (porcentagemLivre < 15 || porcentagemLivre > 85) {
            // ESTADO CRÍTICO
            statusTitulo.innerHTML = "CRÍTICO";
            statusTitulo.style.color = "red";
            barraSilo.style.backgroundColor = "red";

            statusSub.innerHTML = porcentagemLivre < 15 ? "Risco de transbordo" : "Silo quase vazio";

        } else {
            // ESTADO DE ATENÇÃO (Quase chegando no extremo)
            statusTitulo.innerHTML = "ATENÇÃO";
            statusTitulo.style.color = "#FFBA00";
            statusSub.innerHTML = "Controle de situação";
            barraSilo.style.backgroundColor = "#FFBA00";
        }
    }

    // Muda o horário da última leitura
    let horaAtual = new Date();
    document.querySelector('.kpi-ultima-leitura h3').innerHTML = "Agora";
    document.querySelector('.kpi-ultima-leitura p').innerHTML = horaAtual.toLocaleTimeString('pt-BR');
}

// Lógica de cronômetro
function atualizarCronometro(elementoHtml) {
    if (tempoInicioAlerta == null) {
        return; // Se não tem alerta nem precisa continuar contando
    }

    let momentoAtual = new Date();
    let diferencaTempo = momentoAtual - tempoInicioAlerta; // Resultado da diferença em milissegundos

    // Pra achar os minutos e os segundos
    let minutos = Math.floor(diferencaTempo / 60000);
    let segundos = Math.floor((diferencaTempo % 60000) / 1000);

    elementoHtml.innerHTML = `0D 0h ${minutos}m ${segundos}s`;
}

// Lógica dos botões
const botoes = document.querySelectorAll('.btn-silo'); // Seleciona e faz um "vetor" com todos os botões de silo

// Passa por todos os botoes
for (let i = 0; i < botoes.length; i++) {

    // Adiciona o evento de "clique" em cada botão q passar
    botoes[i].addEventListener('click', function () {

        // Quando clica tira o ativo de todos
        for (let j = 0; j < botoes.length; j++) {
            botoes[j].className = 'btn-silo';
        }

        // Depois coloca ativo só nó que teve ação de clique
        botoes[i].className = 'btn-silo active';
    });
}