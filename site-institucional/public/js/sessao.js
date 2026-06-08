// Função que valida se o usuário tem acesso
function validarSessao() {
    var idUsuario = sessionStorage.ID_USUARIO;
    var nomeUsuario = sessionStorage.NOME_USUARIO;
    var idEmpresa = sessionStorage.ID_EMPRESA;

    // Se estiver tudo vazio então ele não está logado
    if (idUsuario == null || nomeUsuario == null || idEmpresa == null) {
        limparSessao();
    } 
}

// Função pro logout
function limparSessao() {
    // Limpa tudo do session storage e manda ele pra tela de login de novo
    sessionStorage.clear();
    window.location = "../login.html";
}