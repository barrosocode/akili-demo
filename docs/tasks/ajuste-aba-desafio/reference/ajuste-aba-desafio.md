# Mostrar o Desafio no player

**Data:** 2026-10-22
**Repo do ajuste:** `akili-site`
**Spec:** [../specs/01-mostrar-desafio-no-player.md](../specs/01-mostrar-desafio-no-player.md)
**API:** nenhuma mudança. A sessão já devolve `desafio` em `visible_tabs`.

O player do aluno para na Revisão 3. Em _O mundo microscópico_ isso deixa o conteúdo em 83% depois de concluir conteúdo, conferência e as três revisões: são 5 de 6 passos, `round(5 / 6 × 100) = 83`. O passo que falta é o Desafio.

## O que a API já faz

`CompleteStudentContentWhenReady` inclui `desafio` quando a versão publicada tem ao menos uma questão `generalized`. As 14 questões desse tipo em _O mundo microscópico_ formam esse passo. Sem `generalized`, a aba não entra na conta e o conteúdo conclui sem tentativa de Desafio.

A sessão nova lista as seis abas:

```json
["treino", "conf", "r1", "r2", "r3", "desafio"]
```

## O que o site descarta

`akili-site/features/content-player/lib/lesson-utils.ts`, em `resolveTabsFromIds`, ignora `desafio` mesmo quando a sessão envia o id:

```ts
if (raw === "desafio" || !isLessonTabId(raw) || seen.has(raw)) return;
```

O comentário acima da função registra a decisão: “`desafio` fica fora deste recorte mesmo se a API ainda enviar.”

`student-lesson-player.tsx` monta as abas do aluno com essa função sobre `session.visible_tabs`. O resultado visível é Conteúdo, Conferência, Revisão 1, Revisão 2 e Revisão 3.

`buildQuestionTabDistribution` já coloca as questões `generalized` no bucket `desafio`. Elas existem na distribuição e não chegam à tela porque a aba foi removida antes. A tentativa não nasce, e o servidor não marca o passo.

## Ajuste

1. Em `resolveTabsFromIds`, aceitar `desafio` como as outras abas conhecidas. Tirar o `return` antecipado e o comentário que manda ignorar o id.
2. No player do aluno, esconder aba de questões com bucket vazio. `visible_tabs` sempre traz as seis abas; a partição é que decide se há questão. Sem esse filtro, todo conteúdo ganharia um Desafio vazio. O modo somente leitura já faz isso para as abas que exibe: mantém `treino` e só mostra aba de questões com `distribution[tab.id].length > 0`. O aluno precisa da mesma regra, agora incluindo `desafio`.
3. Conteúdo com `generalized`, como _O mundo microscópico_, passa a mostrar Desafio com essas questões. Conteúdo sem `generalized` continua sem a aba, e a API não exige a tentativa.

`handleComplete` já conclui a tentativa da aba atual antes do POST de progresso. Com Desafio na lista, essa aba pode ser a última. `allowedQuestionTabs` nasce de `visibleTabs`, então a tentativa `completed` passa a ser gravada.

A supervisão usa `AULA_TAB_IDS` (`treino` e `conf`) e não é a lista do player. Esse recorte permanece.

## Como conferir

- _O mundo microscópico_: a barra mostra Desafio depois da Revisão 3, com as questões `generalized`.
- Concluir essa tentativa leva o conteúdo a `status = completed` e `percent_complete = 100`.
- Conteúdo sem questão `generalized`: a aba Desafio não aparece, e o conteúdo conclui ao terminar os passos que existem.
