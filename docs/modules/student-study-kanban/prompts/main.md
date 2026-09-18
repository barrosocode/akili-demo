# student-study-kanban — regras para `/sdd-module` (front-end)

**Stack:** Next.js (`akili-site`). **API version:** `v1`.  
Contrato: `docs/tasks/kanban/contratos-api-v1.md`. Sem versão explícita → **aborte**.

Leia `docs/tasks/kanban/specs/03-kanban-e-player.md`.

## Obrigatório

- Quatro GETs `tasks?status=`. Default `page_size=50`. Paginação real (não só na UI).
- Componente compartilhado aluno (clicável) / responsável (`readOnly`).
- POST session do player **já existe**: acrescentar `metadata.study_task_uuid`. Envelope `{data}` só nesse write.
- Sem PATCH/POST/DELETE de task. Sem DnD persistente.
- Sem DPS no tipo `StudyTask`.
- Timezone Fortaleza para “hoje”.
- Sem migration, Pest, Playwright.

## Fora

Formulário de geração, settings, admin, app nativo.
