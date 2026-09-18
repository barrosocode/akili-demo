# Front-end — captura de aprendizagem e KPIs

A API (`akili-api`) já entregou UUID no JSONB, writes de sessão/response e os endpoints `frequency` / `learning_kpi` / `learning_chart`. Esta pasta é o recorte de **execução nos fronts**.

Duas pastas independentes, mesma estrutura da pasta-mãe (`00-roadmap.md`, `specs/`, `prompts/`):

| Pasta | Repo | Ordem | Prompt |
|---|---|---|---|
| [admin/](admin/00-roadmap.md) | `akili-admin` | identidade do form → KPI coordenador → KPI professor | [admin/prompts/00-orquestrar-execucao.md](admin/prompts/00-orquestrar-execucao.md) |
| [site/](site/00-roadmap.md) | `akili-site` | player → frequência do aluno → KPI do responsável | [site/prompts/00-orquestrar-execucao.md](site/prompts/00-orquestrar-execucao.md) |

Não misture os dois repos no mesmo prompt. Professor e coordenador **não** entram no site; aluno e família B2C **não** entram no admin.

## Como rodar

1. Confirme que a API está no ar (backfill de uuid + `make migrate` das tabelas de aprendizagem).
2. Copie `admin/` para o workspace `akili-admin` (sugestão: `docs/tasks/gameficacao-e-kpis/`) **ou** abra o prompt com os dois roots visíveis e escreva só no admin.
3. Idem para `site/` → `akili-site`.
4. Cole o `prompts/00-orquestrar-execucao.md` correspondente. Uma spec por vez, salvo “segue tudo”.

Relatórios nascem em `reports/` de cada pasta (ou no repo alvo). Contratos HTTP não se reescrevem aqui — apontam para [../specs/05-graficos-e-contratos.md](../specs/05-graficos-e-contratos.md).

## Fora

UI de atraso/agenda, gamificação formal, app mobile offline, testes automatizados e commit autônomo.
