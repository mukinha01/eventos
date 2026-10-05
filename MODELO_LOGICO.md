# Modelo Logico

## EVENTOS
- **id**: chave primaria, inteiro, auto incremento, obrigatorio.
- **nome**: texto, obrigatorio.
- **descricao**: texto, obrigatorio.
- **local**: texto, obrigatorio.

## PALESTRANTES
- **id**: chave primaria, inteiro, auto incremento, obrigatorio.
- **nome**: texto, obrigatorio.
- **email**: texto, obrigatorio e unico.

## EVENTO_PALESTRANTES
- **evento_id**: chave estrangeira para `eventos.id`, obrigatorio.
- **palestrante_id**: chave estrangeira para `palestrantes.id`, obrigatorio.
- Chave primaria composta por `(evento_id, palestrante_id)`.

## Relacionamento

Um evento pode ter varios palestrantes e um palestrante pode participar de varios eventos.

`EVENTOS 1:N EVENTO_PALESTRANTES N:1 PALESTRANTES`

Consequentemente:

`EVENTOS N:N PALESTRANTES`
