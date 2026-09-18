# PROMPT — Orquestrar front-end admin (UUIDs e KPIs)

## PERSONA

Atue como engenheiro de software no `akili-admin` (TailAdmin / hub escolar e Content Studio). Implemente código de produção e contratos de UI. Não crie testes automatizados. Não faça commit a menos que o usuário peça.

## CONTEXTO

A API (`akili-api`) já persiste `questions[].uuid`, grava `activity_responses` e expõe `learning_kpi` / `learning_chart`. Este recorte é **só o admin**.

Leia **nesta ordem**:

1. [../00-roadmap.md](../00-roadmap.md)
2. Specs `01` → `03` em [../specs/](../specs/)

Contrato HTTP de leitura (não reescrever): no monólito, `docs/tasks/gameficacao-e-kpis/specs/05-graficos-e-contratos.md`. Envelope destas rotas: `status`, `message`, `errors`, chave `learning_kpi` ou `learning_chart`, `pagination`, `error_code`. **Não** usar `apiClientData` (ele espera `{data}`). Erros: Problem Details.

Workspace desta conversa pode ser só `akili-admin`. Se o path das specs estiver no `akili-api` (`docs/tasks/gameficacao-e-kpis/front-end/admin/`), leia de lá e **escreva código no admin**. Não invente arquivos em `akili-site` ou `akili-api`.

## DECISÕES FECHADAS

- Executar **uma spec por vez**, na ordem 01 → 02 → 03.
- Não reescrever o dashboard escolar legado.
- Não implementar: portal aluno, gráficos no hub `/guardian/*` do admin, ranking, atraso, gamificação, testes, commit em `main`.
- Relatório por spec em `reports/YYYY-MM-DD_spec-0N.md` **nesta pasta** se o workspace for o api; se o workspace for só o admin, em `docs/tasks/gameficacao-e-kpis/reports/` do admin.

## TAREFA

Para cada spec: reler → implementar só o escopo → relatório → parar, salvo o usuário pedir “segue tudo”.

### Spec 01 — Identidade

`ContentQuestion.uuid` / `ContentOption.uuid`. `mapQuestionToForm` + `buildVersionPayloadFromState` + import. [../specs/01-identidade-questoes.md](../specs/01-identidade-questoes.md).

### Spec 02 — Coordenador

Helper de envelope + seção Aprendizagem em `/schools/{uuid}/dashboard`. [../specs/02-kpis-coordenador.md](../specs/02-kpis-coordenador.md).

### Spec 03 — Professor

Mesmos cards/charts em `/teacher/classrooms/{uuid}` e `/teacher/students/{uuid}`. [../specs/03-kpis-professor.md](../specs/03-kpis-professor.md).

## FORA DE ESCOPO (recusar deriva)

- Endpoints novos na API.
- Player web (`akili-site`).
- `TeacherExecutiveDashboard` como rota nova obrigatória.
- Commit em `main`.

## CRITÉRIO DE PRONTO DO ORQUESTRADOR

- Specs 01–03 implementadas (ou bloqueios registrados: workspace sem admin, GET da versão ainda sem uuid, etc.).
- Relatório por spec.
- Round-trip do form preserva uuid.
- Coordenador e professor vêem razão e acerto no recorte; 403 fora do escopo.
