# guardian-study-planner — regras para `/sdd-module` (front-end)

**Stack:** Next.js (`akili-site`). **API version:** `v1`.  
Contrato: `docs/tasks/kanban/contratos-api-v1.md`. Sem versão explícita → **aborte**.

Leia `docs/tasks/kanban/specs/02-plano-do-responsavel.md`.

## Obrigatório

- Persona **guardian** apenas. Gate de progresso do filho já existente.
- PUT settings com DPS: só nesta tela; `autocomplete="off"`; nunca `localStorage`.
- PUT slots substitui o conjunto. Overlap = 422 da API.
- POST generate 202 + poll. E006 no campo tópicos. 409 não reenvia.
- Warnings no recurso `study_plan.warnings`, não em `error_code` (exceto E006 / STUDY_PLAN_GENERATING).
- Picker de tópicos/disciplinas: `GET learning` legado `{data}` + `materials[]`.
- Sem migration, Pest, Playwright. Sem endpoints novos na API.

## Fora

Kanban clicável do aluno, player writes, admin.
