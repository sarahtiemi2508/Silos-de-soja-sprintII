// Teste para encher o silo em 60%
document.addEventListener("DOMContentLoaded", function() {
    const barra = document.getElementById('silo-preenchimento');
    if (barra) {
        barra.style.height = "50%";
    }
});

// Pega tds botoes de silo
const botoes = document.querySelectorAll('.btn-silo');

botoes.forEach(botao => {
    botao.addEventListener('click', () => {
        // Limpa o ativo de tudo
        botoes.forEach(btn => btn.classList.remove('active'));
        
        // Ativa só o clicado
        botao.classList.add('active');
        
        // Para Marcelly do futuro:  
        // depois vamos buscar os dados do grupo de sensores do silo específico

        console.log("Trocou pro silo: " + botao.innerText);
    });
});


function atualizarPorcentagemSilo (){
    let alturaSilo = 400; // 400cm ou 4m
    let leituraSensor = 100; // O sensor fala q esta 100cm de distância, ou seja, o silo esta preenchido em 300cm

    // A soja ta ocupando 300cm (3m)
    let porcentagem = ((alturaSilo - leituraSensor) / alturaSilo) * 100; 

    atualizarSilo(porcentagem); 
}