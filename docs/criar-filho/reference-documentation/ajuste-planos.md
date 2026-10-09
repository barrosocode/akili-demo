# Modelos custom e livre no plano de estudos

**Data:** 2026-10-09

`review_model` continua no back-end. Os valores aceitos passam a ser `dehaene`, `leitner`, `custom` e `livre`. O padrão, quando o aluno ainda não tem configuração, segue `dehaene`.

`dehaene` e `leitner` não mudam de calendário: R1 um dia depois da aula (10 min), R2 em 7 dias (15 min), R3 em 21 dias (10 min). Se o prazo tem menos de 21 dias, o aviso E003 compacta R2 para 5 dias e R3 para 14.

## Custom

O front não envia datas. O `PUT` de `study-settings` grava `review_model: "custom"` e a geração lê esse valor.

Com revisão espaçada ligada, cada tópico continua com quatro cards: aula, R1, R2 e R3. As datas saem dos dias que têm horário de estudo entre o início e o prazo, já sem datas bloqueadas e depois do ajuste de prova.

O card de índice `i`, numa lista de N cards e D dias, cai no dia `round(i * (D - 1) / (N - 1))`.

Quatro dias e quatro cards: aula no 1º, R1 no 2º, R2 no 3º, R3 no 4º. Com mais dias, o intervalo abre. Com menos dias do que cards, mais de um card divide o mesmo dia. O card fica preso nesse dia. Se o dia não tiver vaga, entra o aviso E001. E003 não aparece no custom.

Com `spaced_review` desligado, só nasce a aula, no primeiro dia com horário.

O quadro segue com `scheduled_on` preenchido em cada card.

## Livre

O seletor envia `review_model: "livre"`.

Cada tópico vira um único card `new_content`. Não há R1, R2 nem R3. O card nasce com status `backlog` e com `scheduled_on`, `scheduled_start` e `scheduled_end` nulos. A promoção diária e a do GET do quadro olham a data, então esses cards não passam sozinhos para `todo`.

A coluna backlog precisa listar os cards sem filtrar por data. Um filtro `scheduled_on` esconde o plano livre.

Ao abrir o conteúdo a partir do card, o pedido da sessão continua enviando `study_task_uuid`. A API move o card para `doing` quando a sessão começa e para `done` quando ela é concluída. O aluno não faz PATCH de status.

`scheduled_on` em `study_tasks` agora aceita nulo. O Postgres local foi conferido antes do `ALTER`: a coluna era `date` e `NOT NULL`.

## O que o front ajusta

- Incluir `livre` nas opções de `review_model`, ao lado de `dehaene`, `leitner` e `custom`.
- Tratar `scheduled_on` nulo no card. Não assumir que todo card tem dia no calendário.
- No modelo livre, montar a coluna backlog com esses cards e abrir a sessão com o `uuid` do card.
- No custom, continuar exibindo a data que a API devolveu. Não calcular o espaçamento na tela.
