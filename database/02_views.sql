-- Listar eventos com seus palestrantes

CREATE OR REPLACE VIEW vw_eventos_com_palestrantes AS
SELECT
    e.id,
    e.nome,
    e.descricao,
    e.local,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', p.id,
                'nome', p.nome,
                'email', p.email
            )
            ORDER BY p.nome
        ) FILTER (WHERE p.id IS NOT NULL),
        '[]'::json
    ) AS palestrantes
FROM eventos e
LEFT JOIN evento_palestrantes ep
    ON ep.evento_id = e.id
LEFT JOIN palestrantes p
    ON p.id = ep.palestrante_id
GROUP BY e.id, e.nome, e.descricao, e.local;
