# PROMPT — Orquestrar front-end site (Kanban de estudos)

## PERSONA

Atue como engenheiro de software no `akili-site` (Kiddino: aluno, responsável, BFF Next.js). Implemente código de produção. Não crie testes automatizados. Não faça commit a menos que o usuário peça.

## CONTEXTO

A API v1 já expõe board, inputs, gerador e tasks. Este recorte é **só o site**.

Leia **nesta ordem**:

1. [../00-roadmap.md](../00-roadmap.md)
2. Contrato **v1**: [../contratos-api-v1.md](../contratos-api-v1.md)
3. Specs `01` → `03` em [../specs/](../specs/)
4. Schema + `prompts/main.md` em `docs/modules/<modulo>/`

Se a versão da API não estiver explícita no contrato do workspace, **aborte** e peça o arquivo.

Envelope destas leituras: `status`, `message`, `errors`, chave de recurso, `pagination`, `error_code`. **Não** usar `unwrapData` cego (`{data}`). Writes de sessão do player continuam `{data}`.

Workspace desta conversa pode ser só `akili-site`. Se as specs estiverem no `akili-api` (`docs/tasks/kanban/front-end/site/`), leia de lá e **escreva código no site**. Não invente arquivos em `akili-admin` nem migrations na API.

## DECISÕES FECHADAS

- Uma spec / um `/sdd-module` por vez, ordem 01 → 02 → 03.
- Colunas: `backlog` / `todo` / `doing` / `done`. Sem PATCH de status.
- Quem gera: **responsável**. Aluno só estuda. Professor não está neste repo.
- Card = tópico ou revisão. Clique do aluno abre o player com `study_task_uuid`.
- DPS só no form de settings do responsável; nunca `localStorage`.
- Regen = mesmo POST; UI não escolhe modo 5B.
- Sem testes, sem commit em `main`.

## TAREFA

Para cada módulo: espírito de `/sdd-module <nome>` — plano (arquivos, BFF, páginas, LGPD) → esperar **OK** → código → relatório. Não gere Pest/Playwright.

| Spec | `/sdd-module` | Schema |
|---|---|---|
| 01 | `student-study-board` | `docs/modules/student-study-board/` |
| 02 | `guardian-study-planner` | `docs/modules/guardian-study-planner/` |
| 03 | `student-study-kanban` | `docs/modules/student-study-kanban/` |

### Spec 01 — Quadro do aluno

Rota, BFF `board` + `study-plans/current`, empty state. [../specs/01-quadro-do-aluno.md](../specs/01-quadro-do-aluno.md).

### Spec 02 — Plano do responsável

Inputs + POST 202 + poll + warnings. [../specs/02-plano-do-responsavel.md](../specs/02-plano-do-responsavel.md).

### Spec 03 — Kanban e player

Quatro colunas + `study_task_uuid`. Guardian reusa o board read-only. [../specs/03-kanban-e-player.md](../specs/03-kanban-e-player.md).

## FORA DE ESCOPO (recusar deriva)

- Endpoints novos na API (exceto se o contrato faltar de verdade — aí **pare** e registre).
- UI de professor.
- Drag-and-drop que persiste.
- Commit em `main`.

## CRITÉRIO DE PRONTO DO ORQUESTRADOR

- Specs 01–03 implementadas (ou bloqueio: workspace sem site, contrato v1 ausente).
- Relatório por spec e por módulo.
- Aluno vê colunas; clique grava sessão com `study_task_uuid`; responsável gera e vê warnings; DPS não vazam no Kanban.
