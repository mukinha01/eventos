-- Dados iniciais

INSERT INTO eventos (nome, descricao, local)
VALUES
(
    'Hackathon 2026',
    'Desafio para estudantes de tecnologia.',
    'FIAP'
),
(
    'Apresentacoes TCC',
    'Apresentacoes da turma de desenvolvimento de sistemas.',
    'Auditorio'
);

INSERT INTO palestrantes (nome, email)
VALUES
('Kamilly Ribeiro', 'kamilly.ribeiro@hotmail.com'),
('Juan Mathias', 'juan.mathias@gmail.com'),
('Samuel Santos', 'samuel.santos@mail.com');

INSERT INTO evento_palestrantes (evento_id, palestrante_id)
VALUES
(1, 1),
(1, 2),
(2, 2),
(2, 3);
