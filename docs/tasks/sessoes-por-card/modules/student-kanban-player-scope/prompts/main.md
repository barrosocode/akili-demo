# student-kanban-player-scope — regras para `/sdd-module` (front-end)

**Stack:** Next.js (`akili-site`). **API version:** `v1`.  
Contrato: `docs/tasks/sessoes-por-card/contratos-api-v1.md`. Sem versão explícita → **aborte**.

Leia `docs/tasks/sessoes-por-card/specs/02-kanban-abre-sessao.md`.

## Obrigatório

- Não reconstruir as quatro colunas se o módulo `student-study-kanban` já existir: só o clique.
- Navegação: `content_uuid` + query `study_task_uuid` e `kind`.
- Aluno: o player (spec 01) envia o uuid no POST session.
- Guardian: readOnly, zero POST session.
- Sem PATCH/POST/DELETE de task. Sem DnD. Sem Pest/Playwright.
- Se o Kanban ainda não estiver no site: registrar bloqueio; não inventar o quadro nesta spec.

## Fora

Gerador de plano. Admin. Player (spec 01).
