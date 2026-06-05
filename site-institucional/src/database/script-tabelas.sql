-- DROP DATABASE ceres;
DROP DATABASE IF EXISTS ceres;
CREATE DATABASE ceres;
USE ceres;

CREATE TABLE empresa (
id_empresa INT PRIMARY KEY AUTO_INCREMENT,
cod_empresa VARCHAR(45) UNIQUE NOT NULL, -- Vai liberar o login. Com padrão interno da Ceres
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

tipo_usuario VARCHAR(30) NOT NULL,
CONSTRAINT chk_tipo_usuario CHECK (tipo_usuario IN ('AdmEmpresa', 'AdmFazenda', 'Colaborador')),

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
REFERENCES fazenda (id_fazenda),

tipo_permissao VARCHAR(45),
CONSTRAINT ct_tipo_permissao
CHECK (tipo_permissao IN ('Empresa', 'Responsável', 'Outros'))
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
CHECK (situacao IN ('Crítico', 'Moderado', 'Estável')),

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

INSERT INTO empresa (cod_empresa, nome_fantasia, cnpj_empresa, razao_social) VALUES
('SCH-0124','Scheffer', '34086808000155', 'Armazenamento Agro LTDA'), -- fk empresa 1
('SEM-0498','Sementec', '53314648000107', 'Zen Armazenamentos SA'), -- fk empresa 2
('CON-6767','ContSoja', '18749209000118', 'Container Soja LTDA'); -- fk empresa 3


INSERT INTO endereco (cep, logradouro_fazenda, num_logradouro, cidade_fazenda, uf_fazenda) VALUES
-- Endereço das fazendas da empresa Scheffer fk empresa 1
('78048-250', 'Av. Dr. Hélio Ribeiro', '525', 'Cuiabá', 'MT'),
('78366012', 'Rua das Carpas', '1923', 'Sapezal', 'MT'),

-- Endereço das fazendas da empresa Sementec fk empresa 2
('75640-000', 'Avenida Antônio Accioly', '07', ' Piracanjuba', 'GO'),
('75800-014', 'Rua Dr. Roberto Assis Carvalho', '45', 'Jataí', 'GO'),

-- Endereço da fazenda da empresa ContSoja fk empresa 3
('47820-000', 'Sítio Grande', '790', 'São Desidério', 'BH');

-- Chk_tipo_usuario CHECK (tipo_usuario IN ('AdmEmpresa', 'AdmFazenda', 'Colaborador')),
INSERT INTO usuario (nome_usuario, cpf, dt_nascimento, senha, email, telefone, tipo_usuario, fk_empresa) VALUES
-- 3 Usuários da empresa Scheffer fk empresa 1
('Patrício Scheffer', '79620121023', '1978-01-02', 'Scheffer@123', 'scheffer.patricio@email.com', '(12) 2561-0474', 'AdmEmpresa', 1),
('Jonas Augusto', '62066691062', '1990-12-25', 'Jonas@123', 'augusto.jonas@email.com', '(19) 3901-6368', 'AdmFazenda', 1),
('Mariana Franco', '60333608003', '1992-10-02', 'Mariana@123', 'franco.mariana@email.com', '(11) 2483-3297', 'Colaborador', 1),

-- 4 Usuários da empresa Sementec fk empresa 2
('Erick Castro', '39479392488', '2001-07-09', 'Erick@123', 'erick.castro@email.com', '(11) 2828-2751', 'AdmEmpresa', 2),
('Giovanna Correia', '23283203687', '1964-03-30', 'Giovanna@123', 'giovanna.correia@email.com', '(11) 6403-8465', 'AdmFazenda', 2),
('Anna Santos', '21171683707', '1992-10-23', 'Anna@123', 'anna.santos@email.com', '(11) 6523-8331','Colaborador', 2),
('Daniel Cardoso', '84056133130', '1984-12-25', 'Daniel@123', 'daniel.cardoso@email.com', '(11) 7172-3488','Colaborador', 2),

-- 5 Usuários da empresa ContSoja fk empresa 3
('Tomás Azevedo', '99985232143', '2002-02-07', 'Tomas@123', 'tomas.azevedo@email.com', '(11) 8064-7075', 'AdmEmpresa', 3),
('Guilherme Ribeiro', '70772010820', '1977-11-09', 'Guilherme@123', 'guilherme.ribeiro@email.com', '(11) 4489-7507', 'AdmFazenda', 3),
('Sarah Lima', '90576221490', '1988-03-28', 'Sarah@123', 'sarah.lima@email.com', '(41) 5308-6787', 'Colaborador', 3),
('Brenda Melo', '81535689579', '1992-10-28', 'Brenda@123', 'brenda.melo@email.com', '(11) 5213-2368', 'Colaborador', 3),
('Emily Correia', '65261626650', '2005-03-31', 'Emily@123', 'emily.correia@email.com', '(18) 2960-5857', 'Colaborador', 3);


INSERT INTO fazenda (nome_fazenda, fk_endereco, fk_empresa) VALUES
-- Fazenda dos endereços 1 e 2, empresa Scheffer
('Grão Dourado Armazéns', 1, 1),
('Silos da Soja Segura', 2, 1),

-- Fazenda dos endereços 3 e 4, empresa Sementec
('Foco Soja Armazéns', 3, 2),
('Armazém Soja Forte', 4, 2),

-- Fazenda do endereço 5, empresa ContSoja
('Silo Soja Prime', 5, 3);


INSERT INTO permissao (fk_usuario, fk_fazenda, tipo_permissao) VALUES
-- Permissoes usuários da empresa Scheffer
(2, 1, 'Responsável'), -- Jonas tem permissão da fazenda 1
(2, 2, 'Responsável'), -- Jonas tem permissão da fazenda 2
(3, 1, 'Outros'), -- Mariana tem permissão da fazenda 1

-- Permissoes usuários da empresa Sementec
(5, 4, 'Responsável'), -- Giovanna tem permissão da fazenda 4
(6, 3, 'Responsável'), -- Anna tem permissão da fazenda 3
(7, 4, 'Outros'), -- Daniel tem permissão da fazenda 4

-- Permissoes usuários da empresa ContSoja
(9, 5, 'Responsável'), -- Guilherme tem permissão da fazenda 5
(10, 5, 'Outros'), -- Sarah tem permissão da fazenda 5
(11, 5, 'Outros'), -- Brenda tem permissão da fazenda 5
(12, 5, 'Outros'); -- Emily tem permissão da fazenda 5


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

-- SELECT * FROM volume_total;
 
/* SELECT 
	silo_i.id_silo_individual AS id_silo_indiv,
	silo_i.modelo_silo AS modelo_silo_indiv,
    bat.id_bateria_silo AS id,
	bat.bateria_grupo AS bateria,
	silo_i.altura_silo AS altura
FROM 
silo_individual silo_i
JOIN bateria_silo bat
 ON bat.id_bateria_silo = silo_i.fk_bateria_silo; */

INSERT INTO historico_sensor (fk_sensor, distancia_captada, dt_hora_leitura) VALUES

-- Silos da Bateria A 01 Scheffer (Altura: 20m)
-- Crítico
(1, 18.00, '2026-01-31 10:00:00'), -- Sensor 1 silo 1
(2, 18.00, '2026-01-31 10:00:00'), -- Sensor 2 silo 1
(3, 18.00, '2026-01-31 10:00:00'), -- Sensor 3 silo 1

-- Estável
(4, 10.00, '2026-01-31 10:00:00'), -- Sensor 1 silo 2
(5, 10.00, '2026-01-31 10:00:00'), -- Sensor 2 silo 2
(6, 10.00, '2026-01-31 10:00:00'), -- Sensor 3 silo 2

-- Moderado
(7, 16.00, '2026-01-31 10:00:00'), -- Sensor 1 silo 3
(8, 16.00, '2026-01-31 10:00:00'), -- Sensor 2 silo 3
(9, 16.00, '2026-01-31 10:00:00'), -- Sensor 3 silo 3


-- Silos da BTR 1 10 Scheffer (Altura: 30m)
-- Crítico
(10, 27, '2026-01-31 10:00:00'), -- Sensor 1 silo 1
(11, 27, '2026-01-31 10:00:00'), -- Sensor 2 silo 1
(12, 27, '2026-01-31 10:00:00'), -- Sensor 3 silo 1

-- Crítico
(13, 27, '2026-01-31 10:00:00'), -- Sensor 1 silo 2
(14, 27, '2026-01-31 10:00:00'), -- Sensor 2 silo 2
(15, 27, '2026-01-31 10:00:00'), -- Sensor 3 silo 2

-- Crítico
(16, 27, '2026-01-31 10:00:00'), -- Sensor 1 silo 3
(17, 27, '2026-01-31 10:00:00'), -- Sensor 2 silo 3
(18, 27, '2026-01-31 10:00:00'), -- Sensor 3 silo 3


-- Silos da BTR 2 20 Scheffer (Altura: 10m)
-- Estável
(19, 5, '2026-01-31 10:00:00'), -- Sensor 1 silo 1
(20, 5, '2026-01-31 10:00:00'), -- Sensor 2 silo 1
(21, 5, '2026-01-31 10:00:00'), -- Sensor 3 silo 1

-- Estável
(22, 5, '2026-01-31 10:00:00'), -- Sensor 1 silo 2
(23, 5, '2026-01-31 10:00:00'), -- Sensor 2 silo 2
(24, 5, '2026-01-31 10:00:00'), -- Sensor 3 silo 2

-- Estável
(25, 5, '2026-01-31 10:00:00'), -- Sensor 1 silo 3
(26, 5, '2026-01-31 10:00:00'), -- Sensor 2 silo 3
(27, 5, '2026-01-31 10:00:00'), -- Sensor 3 silo 3


-- Silos da 101 - Bateria Sementec (Altura: 15m)
-- Moderado
(28, 12, '2026-01-31 10:00:00'), -- Sensor 1 silo 1
(29, 12, '2026-01-31 10:00:00'), -- Sensor 2 silo 1
(30, 12, '2026-01-31 10:00:00'), -- Sensor 3 silo 1

-- Moderado
(31, 12, '2026-01-31 10:00:00'), -- Sensor 1 silo 2
(32, 12, '2026-01-31 10:00:00'), -- Sensor 2 silo 2
(33, 12, '2026-01-31 10:00:00'), -- Sensor 3 silo 2

-- Moderado
(34, 12, '2026-01-31 10:00:00'), -- Sensor 1 silo 3
(35, 12, '2026-01-31 10:00:00'), -- Sensor 2 silo 3
(36, 12, '2026-01-31 10:00:00'), -- Sensor 3 silo 3


-- Silos da 102 - Bateria Sementec (Altura: 25m)
-- Crítico
(37, 22, '2026-01-31 10:00:00'), -- Sensor 1 silo 1
(38, 22, '2026-01-31 10:00:00'), -- Sensor 2 silo 1
(39, 22, '2026-01-31 10:00:00'), -- Sensor 3 silo 1

-- Crítico
(40, 22, '2026-01-31 10:00:00'), -- Sensor 1 silo 2
(41, 22, '2026-01-31 10:00:00'), -- Sensor 2 silo 2
(42, 22, '2026-01-31 10:00:00'), -- Sensor 3 silo 2

-- Estável
(43, 12, '2026-01-31 10:00:00'), -- Sensor 1 silo 3
(44, 12, '2026-01-31 10:00:00'), -- Sensor 2 silo 3
(45, 12, '2026-01-31 10:00:00'), -- Sensor 3 silo 3


-- Silos da 1000 01 Sementec (Altura: 12m)
-- Crítico
(46, 10, '2026-01-31 10:00:00'), -- Sensor 1 silo 1
(47, 10, '2026-01-31 10:00:00'), -- Sensor 2 silo 1
(48, 10, '2026-01-31 10:00:00'), -- Sensor 3 silo 1

-- Moderado
(49, 9, '2026-01-31 10:00:00'), -- Sensor 1 silo 2
(50, 9, '2026-01-31 10:00:00'), -- Sensor 2 silo 2
(51, 9, '2026-01-31 10:00:00'), -- Sensor 3 silo 2

-- Moderado
(52, 9, '2026-01-31 10:00:00'), -- Sensor 1 silo 3
(53, 9, '2026-01-31 10:00:00'), -- Sensor 2 silo 3
(54, 9, '2026-01-31 10:00:00'), -- Sensor 3 silo 3


-- Silos da 1000 02 Sementec (Altura: 32m)
-- Moderado
(55, 25, '2026-01-31 10:00:00'), -- Sensor 1 silo 1
(56, 25, '2026-01-31 10:00:00'), -- Sensor 2 silo 1
(57, 25, '2026-01-31 10:00:00'), -- Sensor 3 silo 1

-- Estável
(58, 16, '2026-01-31 10:00:00'), -- Sensor 1 silo 2
(59, 16, '2026-01-31 10:00:00'), -- Sensor 2 silo 2
(60, 16, '2026-01-31 10:00:00'), -- Sensor 3 silo 2

-- Estável
(61, 16, '2026-01-31 10:00:00'), -- Sensor 1 silo 3
(62, 16, '2026-01-31 10:00:00'), -- Sensor 2 silo 3
(63, 16, '2026-01-31 10:00:00'), -- Sensor 3 silo 3


-- Silos da 1000 03 Sementec (Altura: 10m)
-- Estável
(64, 5, '2026-01-31 10:00:00'), -- Sensor 1 silo 1
(65, 5, '2026-01-31 10:00:00'), -- Sensor 2 silo 1
(66, 5, '2026-01-31 10:00:00'), -- Sensor 3 silo 1

-- Moderado
(67, 8, '2026-01-31 10:00:00'), -- Sensor 1 silo 2
(68, 8, '2026-01-31 10:00:00'), -- Sensor 2 silo 2
(69, 8, '2026-01-31 10:00:00'), -- Sensor 3 silo 2

-- Moderado
(70, 8, '2026-01-31 10:00:00'), -- Sensor 1 silo 3
(71, 8, '2026-01-31 10:00:00'), -- Sensor 2 silo 3
(72, 8, '2026-01-31 10:00:00'), -- Sensor 3 silo 3


-- Silos da A45 - BTR ContSoja (Altura: 32m)
-- Crítico
(73, 28, '2026-01-31 10:00:00'), -- Sensor 1 silo 1
(74, 28, '2026-01-31 10:00:00'), -- Sensor 2 silo 1
(75, 28, '2026-01-31 10:00:00'), -- Sensor 3 silo 1

-- Moderado
(76, 25, '2026-01-31 10:00:00'), -- Sensor 1 silo 2
(77, 25, '2026-01-31 10:00:00'), -- Sensor 2 silo 2
(78, 25, '2026-01-31 10:00:00'), -- Sensor 3 silo 2

-- Crítico
(79, 28, '2026-01-31 10:00:00'), -- Sensor 1 silo 3
(80, 28, '2026-01-31 10:00:00'), -- Sensor 2 silo 3
(81, 28, '2026-01-31 10:00:00'), -- Sensor 3 silo 3


-- Silos da B45 - BTR ContSoja (Altura: 24m)
-- Moderado
(82, 19, '2026-01-31 10:00:00'), -- Sensor 1 silo 1
(83, 19, '2026-01-31 10:00:00'), -- Sensor 2 silo 1
(84, 19, '2026-01-31 10:00:00'), -- Sensor 3 silo 1

-- Estável
(85, 12, '2026-01-31 10:00:00'), -- Sensor 1 silo 2
(86, 12, '2026-01-31 10:00:00'), -- Sensor 2 silo 2
(87, 12, '2026-01-31 10:00:00'), -- Sensor 3 silo 2

-- Crítico
(88, 21, '2026-01-31 10:00:00'), -- Sensor 1 silo 3
(89, 21, '2026-01-31 10:00:00'), -- Sensor 2 silo 3
(90, 21, '2026-01-31 10:00:00'); -- Sensor 3 silo 3

INSERT INTO alerta (prioridade, situacao, dt_registro, fk_historico_sensor) VALUES
-- Alerta dos sensores do gp de sensores silo 1 Scheffer
(1, 'Crítico', '2026-04-06', 1), (1, 'Crítico', '2026-04-06', 2), (1, 'Crítico', '2026-04-06', 3), -- Sensores GP1
(5, 'Estável', '2026-04-06', 4), (5, 'Estável', '2026-04-06', 5), (5, 'Estável', '2026-04-06', 6), -- Sensores GP2
(3, 'Moderado', '2026-04-06', 7), (3, 'Moderado', '2026-04-06', 8), (3, 'Moderado', '2026-04-06', 9), -- Sensores GP3

-- Alerta dos sensores gp sensores do silo 2 Scheffer
(2, 'Crítico', '2026-04-06', 10), (2, 'Crítico', '2026-04-06', 11), (2, 'Crítico', '2026-04-06', 12), -- Sensores GP4
(1, 'Crítico', '2026-04-06', 13), (1, 'Crítico', '2026-04-06', 14), (1, 'Crítico', '2026-04-06', 15), -- Sensores GP5
(2, 'Crítico', '2026-04-06', 16), (2, 'Crítico', '2026-04-06', 17), (2, 'Crítico', '2026-04-06', 18), -- Sensores GP6

-- Alerta dos sensores gp sensores do silo 3 Scheffer
(5, 'Estável', '2026-04-06', 19), (5, 'Estável', '2026-04-06', 20), (5, 'Estável', '2026-04-06', 21), -- Sensores GP7
(5, 'Estável', '2026-04-06', 22), (5, 'Estável', '2026-04-06', 23), (5, 'Estável', '2026-04-06', 24), -- Sensores GP8
(5, 'Estável', '2026-04-06', 25), (5, 'Estável', '2026-04-06', 26), (5, 'Estável', '2026-04-06', 27), -- Sensores GP9

-- Alerta dos sensores gp sensores do silo 1 Sementec
(4, 'Moderado', '2026-04-06', 28), (4, 'Moderado', '2026-04-06', 29), (4, 'Moderado', '2026-04-06', 30), -- Sensores GP10
(3, 'Moderado', '2026-04-06', 31), (3, 'Moderado', '2026-04-06', 32), (3, 'Moderado', '2026-04-06', 33), -- Sensores GP11
(4, 'Moderado', '2026-04-06', 34), (4, 'Moderado', '2026-04-06', 35), (4, 'Moderado', '2026-04-06', 36), -- Sensores GP12

-- Alerta dos sensores gp sensores do silo 2 Sementec
(1, 'Crítico', '2026-04-06', 37), (1, 'Crítico', '2026-04-06', 38), (1, 'Crítico', '2026-04-06', 39), -- Sensores GP13
(2, 'Crítico', '2026-04-06', 40), (2, 'Crítico', '2026-04-06', 41), (2, 'Crítico', '2026-04-06', 42), -- Sensores GP14
(5, 'Estável', '2026-04-06', 43), (5, 'Estável', '2026-04-06', 44), (5, 'Estável', '2026-04-06', 45), -- Sensores GP15

-- Alerta dos sensores gp sensores do silo 3 Sementec
(1, 'Crítico', '2026-04-06', 46), (1, 'Crítico', '2026-04-06', 47), (1, 'Crítico', '2026-04-06', 48), -- Sensores GP16
(3, 'Moderado', '2026-04-06', 49), (3, 'Moderado', '2026-04-06', 50), (3, 'Moderado', '2026-04-06', 51), -- Sensores GP17
(4, 'Moderado', '2026-04-06', 52), (4, 'Moderado', '2026-04-06', 53), (4, 'Moderado', '2026-04-06', 54), -- Sensores GP18

-- Alerta dos sensores gp sensores do silo 4 Sementec
(3, 'Moderado', '2026-04-06', 55), (3, 'Moderado', '2026-04-06', 56), (3, 'Moderado', '2026-04-06', 57), -- Sensores GP19
(5, 'Estável', '2026-04-06', 58), (5, 'Estável', '2026-04-06', 59), (5, 'Estável', '2026-04-06', 60), -- Sensores GP20
(5, 'Estável', '2026-04-06', 61), (5, 'Estável', '2026-04-06', 62), (5, 'Estável', '2026-04-06', 63), -- Sensores GP21

-- Alerta dos sensores gp sensores do silo 5 Sementec
(5, 'Estável', '2026-04-06', 64), (5, 'Estável', '2026-04-06', 65), (5, 'Estável', '2026-04-06', 66), -- Sensores GP22
(4, 'Moderado', '2026-04-06', 67), (4, 'Moderado', '2026-04-06', 68), (4, 'Moderado', '2026-04-06', 69), -- Sensores GP23
(3, 'Moderado', '2026-04-06', 70), (3, 'Moderado', '2026-04-06', 71), (3, 'Moderado', '2026-04-06', 72), -- Sensores GP24

-- Alerta dos sensores gp sensores do silo 1 ContSoja
(2, 'Crítico', '2026-04-06', 73), (2, 'Crítico', '2026-04-06', 74), (2, 'Crítico', '2026-04-06', 75), -- Sensores GP25
(4, 'Moderado', '2026-04-06', 76), (4, 'Moderado', '2026-04-06', 77), (4, 'Moderado', '2026-04-06', 78), -- Sensores GP26
(1, 'Crítico', '2026-04-06', 79), (1, 'Crítico', '2026-04-06', 80), (1, 'Crítico', '2026-04-06', 81), -- Sensores GP27

-- Alerta dos sensores gp sensores do silo 2 ContSoja
(3, 'Moderado', '2026-04-06', 82), (3, 'Moderado', '2026-04-06', 83), (3, 'Moderado', '2026-04-06', 84), -- Sensores GP28
(5, 'Estável', '2026-04-06', 85), (5, 'Estável', '2026-04-06', 86), (5, 'Estável', '2026-04-06', 87), -- Sensores GP29
(2, 'Crítico', '2026-04-06', 88), (2, 'Crítico', '2026-04-06', 89), (2, 'Crítico', '2026-04-06', 90); -- Sensores GP30

-- FIM INSERTS ------------------------------------------------------------------------

-- SELECIONANDO O VOLUME TOTAL DO SILO
CREATE VIEW volume_total AS
SELECT 
	silo_i.id_silo_individual AS id_silo_indiv,
	silo_i.modelo_silo AS modelo_silo_indiv,
    bat.id_bateria_silo AS id,
	bat.bateria_grupo AS bateria,
	ROUND((PI() * POW(silo_i.diametro_silo/2, 2) * silo_i.altura_silo * 0.80) + ((PI() * POW(silo_i.diametro_silo/2, 2) * silo_i.altura_silo * 0.20)/3)) AS total
FROM 
silo_individual silo_i
JOIN bateria_silo bat
 ON bat.id_bateria_silo = silo_i.fk_bateria_silo;
 
 SELECT * FROM volume_total;

  -- CALCULANDO O QUÃO CHEIO ESTÁ OS SILOS DA BATERIA
 CREATE VIEW volume_preenchido_bateria AS
 SELECT
	silo_i.id_silo_individual,
	silo_i.modelo_silo AS modelo_silo_indiv,
    bat.id_bateria_silo AS id,
	bat.bateria_grupo AS bateria,
	ROUND((PI() * POW(silo_i.diametro_silo/2, 2) * silo_i.altura_silo * 0.80) + ((PI() * POW(silo_i.diametro_silo/2, 2) * silo_i.altura_silo * 0.20)/3)) AS total,
 ROUND((
(PI() * POW(silo_i.diametro_silo/2, 2) * silo_i.altura_silo * 0.80)
+ 
((PI() * POW(silo_i.diametro_silo/2, 2) * silo_i.altura_silo * 0.20)/3)
-
(PI() * POW(silo_i.diametro_silo/2, 2) *AVG(ultima_leitura.distancia_captada))
), 2) AS preenchimento

FROM silo_individual silo_i

JOIN bateria_silo bat
	ON bat.id_bateria_silo = silo_i.fk_bateria_silo
JOIN gp_sensores gp 
	ON gp.fk_silo = silo_i.id_silo_individual
JOIN sensor s ON s.fk_gp_sensores = gp.id_gp_sensores
JOIN 
(SELECT 
hs1.fk_sensor,
hs1.distancia_captada
FROM historico_sensor hs1
WHERE hs1.id_historico_sensor = (SELECT MAX(hs2.id_historico_sensor) 
FROM historico_sensor hs2 
WHERE hs1.fk_sensor = hs2.fk_sensor )
) ultima_leitura 
ON ultima_leitura.fk_sensor = s.id_sensor
GROUP BY
silo_i.id_silo_individual,
silo_i.modelo_silo;

CREATE VIEW media_preenchimento_mensal_por_bateria AS
SELECT 
    bat.id_bateria_silo AS bateria,
    MONTH(ultima_leitura.dt_hora_leitura) AS mes,
    TRUNCATE(AVG(
        ROUND((
            (PI() * POW(silo_i.diametro_silo/2, 2) * silo_i.altura_silo * 0.80)
            + 
            ((PI() * POW(silo_i.diametro_silo/2, 2) * silo_i.altura_silo * 0.20)/3)
            -
            (PI() * POW(silo_i.diametro_silo/2, 2) * ultima_leitura.media_distancia)
        ), 2)), 2)
     AS preenchimento_bateria

FROM silo_individual silo_i
JOIN bateria_silo bat
    ON bat.id_bateria_silo = silo_i.fk_bateria_silo
JOIN gp_sensores gp 
    ON gp.fk_silo = silo_i.id_silo_individual
JOIN sensor s 
    ON s.fk_gp_sensores = gp.id_gp_sensores
JOIN 
    (SELECT 
        hs1.fk_sensor,
        hs1.dt_hora_leitura,
        AVG(hs1.distancia_captada) AS media_distancia -- AVG fica aqui dentro
     FROM historico_sensor hs1
     WHERE hs1.id_historico_sensor = (
         SELECT MAX(hs2.id_historico_sensor) 
         FROM historico_sensor hs2 
         WHERE hs1.fk_sensor = hs2.fk_sensor)
     GROUP BY hs1.fk_sensor, hs1.dt_hora_leitura
    ) ultima_leitura 
    ON ultima_leitura.fk_sensor = s.id_sensor
    GROUP BY mes, bateria
    ORDER BY bateria;

-- CRUD FAZENDAS --

-- Para saber o responsável de cada fazenda
CREATE VIEW responsavel_fazenda AS
SELECT
	f.id_fazenda AS id_fazenda,
    f.nome_fazenda AS fazenda,
    u.id_usuario AS id_usuario,
	u.nome_usuario AS responsavel,
    u.telefone AS contato,
    CONCAT(e.cidade_fazenda, '/', e.uf_fazenda) AS endereco
FROM usuario AS u
JOIN permissao AS p
ON p.fk_usuario = u.id_usuario
JOIN fazenda AS f
ON p.fk_fazenda = f.id_fazenda
JOIN endereco AS e
ON f.fk_endereco = e.id_endereco
WHERE p.tipo_permissao = 'Responsável';

SELECT * FROM responsavel_fazenda;

-- Para saber as informações de cada fazenda
CREATE VIEW fazendas_do_usuario AS
SELECT
	id_usuario,
	id_fazenda,
	responsavel,
    contato,
    endereco,
	nome,
	COUNT(DISTINCT id_silo) AS qtd_silos,
	COUNT(DISTINCT id_bateria) AS qtd_bateria,
	SUM(CASE WHEN situacao_silo = 'Estável' THEN 1 ELSE 0 END) AS estaveis,
	SUM(CASE WHEN situacao_silo = 'Moderado' THEN 1 ELSE 0 END) AS moderados,
	SUM(CASE WHEN situacao_silo = 'Crítico' THEN 1 ELSE 0 END) AS criticos
FROM (
	SELECT
		rf.id_usuario AS id_usuario,
		rf.responsavel AS responsavel,
		rf.contato AS contato,
		rf.endereco AS endereco,
		f.id_fazenda AS id_fazenda,
		f.nome_fazenda AS nome,
		b.id_bateria_silo AS id_bateria,
		b.bateria_grupo AS bateria,
		s.id_silo_individual AS id_silo,
		s.modelo_silo AS silo,
		a.situacao AS situacao_silo
	FROM fazenda AS f
	JOIN bateria_silo AS b ON b.fk_fazenda = f.id_fazenda
	JOIN silo_individual AS s ON s.fk_bateria_silo = b.id_bateria_silo
	JOIN gp_sensores AS gs ON gs.fk_silo = s.id_silo_individual
	JOIN sensor AS sr ON sr.fk_gp_sensores = gs.id_gp_sensores
	JOIN historico_sensor AS hs ON hs.fk_sensor = sr.id_sensor
	JOIN alerta AS a ON a.fk_historico_sensor = hs.id_historico_sensor
    JOIN responsavel_fazenda AS rf ON rf.id_fazenda = f.id_fazenda
) AS qtd_situacoes
GROUP BY nome, responsavel, contato, endereco, id_fazenda, id_usuario;
