-- Estrutura do banco em PostgreSQL

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

    CONSTRAINT pk_evento_palestrante
        PRIMARY KEY (evento_id, palestrante_id),

    CONSTRAINT fk_evento
        FOREIGN KEY (evento_id)
        REFERENCES eventos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_palestrante
        FOREIGN KEY (palestrante_id)
        REFERENCES palestrantes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
