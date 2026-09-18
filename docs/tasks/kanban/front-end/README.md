# Front-end — Kanban de estudos do aluno

A API (`akili-api`) **já entregou** as specs 01–04 (board, inputs, gerador, cards). Esta pasta é o recorte de **execução nos fronts**.

A documentação em `docs/tasks/kanban/specs/` **não basta** para `/sdd-module` no site/admin: ela descreve tabelas Laravel, não páginas, BFF, envelope nem LGPD de UI. Use **esta pasta**.

Duas pastas independentes, mesma estrutura da pasta-mãe (`00-roadmap.md`, `specs/`, `prompts/`, `modules/`):

| Pasta | Repo | Ordem | Prompt |
|---|---|---|---|
| [site/](site/00-roadmap.md) | `akili-site` | quadro do aluno → plano do responsável → Kanban + player | [site/prompts/00-orquestrar-execucao.md](site/prompts/00-orquestrar-execucao.md) |
| [admin/](admin/00-roadmap.md) | `akili-admin` | quadro read-only do professor | [admin/prompts/00-orquestrar-execucao.md](admin/prompts/00-orquestrar-execucao.md) |

Não misture os dois repos no mesmo prompt. Professor **não** entra no site; aluno e família B2C **não** entram no admin.

Contrato HTTP congelado (API **v1**): [contratos-api-v1.md](contratos-api-v1.md). Sem esse arquivo o `/sdd-module` de front **deve abortar**.

---

## A documentação antiga não serve para o front

| Artefato | Serve para UI? |
|---|---|
| `docs/tasks/kanban/specs/01`–`04` | Não. São backend (migrations, jobs, hooks). |
| `docs/modules/*/schema/*.json` | Não. São tabelas Postgres. |
| Relatórios `2026-09-17_report.md` | Parcial. Têm exemplos JSON, mas espalhados e sem BFF/páginas. |
| `reference_documentation/` (personal-planner) | **Não copiar.** Tem share, CRUD e drag-and-drop — proibidos na Akili. |

---

## Como copiar e executar

### `akili-site`

A partir da raiz deste repositório (`akili-api`):

```bash
SITE=../akili-site   # ajuste o path

mkdir -p "$SITE/docs/tasks/kanban" "$SITE/docs/modules"

cp docs/tasks/kanban/front-end/site/00-roadmap.md "$SITE/docs/tasks/kanban/"
cp docs/tasks/kanban/front-end/site/contratos-api-v1.md "$SITE/docs/tasks/kanban/"
cp -R docs/tasks/kanban/front-end/site/specs "$SITE/docs/tasks/kanban/"
cp -R docs/tasks/kanban/front-end/site/prompts "$SITE/docs/tasks/kanban/"
cp -R docs/tasks/kanban/front-end/site/modules/* "$SITE/docs/modules/"
```

No workspace **só** `akili-site`, na ordem:

1. `/sdd-module student-study-board`
2. `/sdd-module guardian-study-planner`
3. `/sdd-module student-study-kanban`

Uma spec por vez. Espere o plano e só gere código com **OK**.

Alternativa: cole [site/prompts/00-orquestrar-execucao.md](site/prompts/00-orquestrar-execucao.md) e deixe o orquestrador chamar o espírito do `/sdd-module`.

### `akili-admin`

```bash
ADMIN=../akili-admin   # ajuste o path

mkdir -p "$ADMIN/docs/tasks/kanban" "$ADMIN/docs/modules"

cp docs/tasks/kanban/front-end/admin/00-roadmap.md "$ADMIN/docs/tasks/kanban/"
cp docs/tasks/kanban/front-end/admin/contratos-api-v1.md "$ADMIN/docs/tasks/kanban/"
cp -R docs/tasks/kanban/front-end/admin/specs "$ADMIN/docs/tasks/kanban/"
cp -R docs/tasks/kanban/front-end/admin/prompts "$ADMIN/docs/tasks/kanban/"
cp -R docs/tasks/kanban/front-end/admin/modules/* "$ADMIN/docs/modules/"
```

No workspace **só** `akili-admin`: `/sdd-module teacher-study-board`.

---

## Regras que o `/sdd-module` de front não pode ignorar

- Stack **Next.js**. Sem migration, model Eloquent, Policy Laravel, Pest.
- API version **explícita**: `v1` (`/api/v1/...`). Se o contrato não estiver no workspace, **aborte**.
- Envelope: `status`, `message`, `errors`, chave de recurso (`board` / `boards` / `tasks` / `study_setting` / `study_plan` / `study_plans` / `availability_slots` / `school_schedule_slots`), `pagination`, `error_code`. **Nunca** chave `data` nestas rotas.
- Listas **paginadas**. Kanban: `page_size` default **50**.
- Sem POST/PATCH/DELETE de card. Sem drag-and-drop que chame API. Sem vários boards. Sem comentários.
- DPS (`tdah_adjustment`, `on_medication`): só no formulário do responsável; nunca `localStorage` / `sessionStorage`; nunca no Kanban do aluno ou do professor.
- Sem testes automatizados (QA). Sem commit autônomo.

---

## Fora

App mobile nativo, LLM, cards manuais, share por e-mail, KPI de atraso (é outro recorte), gamificação.
