# Spec 01 — Mostrar o Desafio no player

**Repo:** `akili-site`  
**Referência:** [ajuste-aba-desafio.md](../reference/ajuste-aba-desafio.md)  
**Contrato da API:** nenhum. A sessão já devolve `desafio` em `visible_tabs`.  
**Entrega:** a aba **Desafio** no player do aluno quando a versão tem questão `generalized`, e o conteúdo chega a 100% ao concluir essa tentativa.

Em _O mundo microscópico_ o player para na Revisão 3. Conteúdo, conferência e as três revisões são 5 de 6 passos: `round(5 / 6 × 100) = 83`. O passo que falta é o Desafio. As 14 questões `generalized` dessa versão já caem no bucket `desafio`; a aba é removida antes de chegar na tela, a tentativa não nasce e o servidor não marca o passo.

---

## Decisões fechadas

- A API não muda. O BFF não muda. `visible_tabs` de uma sessão nova já vem assim: `treino`, `conf`, `r1`, `r2`, `r3`, `desafio`.
- `desafio` entra na lista do player com o mesmo tratamento das outras abas conhecidas: ordem da sessão, primeira ocorrência, id desconhecido fora.
- A aba de questões só aparece com questão no bucket. `visible_tabs` traz as seis abas mesmo quando não há `generalized`; sem esse filtro todo conteúdo ganharia um Desafio vazio.
- A regra é a mesma para toda aba de questões, no aluno e na supervisão: **Conteúdo** (`treino`) permanece; `conf`, `r1`, `r2`, `r3` e `desafio` só entram com `distribution[id].length > 0`.
- Supervisão continua limitada a `AULA_TAB_IDS` (`treino` e `conf`) antes do filtro. `desafio` não entra nessa lista.
- Rótulo, título e subtítulo da aba já existem em `LESSON_TAB_META.desafio`: **Desafio**, “generalização — aprofundam e testam o raciocínio”. Nada de copy nova.
- `uuid` de questão, tentativa e sessão continua fora da tela. A barra mostra o rótulo **Desafio**.

---

## 1. O que já está pronto

| Peça | Estado |
| --- | --- |
| `LessonTabId` e `ActivityTabId` | Já incluem `desafio`. |
| `LESSON_TAB_META.desafio` | Rótulo **Desafio** e textos da etapa prontos. |
| `isQuestionTabId` | Tudo que não é `treino` já é aba de questões, inclusive `desafio`. |
| `buildQuestionTabDistribution` | Questão `question_type === "generalized"` já vai para `desafio`. `memorization` segue em `conf`, `r1`, `r2` e `r3`. Questão sem esses dois tipos continua em `conf`. |
| `handleComplete` | Já conclui a tentativa da aba atual (`status: "completed"`) e depois faz o POST de progresso com `mark_completed`. |
| `allowedQuestionTabs` | Nasce de `visibleTabs`. Com **Desafio** nessa lista, abrir a aba dispara `ensureAttempt` e a resposta grava na tentativa. |
| Supervisão | `readOnly` monta as abas com `AULA_TAB_IDS` e já esconde aba de questões com bucket vazio. |

O furo está em dois pontos:

1. `resolveTabsFromIds` descarta `desafio` de propósito (`raw === "desafio"`), com o comentário de que o id fica fora do recorte mesmo se a API enviar.
2. No aluno, `visibleTabs` devolve o resultado de `resolveTabsFromIds(session.visible_tabs)` sem olhar o tamanho do bucket. A supervisão já filtra; o aluno ainda não.

---

## 2. O que entra nesta entrega

| Peça | Papel |
| --- | --- |
| `features/content-player/lib/lesson-utils.ts` | `resolveTabsFromIds` passa a aceitar `desafio`. Função pura nova para esconder aba de questões com bucket vazio. |
| `features/content-player/components/student-lesson-player.tsx` | Aluno e supervisão usam essa função depois de resolver os ids. |
| Teste unitário de `lesson-utils` | Cobre a resolução dos ids e o filtro de bucket vazio. |

Fora desta entrega:

- Endpoint, tipo de `LearningSession` e route handler da sessão.
- `buildQuestionTabDistribution`, `AULA_TAB_IDS` e `LESSON_TAB_META`.
- Novo botão, novo diálogo ou mudança no fluxo de `handleComplete`, `ensureAttempt` e `persistProgress`.
- Colocar `desafio` na supervisão.
- Reordenar abas no cliente. A ordem continua a de `visible_tabs`.

---

## 3. `resolveTabsFromIds`

Arquivo: `features/content-player/lib/lesson-utils.ts`.

Tirar o `return` antecipado de `raw === "desafio"` e o comentário que manda ignorar o id. O comentário que resta descreve a função como está: a lista vem da sessão, ids conhecidos entram na ordem recebida, repetido não entra de novo, id fora de `LessonTabId` fica de fora.

`desafio` já passa em `isLessonTabId` porque está em `LESSON_TAB_META`. Depois da retirada, o `forEach` atual basta:

- `["treino", "conf", "r1", "r2", "r3", "desafio"]` devolve seis metas, a última com `id: "desafio"` e `label: "Desafio"`.
- `desafio` repetido aparece uma vez, na primeira posição em que veio.
- Id desconhecido continua de fora e não desloca os demais.

`AULA_TAB_IDS` permanece `["treino", "conf"]`.

---

## 4. Aba de questões com bucket vazio

Ainda em `lesson-utils.ts`, uma função pura, sem I/O, usada pelos dois ramos do player. Nome sugerido: `omitEmptyQuestionTabs`.

Entrada: as metas já resolvidas e a `QuestionTabDistribution`. Saída: nova lista, mesma ordem.

- `treino` permanece, mesmo com página vazia.
- Aba de questões permanece só quando `distribution[tab.id].length > 0`.
- Bucket vazio sai da lista. Isso vale para `conf`, `r1`, `r2`, `r3` e `desafio`.

Em `student-lesson-player.tsx`, `visibleTabs` fica assim:

1. Supervisão (`readOnly`): `resolveTabsFromIds(AULA_TAB_IDS)`, depois `omitEmptyQuestionTabs`. O filtro que hoje está inline nesse ramo sai de lá e passa a ser a função compartilhada.
2. Aluno sem sessão carregada: lista vazia, como hoje.
3. Aluno com sessão cujo `visible_tabs` não é array: `resolveTabsFromIds(AULA_TAB_IDS)`, depois o mesmo filtro.
4. Aluno com `visible_tabs`: `resolveTabsFromIds(session.visible_tabs)`, depois o mesmo filtro.

`distribution` já é dependência do `useMemo`. O filtro lê essa partição; não recalcula questão.

Efeito em cadeia, sem ramo novo para `desafio`:

- `allowedQuestionTabs` só inclui aba visível. Bucket vazio não abre tentativa.
- `computeProgressPercent` usa `visibleTabIds`. O denominador é a quantidade de abas que sobraram. Aba escondida não entra na conta e não conta como passo concluído.
- `metadata.visible_tabs` no POST de progresso continua sendo essa lista visível.
- A barra (`role="tablist"`) renderiza `tab.label`. **Desafio** aparece depois da Revisão 3 quando a sessão manda os seis ids e o bucket tem questão.
- `LessonQuestionsTab` recebe `distribution.desafio` e os textos que já estão na meta.

Conteúdo com `generalized`: a barra mostra **Desafio** com essas questões. Conteúdo sem `generalized`: o bucket fica vazio, a aba não entra, e concluir os passos visíveis fecha o material.

---

## 5. Conclusão do passo

Nenhuma função nova de tentativa.

Com **Desafio** visível e sendo a última aba, o botão da última etapa continua **Concluir material** (`lessonSession`). `handleComplete` já exige todas as abas visíveis respondidas, espera `completeAttemptIfReady` da aba atual e só então envia o progresso com `mark_completed`. A tentativa `completed` de `desafio` passa a existir porque a aba está em `allowedQuestionTabs`.

Abrir a aba continua chamando `ensureAttempt`. Trocar de aba continua concluindo a tentativa anterior quando as questões dela já foram respondidas.

Sessão que não é aula (`review_r1`, `review_r2`, `review_r3`) segue a mesma regra: **Desafio** aparece se o id vier em `visible_tabs` e o bucket tiver questão. O cliente não inventa a aba.

---

## 6. Critério de aceite

- `resolveTabsFromIds` com `["treino", "conf", "r1", "r2", "r3", "desafio"]` devolve as seis abas, na mesma ordem, rótulo **Desafio** na última.
- Id desconhecido e `desafio` duplicado não geram aba extra.
- _O mundo microscópico_, sessão nova: a barra mostra **Conteúdo**, **Conferência**, **Revisão 1**, **Revisão 2**, **Revisão 3** e **Desafio**. **Desafio** lista as questões `generalized`.
- Concluir essa tentativa grava `status: "completed"` na tentativa e o progresso do conteúdo fica `status = completed` com `percent_complete = 100`.
- Conteúdo sem questão `generalized`: **Desafio** não aparece. Concluir os passos visíveis fecha o conteúdo. Nenhuma tentativa de Desafio é iniciada.
- Aba de questões com bucket vazio (`r1`, `r2`, `r3`, `conf` ou `desafio`) não aparece para o aluno.
- Supervisão do mesmo conteúdo: só **Conteúdo** e, se houver questão em `conf`, **Conferência**. Sem **Desafio**, sem revisão.
- A tela não mostra uuid de questão, tentativa ou sessão.
- Teste unitário de `resolveTabsFromIds` (seis ids, duplicata, id desconhecido) e de `omitEmptyQuestionTabs` (`treino` sempre, `desafio` só com item no bucket, revisão vazia de fora).
