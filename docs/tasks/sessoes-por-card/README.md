# Front-end — sessão por card (player + Kanban)

A API deste recorte (`akili-api`, specs 01–02) precisa estar no ar: `session_kind`, `visible_tabs`, `study_task_uuid` no payload da sessão, GET current com query, attempt 422 fora das abas.

Esta pasta é o recorte de **execução no `akili-site`**. Não toque em `akili-admin`. Professor não abre sessão.

A documentação Laravel em `docs/tasks/sessoes-por-card/specs/` **não basta** para `/sdd-module` no site: ela descreve ALTER e Actions. Use **esta pasta**.

| Pasta | Repo | Ordem | Prompt |
|---|---|---|---|
| [site/](site/00-roadmap.md) | `akili-site` | player por card → clique do Kanban | [site/prompts/00-orquestrar-execucao.md](site/prompts/00-orquestrar-execucao.md) |

Contrato HTTP: [site/contratos-api-v1.md](site/contratos-api-v1.md). Sem esse arquivo no workspace do site, `/sdd-module` de front **deve abortar**.

---

## Como copiar e executar

A partir da raiz deste repositório (`akili-api`):

```bash
SITE=../akili-site   # ajuste o path

mkdir -p "$SITE/docs/tasks/sessoes-por-card" "$SITE/docs/modules"

cp docs/tasks/sessoes-por-card/front-end/site/00-roadmap.md "$SITE/docs/tasks/sessoes-por-card/"
cp docs/tasks/sessoes-por-card/front-end/site/contratos-api-v1.md "$SITE/docs/tasks/sessoes-por-card/"
cp -R docs/tasks/sessoes-por-card/front-end/site/specs "$SITE/docs/tasks/sessoes-por-card/"
cp -R docs/tasks/sessoes-por-card/front-end/site/prompts "$SITE/docs/tasks/sessoes-por-card/"
cp -R docs/tasks/sessoes-por-card/front-end/site/modules/* "$SITE/docs/modules/"
```

No workspace **só** `akili-site`, na ordem:

1. `/sdd-module student-player-session-scope`
2. `/sdd-module student-kanban-player-scope`

Uma spec por vez. Espere o plano e só gere código com **OK**.

---

## Regras que o `/sdd-module` de front não pode ignorar

- Stack **Next.js**. Sem migration, Eloquent, Pest, Playwright.
- API version **explícita**: `v1`. Writes de sessão: envelope legado `{data}` (`unwrapData` serve).
- Player **obedece** `session.visible_tabs` da API. Não inventar abas no cliente.
- Guardian `readOnly`: zero POST session/attempt/response.
- Sem testes automatizados (QA). Sem commit autônomo.
- DPS não entram neste recorte.

## Fora

Admin, app nativo, KPI, gerador de plano, drag-and-drop.
