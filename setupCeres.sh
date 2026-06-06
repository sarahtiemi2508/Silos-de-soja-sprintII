#!/bin/bash

# ##### INICIALIZAÇÃO DO SCRIPT #####

# Podemos colocar um clear aqui pra quando for executado ficar tudo bonitinho

# Pro echo entender as barras invertidas pra formar o desenho, colocamos da linha entre aspas simples
# pra pintar os caracteres podemos utilizar a tag -e. Essa tag é usada pra tratar os caracteres como caracteres de escape. Como se fosse ativar algumas tags internas dentro do comando. No caso, vamos usar o \e seguido do código rgb pra cor. Sem a tag -e do echo a gente não conseguiria colocar o \e como uma tag pra sinalizar a cor logo em seguida.
# Pra entender a estrutura do comando para cores:
# \e[ -> inicia o codigo de cores
# m -> fecha a configuação de cores
# \e[0m -> limpa a cor que foi ligada e volta para o 0 (padrão do terminal)

# Linha 1: efeadb
echo -e "\e[38;2;239;234;219m"' $$$$$$\  $$$$$$$$\ $$$$$$$\  $$$$$$$$\  $$$$$$\  '
# Linha 2: f1e4c0
echo -e "\e[38;2;241;228;192m"'$$  __$$\ $$  _____|$$  __$$\ $$  _____|$$  __$$\ '
# Linha 3: f4dda0
echo -e "\e[38;2;244;221;160m"'$$ /  \__|$$ |      $$ |  $$ |$$ |      $$ /  \__|'
# Linha 4: f6d681
echo -e "\e[38;2;246;214;129m"'$$ |      $$$$$\    $$$$$$$  |$$$$$\    \$$$$$$\  '
# Linha 5: f8d064
echo -e "\e[38;2;248;208;100m"'$$ |      $$  __|   $$  __$$< $$  __|    \____$$\ '
# Linha 6: fac945
echo -e "\e[38;2;250;201;69m"'$$ |  $$\ $$ |      $$ |  $$ |$$ |      $$\   $$ |'
# Linha 7: fcc327
echo -e "\e[38;2;252;195;39m"'\$$$$$$  |$$$$$$$$\ $$ |  $$ |$$$$$$$$\ \$$$$$$  |'
# Linha 8: fcc327
echo -e "\e[38;2;252;195;39m"' \______/ \________|\__|  \__|\________| \______/ '


# Ligar a cor fcc327 para TODO o resto do script a partir daqui
echo -e "\e[38;2;252;195;39m"

# Informar o que o script faz
echo "Bem vindo(a) ao setup do projeto Ceres na sua máquina!"
echo "O setup será responsável por trazer o projeto para sua máquina Linux, criar o banco de dados e configurar a API"
echo "Após a execução do script, você poderá acessar sua dashboard por um navegador"

# ##### CRIAR VARIÁVEIS #####

# Como esse script só instancia o projeto Ceres, a url e nome do bd pode ser fixo
url="https://github.com/sarahtiemi2508/Silos-de-soja-sprintII.git"
nomeBD="ceres"
repo="Silos-de-soja-sprintII"

# ##### PEGAR DADOS DO USUÁRIO #####

# Pro usuário digitar e a gente conseguir guardar as informações numa variável usamos o comando read que vai esperar o usuário digitar alguma informação antes de continuar rodando o script
# O read possui duas tags legais. A -s  (silent) diz que o read vai ser discreto, ou seja, como uma senha onde não será exibida no terminal. E a tag -p para que ele escreva na mesma linha que a instrução

# Sintaxe pra pedir algo pro usuário digitar -> read -p pedidoentreaspas nomedavariavel

# Configurações do BD
read -sp "Digite a senha do usuário ROOT do MySql: " senhaRootBD
echo ""
read -p "Digite o nome de usuário que será usado no Banco de dados do projeto: " userBD
read -sp "Digite a senha de usuário para o usuário do projeto. OBS. A senha deve conter AO MENOS: 1 número, 1 letra maíuscula, 1 letra minúscula e 1 caractere especial: " senhaBD
echo ""


# ##### CONFIGURAÇÕES DE DIRETÓRIO #####

echo "Limpando antigas tentativas de instalações..."
# Apagar parametrização antiga se ele já tiver rodado o script antes
rm -rf "$repo"


# ##### DOWNLOADS #####

# Clonar o repositório
echo "Clonando o repositório..."
git clone "$url"

# Entrando na pasta
echo "Acessando o repositório criado..."
cd "$repo" || exit # O exit é como o break ou return em js. Ele vai tentar entrar na pasta do repo, se ele não conseguir ele vai parar a execução do script aqui.


# Acessar pasta do site com a API do web-data-viz
cd site-institucional || exit

# Escudo subshell
echo "Instalando dependências..."
(npm i --no-audit --no-fund) # Precisei criar um comando subshell que é bem parecido com as "promisses". Como se ele executasse esse comando em uma bifurcação e continuasse a execução do script só depois de terminar esse processo "isolado". As tags de no audit e no fund é pra remover a parte de auditoria (que gera o alert vermelho) e os pedidos de doações, se houver 

# Voltar a cor amarela
echo -e "\e[38;2;252;195;39m"

# ##### CONFIGURAR O AMBIENTE DE PRODUÇÃO #####

# Criar o env
echo "Criando o .env..."
cat << EOF > .env
AMBIENTE_PROCESSO=producao
DB_HOST=localhost
DB_DATABASE='$nomeBD'
DB_USER='$userBD'
DB_PASSWORD='$senhaBD'
DB_PORT=3306
APP_PORT=8080
APP_HOST=localhost
EOF

# Criar o app.js no ambiente certo
rm -f app.js
echo "Criando o app.js em produção..."
cat << "EOF" > app.js
var ambiente_processo = 'producao';
//var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var indexRouter = require("./src/routes/home");
var usuarioRouter = require("./src/routes/usuarios");
var alertasRouter = require("./src/routes/alertas");
var medidasRouter = require("./src/routes/medidas");
var empresasRouter = require("./src/routes/empresas");
var fazendaRouter = require("./src/routes/fazenda");
var addUserRouter = require("./src/routes/addUser");

// Rotas da bateria da Sarah
// var dashBateriaRouter = require("./src/routes/dashBateria");
// var configBateriaRouter = require("./src/routes/configBateria");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/alertas", alertasRouter);
app.use("/medidas", medidasRouter);
app.use("/empresas", empresasRouter);
app.use("/fazenda", fazendaRouter);
app.use("/usuario", addUserRouter);

// Rotas da bateria da Sarah
// app.use("/dashBateria", dashBateriaRouter);
// app.use("/configBateria", configBateriaRouter)

app.listen(PORTA_APP, function () {
    // No js usamos o \x1b no lugar do \e do sh
    var corDourada = "\x1b[38;2;252;195;39m";
    var reset = "\x1b[0m"; // Pras últimas instruções terem destaque

    console.log(`
${corDourada}
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
${reset}
    Ceres já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :.

    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:.

    \tSe .:desenvolvimento:. você está se conectando ao banco local.
    \tSe .:producao:. você está se conectando ao banco remoto.

    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'
    `);
});
EOF

# ##### CRIAÇÃO DO BD ####

echo "Criando o usuário no banco de dados..."

# Usar o root pra criar o usuario pro projeto
mysql -u root -p"$senhaRootBD" -e "CREATE USER IF NOT EXISTS '$userBD'@'localhost' IDENTIFIED BY '$senhaBD';"
mysql -u root -p"$senhaRootBD" -e "GRANT ALL PRIVILEGES ON $nomeBD.* TO '$userBD'@'localhost';"
mysql -u root -p"$senhaRootBD" -e "FLUSH PRIVILEGES;"

# Entrar no mysql com o usuario criado agora
echo "Criando tabelas do BD..."
mysql -u "$userBD" -p"$senhaBD" < src/database/script-tabelas.sql

# ##### INICIAR O SERVIDOR #####

# Juntar tudo
echo -e "\e[38;2;252;195;39m"
echo "Iniciando servidor..."
npm start

# Desligar a cor amarela
echo -e "\e[0m"