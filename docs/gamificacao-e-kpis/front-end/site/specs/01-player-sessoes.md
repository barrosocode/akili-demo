# Spec 01 — Instrumentação do player web

**Repo:** `akili-site` (BFF + player)  
**Depende de:** API spec 02 já no ar (`/mobile/student/.../sessions|attempts|responses`, envelope `{data}`). UUID no playback se o backfill da API rodou.  
**Desbloqueia:** specs 02 e 03 desta pasta (senão os KPIs nascem vazios).

O player hoje calcula acerto na aba e **não envia**. POST `/api/student/contents/[uuid]/progress` só manda percent de etapas, delta de tempo de tela e `active_tab`.

---

## Decisões fechadas

- Abrir sessão no **load** do playback (não no Continuar).
- Abrir attempt ao **entrar** numa aba de questões.
- Gravar response no **clique** da alternativa (não só no Continuar).
- Shuffle reproduzível com `shuffle_seed` da sessão. Reload não reembaralha.
- Chavear respostas por `question.uuid`, nunca só por índice da aba.
- Cronômetro por questão: inicia no primeiro render visível da questão; para no clique. Enviar `response_time_ms`.
- Continuar/Concluir **continuam** chamando o checkpoint de progresso.
- Guardian `readOnly` / rota `/aluno/supervisao/...`: zero writes de sessão/response.
- Sem fila offline. POST da response falhou → não marcar como respondida; retry com o mesmo `event_uuid`.
- Writes Laravel usam `{data}` — `studentLaravelRequest` + `unwrapData` atuais servem.
- Sem testes automatizados.

---

## 1. Tipos

Arquivo: `types/student-learning.ts`

Estender `ContentQuestion`:

- `uuid: string`
- `expected_time?: number`
- `difficulty_id?: string`
- `options[].uuid: string`

Novos tipos para session / attempt / response alinhados ao payload da API (ver relatório `2026-09-11_spec-02` no `akili-api`):

- sessão: `uuid`, `status`, `shuffle_seed`, `content_version_uuid`, `attempts[]`, `responses[]` resumidas
- response resumida: `question_uuid`, `selected_option_uuid`, `is_correct`, `sequence_in_session`, `tab_id`

Separar: `percent_complete` = conclusão de etapas; acerto da aba = UI local + fato persistido. Não enviar acerto como percent do checkpoint.

---

## 2. BFF

Espelhar Laravel, mesmo padrão de `app/api/student/contents/[contentUuid]/progress/route.ts` (`studentLaravelRequest`).

| BFF | Laravel |
|---|---|
| `POST /api/student/contents/[uuid]/sessions` | `POST /mobile/student/contents/{uuid}/sessions` |
| `GET /api/student/contents/[uuid]/sessions/current` | `GET .../sessions/current` |
| `PATCH /api/student/sessions/[uuid]` | `PATCH /mobile/student/sessions/{uuid}` |
| `POST /api/student/sessions/[uuid]/attempts` | `POST .../attempts` |
| `PATCH /api/student/attempts/[uuid]` | `PATCH .../attempts/{uuid}` |
| `POST /api/student/attempts/[uuid]/responses` | `POST .../responses` |

Body do POST session: `{ "content_version_uuid": "..." }`.  
Body do POST attempt: `{ "tab_id": "conf" }` (`conf|r1|r2|r3|desafio`).  
Body do POST response: `event_uuid`, `question_uuid`, `selected_option_uuid`, `response_time_ms`, `sequence_in_attempt`, `sequence_in_session`, `hint_used`, `attempted_at`.

Hooks em `features/student/hooks/use-student-materials.ts` ou `use-student-learning-session.ts` novo. Invalidar só o content atual — não refetch do playback inteiro a cada clique.

---

## 3. Player

Arquivos:

- `features/content-player/components/student-lesson-player.tsx`
- `features/content-player/components/lesson-questions-tab.tsx`
- `features/content-player/lib/lesson-utils.ts`

### Load

1. Fetch playback (já existe).
2. `POST sessions` com `content_version_uuid`.
3. Guardar `session.uuid` e `shuffle_seed`.
4. Hidratar respostas (mapa `question_uuid → option_uuid`).
5. Distribuir questões com seed — **não** chamar `Math.random()` solto.

### Shuffle com seed

Substituir `shuffleArray` / `distributeEvenly` por variantes seeded (ex. mulberry32 + Fisher–Yates). `buildQuestionTabDistribution(questions, seed)` determinístico.

Ordenar por `uuid` **antes** do shuffle para o input não depender da ordem do JSON.

### Tentativa por aba

Ao selecionar `conf|r1|r2|r3|desafio`: `POST attempts` com `tab_id`. Guardar `attempt.uuid`.

Ao sair da aba com todas as questões persistidas/hidratadas: `PATCH attempt` `completed`. Não bloquear navegação se o PATCH falhar; retry silencioso.

Aba `treino` não gera attempt.

### Clique

Hoje: `answersByTab[tab][questionIndex] = optionIndex`.

Novo:

1. `event_uuid` (uuid v4) **uma vez** por par questão+tentativa.
2. `sequence_in_attempt` = respondidas na aba + 1.
3. `sequence_in_session` = hidratadas + novas + 1.
4. POST response.
5. Só então desabilitar botão e pintar certo/errado. Feedback local pode usar `options[].is_correct`; a fonte de verdade é a API.
6. Falha: botões habilitados + erro da questão.

`lesson-questions-tab.tsx`: `key` = `question.uuid`. `onAnswer(questionUuid, optionUuid)`.

### Cronômetro

Por `question.uuid`: `startedAt = performance.now()` no mount visível. `response_time_ms = round(now - startedAt)`, mín. 0. Não usar `consumeTimeDelta()` (só tempo de tela do checkpoint).

`expected_time` no tipo; UI do tempo esperado **não** é obrigatória.

### Continuar / Concluir

Manter `persistProgress` (`percent_complete` = abas concluídas / visíveis). Aba completa = todas as questões da distribuição têm response persistida ou hidratada.

Na última aba, após checkpoint com `mark_completed`, `PATCH session` `completed`.

### Reset

O `useEffect` que zera `answersByTab` em `contentUuid` espera a sessão antes de limpar hidratadas. Evitar flash vazio → preenchido.

---

## 4. Superfícies que só leem

`student-dashboard-view.tsx` e `student-materials-list.tsx` **não** mostram taxa de acerto nesta spec. Frequência é a spec 02.

---

## 5. Critério de aceite

- Recarregar a aula: mesmas questões nas mesmas abas; alternativas já respondidas desabilitadas.
- Clique → Network POST response com `question_uuid` e `response_time_ms`; linha no banco.
- Continuar ainda salva o checkpoint.
- Supervisão / `readOnly`: nenhum POST de session/attempt/response.
- Falha de rede: retry com o mesmo `event_uuid`.
- Sem testes automatizados.

## 6. Relatório

`front-end/site/reports/YYYY-MM-DD_spec-01.md` (workspace api) **ou** `docs/tasks/gameficacao-e-kpis/reports/` no `akili-site`. Fluxo manual de QA e arquivos do BFF.
