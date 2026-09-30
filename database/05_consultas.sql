-- Consultas

-- Listar eventos
SELECT * FROM eventos ORDER BY id;

-- Listar palestrantes
SELECT * FROM palestrantes ORDER BY nome;

-- Listar evento com palestrante
SELECT * FROM vw_eventos_com_palestrantes;

-- Buscar um evento pelo ID
SELECT * FROM eventos WHERE id = 1;

-- Buscar palestrantes de um evento
SELECT p.id, p.nome, p.email
FROM palestrantes p
INNER JOIN evento_palestrantes ep
    ON ep.palestrante_id = p.id
WHERE ep.evento_id = 1;

-- Buscar eventos de um palestrante
SELECT e.id, e.nome, e.descricao, e.local
FROM eventos e
INNER JOIN evento_palestrantes ep
    ON ep.evento_id = e.id
WHERE ep.palestrante_id = 2;

-- Contar palestrantes por evento
SELECT
    e.id,
    e.nome,
    COUNT(ep.palestrante_id) AS quantidade_palestrantes
FROM eventos e
LEFT JOIN evento_palestrantes ep
    ON ep.evento_id = e.id
GROUP BY e.id, e.nome
ORDER BY e.id;
