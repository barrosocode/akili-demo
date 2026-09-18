# PROMPT — Orquestrar front-end site (player e KPIs família)

## PERSONA

Atue como engenheiro de software no `akili-site` (Kiddino: aluno, responsável, BFF Next.js). Implemente código de produção. Não crie testes automatizados. Não faça commit a menos que o usuário peça.

## CONTEXTO

A API já grava sessão/tentativa/response e expõe frequência + KPI/chart. Este recorte é **só o site**.

Leia **nesta ordem**:

1. [../00-roadmap.md](../00-roadmap.md)
2. Specs `01` → `03` em [../specs/](../specs/)

Writes Laravel: envelope `{data}` — `unwrapData` atual serve.  
Leituras de KPI: chaves `frequency` / `learning_kpi` / `learning_chart` — **não** passar cego por `unwrapData`. BFF mapeia para `{data}` via `jsonSuccess`.

Contratos: no `akili-api`, `docs/tasks/gameficacao-e-kpis/specs/02-sessoes-tentativas-respostas.md` e `specs/05-graficos-e-contratos.md`.

Workspace desta conversa pode ser só `akili-site`. Se as specs estiverem no `akili-api` (`docs/tasks/gameficacao-e-kpis/front-end/site/`), leia de lá e **escreva código no site**. Não invente arquivos em `akili-admin` ou migrations na API.

## DECISÕES FECHADAS

- Executar **uma spec por vez**, na ordem 01 → 02 → 03.
- Aluno: só frequência. Tempo/acerto: responsável.
- Guardian `readOnly`: zero writes de sessão/response.
- Sem Recharts obrigatório. Sem ranking, atraso, gamificação formal.
- Relatório por spec em `reports/YYYY-MM-DD_spec-0N.md` **nesta pasta** se o workspace for o api; se for só o site, em `docs/tasks/gameficacao-e-kpis/reports/` do site.

## TAREFA

Para cada spec: reler → implementar só o escopo → relatório → parar, salvo o usuário pedir “segue tudo”.

### Spec 01 — Player

Sessão no load, attempt na aba, POST no clique, seed, cronômetro, BFF de write, retomar. Checkpoint `/progress` permanece. [../specs/01-player-sessoes.md](../specs/01-player-sessoes.md).

### Spec 02 — Frequência

BFF + cards no dashboard do aluno. [../specs/02-frequencia-aluno.md](../specs/02-frequencia-aluno.md).

### Spec 03 — Responsável

BFF + seção Aprendizagem em `/children/[ref]`. [../specs/03-kpis-responsavel.md](../specs/03-kpis-responsavel.md).

## FORA DE ESCOPO (recusar deriva)

- Endpoints novos na API.
- UI de professor/coordenador.
- Taxa de acerto no dashboard do aluno.
- Commit em `main`.

## CRITÉRIO DE PRONTO DO ORQUESTRADOR

- Specs 01–03 implementadas (ou bloqueios: workspace sem site, playback sem uuid, etc.).
- Relatório por spec.
- Clique grava response; reload hidrata; frequência do aluno bate com o catálogo; pai vê razão e acerto no recorte.
