# teacher-study-board — regras para `/sdd-module` (front-end)

**Stack:** Next.js / TailAdmin (`akili-admin`). **API version:** `v1`.  
Contrato: `docs/tasks/kanban/contratos-api-v1.md`. Sem versão explícita → **aborte**.

Leia `docs/tasks/kanban/specs/01-quadro-do-professor.md`.

## Obrigatório

- Read-only. Helper de envelope por chave (`board`, `tasks`, `study_plan`).
- Quatro colunas, `page_size=50`. Sem PATCH/POST.
- Sem DPS, sem player, sem gerar plano.
- Sem migration, Pest, Playwright, Cypress.

## Fora

`akili-site`, Content Studio, hub guardian do admin.
