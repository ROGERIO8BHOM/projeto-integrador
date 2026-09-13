USE helpdesk;

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS solicitantes (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(150) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	setor VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS tecnicos (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(150) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS chamados (
	id INT AUTO_INCREMENT PRIMARY KEY,
	titulo VARCHAR(150) NOT NULL,
	descricao TEXT NOT NULL,
	solicitante_id INT NOT NULL,
	categoria_id INT NOT NULL,
	tecnico_id INT DEFAULT NULL,
	prioridade VARCHAR(10) NOT NULL,
	status VARCHAR(20) NOT NULL DEFAULT "ABERTO",
	solucao TEXT,
	criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_chamados_solicitante
		FOREIGN KEY (solicitante_id) REFERENCES solicitantes(id),
	
	CONSTRAINT fk_chamados_categoria
		FOREIGN KEY (categoria_id) REFERENCES categorias(id),
	
	CONSTRAINT fk_chamados_tecnico
		FOREIGN KEY (tecnico_id) REFERENCES tecnicos(id),
	
	CONSTRAINT chk_chamados_prioridade
		CHECK (prioridade IN ("BAIXA", "MEDIA", "ALTA")),
	
	CONSTRAINT chk_chamados_status
		CHECK (status IN ("ABERTO", "EM_ATENDIMENTO", "CONCLUIDO"))
		
);