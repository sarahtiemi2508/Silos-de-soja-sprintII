CREATE DATABASE ceres;
USE ceres;

CREATE TABLE empresa (
id_empresa INT PRIMARY KEY AUTO_INCREMENT,
nome_fantasia VARCHAR(100),
cnpj_empresa CHAR(14) UNIQUE NOT NULL,
razao_social VARCHAR(100) NOT NULL,
dt_cadastro_empresa DATE NOT NULL DEFAULT (CURRENT_DATE)
);

CREATE TABLE endereco (
id_endereco INT PRIMARY KEY AUTO_INCREMENT,
cep VARCHAR(9) NOT NULL,
logradouro_fazenda VARCHAR(100) NOT NULL,
num_logradouro VARCHAR(20) NOT NULL,
cidade_fazenda VARCHAR(45) NOT NULL,
uf_fazenda CHAR(2) NOT NULL
);

CREATE TABLE usuario (
id_usuario INT PRIMARY KEY AUTO_INCREMENT,
nome_usuario VARCHAR(100) NOT NULL,
cpf CHAR(11) UNIQUE NOT NULL,
dt_nascimento DATE,
senha VARCHAR(255) NOT NULL,
email VARCHAR(200) UNIQUE NOT NULL,
telefone VARCHAR(15),

fk_empresa INT,
CONSTRAINT ctfk_empresa
FOREIGN KEY (fk_empresa)
REFERENCES empresa (id_empresa)
);

CREATE TABLE fazenda (
id_fazenda INT PRIMARY KEY AUTO_INCREMENT,
nome_fazenda VARCHAR(100) NOT NULL,

fk_endereco INT,
FOREIGN KEY (fk_endereco)
REFERENCES endereco (id_endereco),

fk_empresa INT,
FOREIGN KEY (fk_empresa)
REFERENCES empresa (id_empresa)
);

CREATE TABLE permissao (
id_permissao INT PRIMARY KEY AUTO_INCREMENT,

fk_usuario INT,
CONSTRAINT ctfk_usuario_permissao
FOREIGN KEY(fk_usuario)
REFERENCES usuario (id_usuario),

fk_fazenda INT,
CONSTRAINT ctfk_fazenda_permissao
FOREIGN KEY (fk_fazenda)
REFERENCES fazenda (id_fazenda)
);

CREATE TABLE bateria_silo (
id_bateria_silo INT PRIMARY KEY AUTO_INCREMENT,
bateria_grupo VARCHAR(45) NOT NULL,

fk_fazenda INT,
CONSTRAINT ctfkFazenda
FOREIGN KEY bateria_silo (fk_fazenda)
REFERENCES fazenda (id_fazenda)
);

CREATE TABLE silo_individual (
id_silo_individual INT PRIMARY KEY AUTO_INCREMENT,
modelo_silo VARCHAR(20) UNIQUE NOT NULL,
gatilho_vmax_moderado FLOAT,
gatilho_vmin_moderado FLOAT,
gatilho_vmax_critico FLOAT,
gatilho_vmin_critico FLOAT,
altura_silo DECIMAL(6,2) NOT NULL,
diametro_silo DECIMAL(6,2) NOT NULL,
capacidade_maxima DECIMAL(10,2),
stts_condicao_silo TINYINT,
-- 0 == 'inativo' || 1 == 'ativo'

fk_bateria_silo INT,
CONSTRAINT ctfkBateria_silo
FOREIGN KEY silo_individual (fk_bateria_silo) 
REFERENCES bateria_silo (id_bateria_silo)
);

CREATE TABLE gp_sensores (
id_gp_sensores INT PRIMARY KEY AUTO_INCREMENT,
modelo_sensores VARCHAR (20) NOT NULL,
dt_instalacao DATE NOT NULL DEFAULT (CURRENT_DATE),

fk_silo INT,
CONSTRAINT ctfk_bateria_silo
FOREIGN KEY (fk_silo)
REFERENCES silo_individual (id_silo_individual)
);

CREATE TABLE sensor (
id_sensor INT PRIMARY KEY AUTO_INCREMENT,
localizacao VARCHAR(45) NOT NULL,
stts_sensor TINYINT,
-- 0 == 'inativo' || 1 == 'ativo'

fk_gp_sensores INT,
CONSTRAINT ctfk_gp_sensores
FOREIGN KEY (fk_gp_sensores)
REFERENCES gp_sensores (id_gp_sensores)
);

CREATE TABLE historico_sensor (
id_historico_sensor INT PRIMARY KEY AUTO_INCREMENT,
distancia_captada INT,
dt_hora_leitura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

fk_sensor INT,
CONSTRAINT ctfk_sensor
FOREIGN KEY (fk_sensor) 
REFERENCES sensor (id_sensor)
);

CREATE TABLE alerta (
id_alerta INT PRIMARY KEY AUTO_INCREMENT,
prioridade INT NOT NULL,
dt_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

situacao VARCHAR(45) NOT NULL,
CONSTRAINT ct_situacao_alerta
CHECK (situacao IN ('normal', 'crítico', 'urgente', 'moderado')),

fk_historico_sensor INT,
CONSTRAINT ctfkHistorico_sensor
FOREIGN KEY alerta (fk_historico_sensor) REFERENCES historico_sensor (id_historico_sensor)
);

CREATE TABLE confirmacao_leitura (
id_confirmacao_leitura INT PRIMARY KEY AUTO_INCREMENT,
confirmacao TINYINT NOT NULL DEFAULT 0,
dt_confirmacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

fk_alerta INT UNIQUE,
CONSTRAINT ctfk_alerta_confirmacao
FOREIGN KEY (fk_alerta)
REFERENCES alerta(id_alerta),

fk_usuario INT,
CONSTRAINT ctfj_alerta_usuario
FOREIGN KEY (fk_usuario)
REFERENCES usuario(id_usuario)
);


-- INSERTS -------------------------------------------------------------------------------

INSERT INTO empresa (nome_fantasia, cnpj_empresa, razao_social) VALUES
('Scheffer', '34086808000155', 'Armazenamento Agro LTDA'), -- fk empresa 1
('Sementec', '53314648000107', 'Zen Armazenamentos SA'), -- fk empresa 2
('ContSoja', '18749209000118', 'Container Soja LTDA'); -- fk empresa 3


INSERT INTO endereco (cep, logradouro_fazenda, num_logradouro, cidade_fazenda, uf_fazenda) VALUES
-- Endereço das fazendas da empresa Scheffer fk empresa 1
('78048-250', 'Av. Dr. Hélio Ribeiro', '525', 'Cuiabá', 'MT'),
('78366012', 'Rua das Carpas', '1923', 'Sapezal', 'MT'),

-- Endereço das fazendas da empresa Sementec fk empresa 2
('75640-000', 'Avenida Antônio Accioly', '07', ' Piracanjuba', 'GO'),
('75800-014', 'Rua Dr. Roberto Assis Carvalho', '45', 'Jataí', 'GO'),

-- Endereço da fazenda da empresa ContSoja fk empresa 3
('47820-000', 'Sítio Grande', '790', 'São Desidério', 'BH');


INSERT INTO usuario (nome_usuario, cpf, dt_nascimento, senha, email, telefone, fk_empresa) VALUES
-- 3 Usuários da empresa Scheffer fk empresa 1
('Patrício Scheffer', '79620121023', '1978-01-02', 'Scheffer@123', 'scheffer.patricio@email.com', '(12) 2561-0474', 1),
('Jonas Augusto', '62066691062', '1990-12-25', 'Jonas@123', 'augusto.jonas@email.com', '(19) 3901-6368', 1),
('Mariana Franco', '60333608003', '1992-10-02', 'Mariana@123', 'franco.mariana@email.com', '(11) 2483-3297', 1),

-- 4 Usuários da empresa Sementec fk empresa 2
('Erick Castro', '39479392488', '2001-07-09', 'Erick@123', 'erick.castro@email.com', '(11) 2828-2751', 2),
('Giovanna Correia', '23283203687', '1964-03-30', 'Giovanna@123', 'giovanna.correia@email.com', '(11) 6403-8465', 2),
('Anna Santos', '21171683707', '1992-10-23', 'Anna@123', 'anna.santos@email.com', '(11) 6523-8331', 2),
('Daniel Cardoso', '84056133130', '1984-12-25', 'Daniel@123', 'daniel.cardoso@email.com', '(11) 7172-3488', 2),

-- 5 Usuários da empresa ContSoja fk empresa 3
('Tomás Azevedo', '99985232143', '2002-02-07', 'Tomas@123', 'tomas.azevedo@email.com', '(11) 8064-7075', 3),
('Guilherme Ribeiro', '70772010820', '1977-11-09', 'Guilherme@123', 'guilherme.ribeiro@email.com', '(11) 4489-7507', 3),
('Sarah Lima', '90576221490', '1988-03-28', 'Sarah@123', 'sarah.lima@email.com', '(41) 5308-6787', 3),
('Brenda Melo', '81535689579', '1992-10-28', 'Brenda@123', 'brenda.melo@email.com', '(11) 5213-2368', 3),
('Emily Correia', '65261626650', '2005-03-31', 'Emily@123', 'emily.correia@email.com', '(18) 2960-5857', 3);


INSERT INTO fazenda (nome_fazenda, fk_endereco, fk_empresa) VALUES
-- Fazenda dos endereços 1 e 2, empresa Scheffer
('Grão Dourado Armazéns', 1, 1),
('Silos da Soja Segura', 2, 1),

-- Fazenda dos endereços 3 e 4, empresa Sementec
('Foco Soja Armazéns', 3, 2),
('Armazém Soja Forte', 4, 2),

-- Fazenda do endereço 5, empresa ContSoja
('Silo Soja Prime', 5, 3);


INSERT INTO permissao (fk_usuario, fk_fazenda) VALUES
-- Permissoes usuários da empresa Scheffer
(1, 1), -- Patrício tem permissão da fazenda 1
(1, 2), -- Patrício tem permissão da fazenda 2
(2, 1), -- Jonas tem permissão da fazenda 1
(2, 2), -- Jonas tem permissão da fazenda 2
(3, 1), -- Mariana tem permissão da fazenda 1

-- Permissoes usuários da empresa Sementec
(4, 4), -- Erick tem permissão da fazenda 4
(4, 3), -- Erick tem permissão da fazenda 3
(5, 4), -- Giovanna tem permissão da fazenda 4
(6, 3), -- Anna tem permissão da fazenda 3
(7, 4), -- Daniel tem permissão da fazenda 4

-- Permissoes usuários da empresa ContSoja
(8, 5), -- Tomás tem permissão da fazenda 5
(9, 5), -- Guilherme tem permissão da fazenda 5
(10, 5), -- Sarah tem permissão da fazenda 5
(11, 5), -- Brenda tem permissão da fazenda 5
(12, 5); -- Emily tem permissão da fazenda 5


INSERT INTO  bateria_silo (bateria_grupo, fk_fazenda) VALUES
-- Grupos de silo da Fazenda 1 (Scheffer)
('Bateria A 01', 1), -- Grão Dourado Armazéns

-- Grupos de silo da Fazenda 2 (Scheffer)
('BTR 1 10', 2), -- Silos da Soja Segura
('BTR 2 20', 2), -- Silos da Soja Segura

-- Grupos de silo da Fazenda 3 (Sementec)
('101 - Bateria', 3), -- Foco Soja Armazéns
('102 - Bateria', 3), -- Foco Soja Armazéns

-- Grupos de silo da Fazenda 4 (Sementec)
('1000 01', 4), -- Armazém Soja Forte
('1000 02', 4), -- Armazém Soja Forte
('1000 03', 4), -- Armazém Soja Forte

-- Grupos de silo da Fazenda 5 (ContSoja)
('A45 - BTR', 5), -- Silo Soja Prime
('B45 - BTR', 5); -- Silo Soja Prime


INSERT INTO silo_individual (modelo_silo, altura_silo, diametro_silo, stts_condicao_silo, fk_bateria_silo) VALUES
-- Silos da Bateria 1 Scheffer
('01', 20.00, 5.00, 1, 1),
('02', 20.00, 5.00, 1, 1),
('03', 20.00, 5.00, 1, 1),

-- Silos da Bateria 2 Scheffer
('001', 30.00, 8.00, 1, 2),
('002', 30.00, 8.00, 1, 2),
('003', 30.00, 8.00, 1, 2),

-- Silos da Bateria 3 Scheffer
('100', 10.00, 3.00, 0, 3),
('200', 10.00, 3.00, 0, 3),
('300', 10.00, 3.00, 0, 3),


-- Silos da Bateria 1 Sementec
('A1', 15.00, 6.00, 0, 4),
('A2', 15.00, 6.00, 0, 4),
('A3', 15.00, 6.00, 0, 4),

-- Silos da Bateria 2 Sementec
('B1', 25.00, 9.00, 1, 5),
('B2', 25.00, 9.00, 1, 5),
('B3', 25.00, 9.00, 0, 5),

-- Silos da Bateria 3 Sementec
('C1', 12.00, 3.00, 1, 6),
('C2', 12.00, 3.00, 1, 6),
('C3', 12.00, 3.00, 1, 6),

-- Silos da Bateria 4 Sementec
('D1', 32.00, 5.00, 1, 7),
('D2', 32.00, 5.00, 1, 7),
('D3', 32.00, 5.00, 1, 7),

-- Silos da Bateria 5 Sementec
('E1', 10.00, 3.00, 0, 8),
('E2', 10.00, 3.00, 0, 8),
('E3', 10.00, 3.00, 0, 8),


-- Silos da Bateria 1 ContSoja
('A-01', 32.00, 8.00, 0, 9),
('A-02', 32.00, 8.00, 0, 9),
('A-03', 32.00, 8.00, 1, 9),

-- Silos da Bateria 2 ContSoja
('A1-1000', 24.00, 3.00, 1, 10),
('A2-1000', 24.00, 3.00, 1, 10),
('A3-1000', 24.00, 3.00, 1, 10);

INSERT INTO gp_sensores (modelo_sensores, fk_silo) VALUES
-- Grupo sensores do silo 1 Scheffer
('0001', 1),
('0002', 2),
('003', 3),

-- Grupo sensores do silo 2 Scheffer
('1001', 4),
('1002', 5),
('1003', 6),

-- Grupo sensores do silo 3 Scheffer
('2001', 7),
('2002', 8),
('2003', 9),

-- Grupo sensores do silo 1 Sementec
('01', 10),
('02', 11),
('03', 12),

-- Grupo sensores do silo 2 Sementec
('10', 13),
('20', 14),
('30', 15),

-- Grupo sensores do silo 3 Sementec
('11', 16),
('12', 17),
('13', 18),

-- Grupo sensores do silo 4 Sementec
('20010', 19),
('20020', 20),
('20030', 21),

-- Grupo sensores do silo 5 Sementec
('1020001', 22),
('1020002', 23),
('1020003', 24),

-- Grupo sensores do silo 1 ContSoja
('123001', 25),
('123002', 26),
('123003', 27),

-- Grupo sensores do silo 2 ContSoja
('501002', 28),
('501002', 29),
('501003', 30);


INSERT INTO sensor (localizacao, stts_sensor, fk_gp_sensores) VALUES
-- Sensores do gp sensores do silo 1 Scheffer
('Esquerda', 1, 1), ('Centro', 1, 1), ('Direita', 1, 1), -- Sensores GP1
('Esquerda', 1, 2), ('Centro', 1, 2), ('Direita', 1, 2), -- Sensores GP2
('Esquerda', 1, 3), ('Centro', 1, 3), ('Direita', 1, 3), -- Sensores GP3

-- Sensores do gp sensores do silo 2 Scheffer
('Esquerda', 1, 4), ('Centro', 1, 4), ('Direita', 1, 4), -- Sensores GP4
('Esquerda', 1, 5), ('Centro', 1, 5), ('Direita', 1, 5), -- Sensores GP5
('Esquerda', 1, 6), ('Centro', 1, 6), ('Direita', 1, 6), -- Sensores GP6

-- Sensores do gp sensores do silo 3 Scheffer
('Esquerda', 1, 7), ('Centro', 1, 7), ('Direita', 1, 7), -- Sensores GP7
('Esquerda', 1, 8), ('Centro', 1, 8), ('Direita', 1, 8), -- Sensores GP8
('Esquerda', 1, 9), ('Centro', 1, 9), ('Direita', 1, 9), -- Sensores GP9

-- Sensores do gp sensores do silo 1 Sementec
('Esquerda', 1, 10), ('Centro', 1, 10), ('Direita', 1, 10), -- Sensores GP10
('Esquerda', 1, 11), ('Centro', 1, 11), ('Direita', 1, 11), -- Sensores GP11
('Esquerda', 1, 12), ('Centro', 1, 12), ('Direita', 1, 12), -- Sensores GP12

-- Sensores do gp sensores do silo 2 Sementec
('Esquerda', 1, 13), ('Centro', 1, 13), ('Direita', 1, 13), -- Sensores GP13
('Esquerda', 1, 14), ('Centro', 1, 14), ('Direita', 1, 14), -- Sensores GP14
('Esquerda', 1, 15), ('Centro', 1, 15), ('Direita', 1, 15), -- Sensores GP15

-- Sensores do gp sensores do silo 3 Sementec
('Esquerda', 1, 16), ('Centro', 1, 16), ('Direita', 1, 16), -- Sensores GP16
('Esquerda', 1, 17), ('Centro', 1, 17), ('Direita', 1, 17), -- Sensores GP17
('Esquerda', 1, 18), ('Centro', 1, 18), ('Direita', 1, 18), -- Sensores GP18

-- Sensores do gp sensores do silo 4 Sementec
('Esquerda', 1, 19), ('Centro', 1, 19), ('Direita', 1, 19), -- Sensores GP19
('Esquerda', 1, 20), ('Centro', 1, 20), ('Direita', 1, 20), -- Sensores GP10
('Esquerda', 1, 21), ('Centro', 1, 21), ('Direita', 1, 21), -- Sensores GP21

-- Sensores do gp sensores do silo 5 Sementec
('Esquerda', 1, 22), ('Centro', 1, 22), ('Direita', 1, 22), -- Sensores GP22
('Esquerda', 1, 23), ('Centro', 1, 23), ('Direita', 1, 23), -- Sensores GP23
('Esquerda', 1, 24), ('Centro', 1, 24), ('Direita', 1, 24), -- Sensores GP24

-- Sensores do gp sensores do silo 1 ContSoja
('Esquerda', 1, 25), ('Centro', 1, 25), ('Direita', 1, 25), -- Sensores GP25
('Esquerda', 1, 26), ('Centro', 1, 26), ('Direita', 1, 26), -- Sensores GP26
('Esquerda', 1, 27), ('Centro', 1, 27), ('Direita', 1, 27), -- Sensores GP27

-- Sensores do gp sensores do silo 2 ContSoja
('Esquerda', 1, 28), ('Centro', 1, 28), ('Direita', 1, 28), -- Sensores GP28
('Esquerda', 1, 29), ('Centro', 1, 29), ('Direita', 1, 29), -- Sensores GP29
('Esquerda', 1, 30), ('Centro', 1, 30), ('Direita', 1, 30); -- Sensores GP30

-- FIM INSERTS ------------------------------------------------------------------------



-- SELECT -----------------------------------------------------------------------------
-- USE ceres;

-- Individuais --------
SELECT * FROM empresa;
SELECT * FROM usuario;
SELECT * FROM fazenda;
SELECT * FROM endereco;
SELECT * FROM bateria_silo;
SELECT * FROM silo_individual;
SELECT * FROM gp_sensores;
SELECT * FROM sensor;
SELECT * FROM historico_sensor;

-- Select para ver os registros do arduino
SELECT
h.distancia_captada,
s.localizacao,
h.dt_hora_leitura
FROM historico_sensor AS h
JOIN sensor AS s
ON s.id_sensor = h.fk_sensor
JOIN gp_sensores AS gp
ON gp.id_gp_sensores = s.fk_gp_sensores
WHERE gp.id_gp_sensores = 1 ORDER BY h.dt_hora_leitura DESC;

-- Para consultar os Usuários e suas respectivas empresas
SELECT
e.nome_fantasia AS 'Nome Empresa',
e.cnpj_empresa AS 'CNPJ',
u.nome_usuario AS 'Nome Funcionário',
u.telefone AS 'Telefone',
u.email AS 'E-mail'
FROM empresa AS e
JOIN usuario AS u
ON e.id_empresa = u.fk_empresa;

-- Para consultar os Usuários de uma empresa específica
SELECT
e.nome_fantasia AS 'Nome Empresa',
e.cnpj_empresa AS 'CNPJ',
u.nome_usuario AS 'Nome Funcionário',
u.telefone AS 'Telefone',
u.email AS 'E-mail'
FROM empresa AS e
JOIN usuario AS u
ON e.id_empresa = u.fk_empresa
WHERE e.id_empresa = 2; -- Trocar o ID de acordo com a empresa desejada
-- id 1 - Scheffer || id 2 = Sementec || id 3 = ContSoja

-- Para consultar as fazendas suas empresas e endereços
SELECT
e.nome_fantasia AS 'Nome Empresa',
e.cnpj_empresa AS 'CNPJ',
f.nome_fazenda AS 'Nome Fazenda',
CONCAT(logradouro_fazenda, ', ', num_logradouro, ', ', cidade_fazenda, ', ', uf_fazenda, '.') AS 'Endereço'
FROM empresa AS e
JOIN fazenda AS f
ON e.id_empresa = f.fk_empresa
JOIN endereco AS ende
ON ende.id_endereco = f.fk_endereco;

-- Para saber as fazendas e endereços de determinada empresa
SELECT
e.nome_fantasia AS 'Nome Empresa',
e.cnpj_empresa AS 'CNPJ',
f.nome_fazenda AS 'Nome Fazenda',
CONCAT(logradouro_fazenda, ', ', num_logradouro, ', ', cidade_fazenda, ', ', uf_fazenda, '.') AS 'Endereço'
FROM empresa AS e
JOIN fazenda AS f
ON e.id_empresa = f.fk_empresa
JOIN endereco AS ende
ON ende.id_endereco = f.fk_endereco
WHERE e.id_empresa = 3; -- Trocar o ID de acordo com a empresa desejada
-- id 1 - Scheffer || id 2 = Sementec || id 3 = ContSoja

-- Para saber as fazendas que cada usuário pode acessar
SELECT
u.nome_usuario AS 'Nome',
u.cpf AS 'CPF',
f.nome_fazenda AS 'Pode acessar:'
FROM usuario AS u
JOIN permissao AS p
ON u.id_usuario = p.fk_usuario
JOIN fazenda AS f
ON f.id_fazenda = p.fk_fazenda;

-- Para saber as fazendas que cada usuario de tal empresa pode acessar
SELECT
e.nome_fantasia AS 'Nome empresa',
e.cnpj_empresa AS 'CNPJ',
u.nome_usuario AS 'Nome',
u.cpf AS 'CPF',
f.nome_fazenda AS 'Pode acessar:'
FROM usuario AS u
JOIN permissao AS p
ON u.id_usuario = p.fk_usuario
JOIN fazenda AS f
ON f.id_fazenda = p.fk_fazenda
JOIN empresa AS e
ON e.id_empresa = u.fk_empresa;
-- WHERE e.id_empresa = 1; -- Para uma empresa específica
-- WHERE f.id_fazenda = 1; -- Para uma fazenda específica
-- WHERE u.nome_usuario = 'Patrício Scheffer'; -- Para um usuário específico

-- FIM SELECT -------------------------------------------------------------------------