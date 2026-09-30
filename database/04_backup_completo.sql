-- Backup completo da base eventos_db (PostgreSQL).
-- Contém estrutura, relacionamentos, view e dados iniciais.

DROP VIEW IF EXISTS vw_eventos_com_palestrantes;
DROP TABLE IF EXISTS evento_palestrantes;
DROP TABLE IF EXISTS palestrantes;
DROP TABLE IF EXISTS eventos;

CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    local VARCHAR(200) NOT NULL
);

CREATE TABLE palestrantes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE
);

CREATE TABLE evento_palestrantes (
    evento_id INTEGER NOT NULL,
    palestrante_id INTEGER NOT NULL,
    CONSTRAINT pk_evento_palestrante PRIMARY KEY (evento_id, palestrante_id),
    CONSTRAINT fk_evento FOREIGN KEY (evento_id)
        REFERENCES eventos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_palestrante FOREIGN KEY (palestrante_id)
        REFERENCES palestrantes(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE OR REPLACE VIEW vw_eventos_com_palestrantes AS
SELECT
    e.id,
    e.nome,
    e.descricao,
    e.local,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT('id', p.id, 'nome', p.nome, 'email', p.email)
            ORDER BY p.nome
        ) FILTER (WHERE p.id IS NOT NULL),
        '[]'::json
    ) AS palestrantes
FROM eventos e
LEFT JOIN evento_palestrantes ep ON ep.evento_id = e.id
LEFT JOIN palestrantes p ON p.id = ep.palestrante_id
GROUP BY e.id, e.nome, e.descricao, e.local;

INSERT INTO eventos (nome, descricao, local) VALUES
    ('Hackathon 2026', 'Desafio para estudantes de tecnologia.', 'FIAP'),
    ('Apresentacoes TCC', 'Apresentacoes da turma de desenvolvimento de sistemas.', 'Auditorio');

INSERT INTO palestrantes (nome, email) VALUES
    ('Kamilly Ribeiro', 'kamilly.ribeiro@hotmail.com'),
    ('Juan Mathias', 'juan.mathias@gmail.com'),
    ('Samuel Santos', 'samuel.santos@mail.com');

INSERT INTO evento_palestrantes (evento_id, palestrante_id) VALUES
    (1, 1), (1, 2), (2, 2), (2, 3);
