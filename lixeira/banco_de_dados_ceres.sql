CREATE DATABASE ceres;
USE ceres;

CREATE TABLE empresa (
id_empresa INT PRIMARY KEY AUTO_INCREMENT,
nome_fantasia VARCHAR(100) NOT NULL,
cnpj_empresa CHAR(14) UNIQUE NOT NULL,
razao_social VARCHAR(100) NOT NULL,
dt_cadastro_empresa DATE NOT NULL
);

CREATE TABLE endereco (
id_endereco INT PRIMARY KEY AUTO_INCREMENT,
cep VARCHAR(9) NOT NULL,
logradouro_fazenda VARCHAR(100) NOT NULL,
num_logadouro VARCHAR(20) NOT NULL,
cidade_fazenda VARCHAR(45) NOT NULL,
uf_fazenda CHAR(2) NOT NULL
);

CREATE TABLE funcionario_fazenda (
id_funcionario_fazenda INT PRIMARY KEY AUTO_INCREMENT,
nome_funcionario VARCHAR(100) NOT NULL,
cpf CHAR(11) NOT NULL UNIQUE,
dt_nascimento DATE,
senha VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
telefone VARCHAR(15)
);

CREATE TABLE funcionario_empresa (
id_funcionario_empresa INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(100) NOT NULL,
cpf CHAR(11) UNIQUE NOT NULL,
dt_nascimento DATE,
senha VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
telefone VARCHAR(15),
fk_empresa INT,
CONSTRAINT ctfkEmpresa
FOREIGN KEY funcionario_empresa (fk_empresa) REFERENCES empresa (id_empresa)
);

CREATE TABLE fazenda (
id_fazenda INT PRIMARY KEY AUTO_INCREMENT,
nome_fazenda VARCHAR(100) NOT NULL,
fk_endereco INT,
FOREIGN KEY (fk_endereco) REFERENCES endereco (id_endereco),
fk_funcionario_fazenda INT,
FOREIGN KEY (fk_funcionario_fazenda) REFERENCES funcionario_fazenda (id_funcionario_fazenda),
fk_empresa INT,
FOREIGN KEY (fk_empresa) REFERENCES empresa (id_empresa)
);

CREATE TABLE bateria_silo (
id_bateria_silo INT PRIMARY KEY AUTO_INCREMENT,
bateria_grupo VARCHAR(45) NOT NULL,
fk_fazenda INT,
CONSTRAINT ctfkFazenda
FOREIGN KEY bateria_silo (fk_fazenda) REFERENCES fazenda (id_fazenda)
);

CREATE TABLE silo_individual (
id_silo_individual INT PRIMARY KEY AUTO_INCREMENT,
codigo_silo VARCHAR(45) UNIQUE NOT NULL,
altura_silo DECIMAL(6,2) NOT NULL,
diametro_silo DECIMAL(6,2) NOT NULL,
capacidade_maxima DECIMAL(10,2) NOT NULL,
stts_condicao_silo VARCHAR(45),
nivel_atual_silo DECIMAL(6,2) NOT NULL,
fk_bateria_silo INT,
CONSTRAINT ctfkBateria_silo
FOREIGN KEY silo_individual (fk_bateria_silo) REFERENCES bateria_silo (id_bateria_silo)
);

CREATE TABLE sensor (
id_sensor INT PRIMARY KEY AUTO_INCREMENT,
codigo_sensor VARCHAR(45) UNIQUE NOT NULL,
posicao_sensor VARCHAR(45),
dt_instalacao DATE,
stts_condicao_silo VARCHAR(45),
fk_silo_individual INT,
CONSTRAINT ctfkSilo_individual
FOREIGN KEY sensor (fk_silo_individual) REFERENCES silo_individual (id_silo_individual)
);

CREATE TABLE historico_sensor (
id_historico_sensor INT PRIMARY KEY AUTO_INCREMENT,
distancia_leitura_esquerda DECIMAL(10,2),
distancia_leitura_centro DECIMAL(10,2),
distancia_leitura_direita DECIMAL(10,2),
dt_hora_leitura DATETIME NOT NULL,
fk_sensor INT,
CONSTRAINT ctfkSensor
FOREIGN KEY historico_sensor (fk_sensor) REFERENCES sensor (id_sensor)
);

CREATE TABLE alerta (
id_alerta INT PRIMARY KEY AUTO_INCREMENT,
tipo_alerta VARCHAR(80),
mensagem VARCHAR(150),
fk_historico_sensor INT,
CONSTRAINT ctfkHistorico_sensor
FOREIGN KEY alerta (fk_historico_sensor) REFERENCES historico_sensor (id_historico_sensor)
);