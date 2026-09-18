# Spec 01 — Player filtra abas pela sessão

**Repo:** `akili-site`  
**Módulo SDD:** `/sdd-module student-player-session-scope`  
**Schema:** `docs/modules/student-player-session-scope/schema/student-player-session-scope.json`  
**API:** v1 — [contratos-api-v1.md](../contratos-api-v1.md)  
**Depende de:** API specs 01–02 deste recorte no ar.

O player já instrumenta sessão/attempt/response (gamificação). Esta spec **restringe** o que aparece.

---

## Decisões fechadas

- Fonte das abas: `session.visible_tabs`, não constante local.
- Lista de materiais: POST session **sem** `study_task_uuid` → `new_content` (`treino`+`conf`).
- `desafio` não entra.
- Guardian / `readOnly`: zero writes; se a supervisão hoje mostra todas as abas, filtrar igual (só leitura das abas da aula, sem criar sessão de revisão).
- Sem testes automatizados.

---

## 1. Tipos

Estender o tipo de sessão (`types/student-learning.ts` ou equivalente):

- `session_kind: 'new_content' | 'review_r1' | 'review_r2' | 'review_r3'`
- `visible_tabs: string[]`
- `study_task_uuid: string | null`

Não calcular abas por `question_type` quando a sessão já veio.

---

## 2. BFF

Rotas **já existem**. Delta:

| BFF | Query / body |
|---|---|
| `POST /api/student/contents/[uuid]/sessions` | encaminhar `study_task_uuid` |
| `GET /api/student/contents/[uuid]/sessions/current` | encaminhar `study_task_uuid` e `session_kind` |

Envelope `{data}` intacto.

---

## 3. Player

Arquivos de referência (gamificação): `features/content-player/components/student-lesson-player.tsx`, `lesson-questions-tab.tsx`, `lesson-utils.ts`.

Load:

1. Playback (já existe).
2. POST session com `content_version_uuid` e, se a URL/estado tiver, `study_task_uuid`.
3. Guardar `visible_tabs`. Montar só essas etapas (treino = `pages`; demais = abas de questão).
4. GET current no reload com a **mesma** query de card, senão retoma a aula e perde a revisão.

Attempt: só ao entrar numa aba que está em `visible_tabs` e não é `treino`.

Concluir:

- Aula: checkpoint de progresso das etapas `treino`+`conf`; depois `PATCH session` `completed`.
- Revisão: **não** `mark_completed` no conteúdo; `PATCH session` `completed` ao terminar a aba.

Empty: se `visible_tabs` vier vazio, não inventar abas; mostrar erro e não POST attempt.

---

## 4. Critério de aceite

- Abrir aula: UI sem R1/R2/R3/desafio.
- Abrir R1 (com uuid): só revisão 1; POST attempt `r1`.
- Reload na revisão: GET current com `study_task_uuid`; não hidratar respostas de `conf`.
- Lista de materiais: só treino+conf.
- Supervisão: sem POST.
- Relatório `docs/tasks/sessoes-por-card/reports/YYYY-MM-DD_spec-01.md` (ou no módulo).
