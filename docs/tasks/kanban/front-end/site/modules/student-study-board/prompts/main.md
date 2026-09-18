# student-study-board — regras para `/sdd-module` (front-end)

**Stack:** Next.js (`akili-site`). **API version:** `v1`.  
Contrato: `docs/tasks/kanban/contratos-api-v1.md` (ou `docs/tasks/kanban/front-end/contratos-api-v1.md` no api). Se a versão não estiver explícita, **aborte**.

Leia `docs/tasks/kanban/specs/01-quadro-do-aluno.md`.

## Obrigatório

- Só GET. Sem create/update/delete de board na UI.
- BFF extrai chave `board` / `study_plan`, não `{data}`.
- Empty state sem plano `applied`.
- Sem e-mail, sem DPS no JSON tipado.
- Sem migration, Eloquent, Pest, Playwright.

## Plano

Listar páginas, BFF routes, tipos, item de nav. Esperar OK.

## Fora

Kanban colunas (módulo `student-study-kanban`), inputs do responsável, admin.
