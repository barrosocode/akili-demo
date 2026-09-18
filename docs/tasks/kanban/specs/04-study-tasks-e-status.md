# Spec 04 — Cards e status automático

**Módulo SDD:** `/sdd-module study-tasks`  
**Schema:** `docs/modules/study-tasks/schema/study_tasks.json`  
**Prompt:** `docs/modules/study-tasks/prompts/main.md`

Se a spec 03 já criou a tabela `study_tasks`, esta spec **não** gera CREATE duplicado: só hooks, job, listagem por coluna e contrato.

## Objetivo

Expor o Kanban e mover cards **sem** PATCH de status pelo cliente.

## Tabela `study_tasks`

Campos relevantes:

- FKs: tenant, board, student, study_plan, subject, module_topic, content (obrigatório), origin_task (revisão)
- `kind` `new_content|review_r1|review_r2|review_r3`
- `name`, `status` `backlog|todo|doing|done`
- `scheduled_on` date, `scheduled_start`/`scheduled_end` time null
- `duration_minutes`, `compacted_review`, `is_weekend`, `position`
- `source` sempre `system`
- `learning_session_id` null
- `started_at`, `completed_at`
- unique parcial sugerido: um `new_content` vivo por `(student_id, content_id)` (índice unique onde `kind = new_content` e `deleted_at IS NULL` e `status != done` — ou aceitar um por plano e filtrar na regen)
- índices: `(board_id, status, position)`, `(student_id, scheduled_on)`, `(content_id, student_id)`

Sem `recurrence`, sem `urgency_level`, sem delete/create HTTP.

## Listagem

`GET .../board/tasks?status=&scheduled_on=&kind=&page=&page_size=`

Rotas:

- aluno: `/api/v1/mobile/student/board/tasks`
- responsável: `/api/v1/guardian/students/{student}/board/tasks`
- professor: `/api/v1/teacher/students/{student}/board/tasks`

Envelope: chave `tasks`, pagination obrigatória. Default `page_size` 50, max 100. Front filtra por `status` para montar as quatro colunas.

Promoção lazy: no GET, cards `backlog` com `scheduled_on = hoje` (timezone da app, `America/Fortaleza`) passam a `todo` antes de listar.

## Job

`PromoteStudyTasksToTodoJob` diário 00:05. Mesma regra da promoção lazy.

## Sync com aprendizagem

Em `Upsert`/`Create` de `learning_sessions` e no completar:

| Sessão | Card |
|---|---|
| `started` / `in_progress` | `doing` + `started_at` + `learning_session_id` |
| `completed` | `done` + `completed_at` |
| `abandoned` | permanece `doing` |

Resolução do card:

1. `metadata.study_task_uuid` se válido e do mesmo aluno.
2. Senão: `todo` ou `doing` do par `(student_id, content_id)` com `scheduled_on = hoje`.
3. Senão: `new_content` em `backlog`/`todo` daquele conteúdo.

Documentar no contrato mobile: o player, quando aberto a partir do Kanban, **deve** enviar `study_task_uuid` no metadata da sessão. Sem isso revisões do mesmo `content_id` no mesmo dia podem colidir.

Fallback extra para conteúdo novo: se `student_content_progress` virar `completed` e existir card `new_content` não `done`, marcar `done` (cobre checkpoint sem sessão completed).

## O que o cliente NÃO pode

- POST/PATCH/DELETE de task
- `move` estilo personal-planner
- alterar `scheduled_on`

## Fora

UI do quadro (fase 5, outros repos). Comentários. Checklist.
