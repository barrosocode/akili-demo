# PROMPT — Orquestrar front-end site (sessão por card)

## PERSONA

Atue como engenheiro de software no `akili-site` (Kiddino: aluno, responsável, BFF Next.js). Implemente código de produção. Não crie testes automatizados. Não faça commit a menos que o usuário peça.

## CONTEXTO

A API v1 já devolve `session_kind` e `visible_tabs` e recusa attempt fora da sessão. Este recorte é **só o site**.

Leia **nesta ordem**:

1. [../00-roadmap.md](../00-roadmap.md)
2. Contrato **v1**: [../contratos-api-v1.md](../contratos-api-v1.md)
3. Specs `01` → `02` em [../specs/](../specs/)
4. Schema + `prompts/main.md` em `docs/modules/<modulo>/`

Se a versão da API não estiver explícita no contrato do workspace, **aborte**.

Writes de sessão: `{data}` — `unwrapData` serve.

Workspace pode ser só `akili-site`. Se as specs estiverem no `akili-api` (`docs/tasks/sessoes-por-card/front-end/site/`), leia de lá e **escreva código no site**. Não invente arquivos em `akili-admin` nem migrations na API.

## DECISÕES FECHADAS

- Uma spec / um `/sdd-module` por vez, ordem 01 → 02.
- Abas = `visible_tabs` da API. Sem `desafio`.
- Kanban manda `study_task_uuid`. Lista de materiais não inventa uuid.
- Guardian: zero writes.
- Sem testes, sem commit em `main`.

## TAREFA

Para cada módulo: espírito de `/sdd-module <nome>` — plano → esperar **OK** → código → relatório. Não gere Pest/Playwright.

| Spec | `/sdd-module` | Schema |
|---|---|---|
| 01 | `student-player-session-scope` | `docs/modules/student-player-session-scope/` |
| 02 | `student-kanban-player-scope` | `docs/modules/student-kanban-player-scope/` |

### Spec 01 — Player

Filtrar abas, GET current com query, progresso isolado. [../specs/01-player-por-card.md](../specs/01-player-por-card.md).

### Spec 02 — Kanban

Clique do card → player com uuid. [../specs/02-kanban-abre-sessao.md](../specs/02-kanban-abre-sessao.md).

## FORA DE ESCOPO

- Endpoints novos na API (se o contrato faltar de verdade — **pare** e registre).
- UI de professor. DnD. Aba desafio.
- Commit em `main`.

## CRITÉRIO DE PRONTO

- Specs 01–02 implementadas (ou bloqueio: workspace sem site / Kanban ainda não portado).
- Relatório por spec e por módulo.
- Aula e revisão no mesmo conteúdo abrem UIs diferentes; POST session leva o uuid do card.
