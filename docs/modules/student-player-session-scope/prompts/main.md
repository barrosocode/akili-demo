# student-player-session-scope — regras para `/sdd-module` (front-end)

**Stack:** Next.js (`akili-site`). **API version:** `v1`.  
Contrato: `docs/tasks/sessoes-por-card/contratos-api-v1.md`. Sem versão explícita → **aborte**.

Leia `docs/tasks/sessoes-por-card/specs/01-player-por-card.md`.

## Obrigatório

- Abas do player = `session.visible_tabs`. Proibido constante `["treino","conf","r1","r2","r3","desafio"]`.
- POST/GET session encaminham `study_task_uuid`. Reload usa a mesma query.
- Lista de materiais: sem uuid → aula (`treino`+`conf`).
- Revisão: não `mark_completed` no conteúdo.
- Guardian `readOnly`: zero writes.
- Sem migration, Pest, Playwright. Sem DPS em localStorage.

## Fora

Kanban (spec 02). Admin. Aba desafio. Endpoints novos na API.
