# Spec 02 — KPIs e gráficos do coordenador

**Repo:** `akili-admin`  
**Depende de:** [01-identidade-questoes.md](01-identidade-questoes.md) só para o helper de envelope poder viver no mesmo PR seguinte; a UI **não** depende do form. A API já expõe as rotas.  
**Desbloqueia:** [03-kpis-professor.md](03-kpis-professor.md) (reusa cliente + componentes).

Não reescrever o dashboard legado (`GET /schools/{uuid}/dashboard`, `SchoolExecutiveDashboard` atual). A aprendizagem é **seção nova**.

---

## Decisões fechadas

- Superfície: `/schools/[uuid]/dashboard`.
- Endpoints (prefixo `/api/v1`):

  | Uso | Path |
  |---|---|
  | KPI | `GET /schools/{school}/kpis/learning` |
  | Chart | `GET /schools/{school}/charts/learning?series=` |

- Permission já usada no dashboard: `dashboards.school.view`. Isolamento pela rota `{school}`.
- Envelope de **sucesso** destas rotas **não** é `{data}`. Chaves: `learning_kpi`, `learning_chart`. Erros: RFC 7807 (`ProblemDetails`) — o `parseAxiosProblem` atual serve.
- Cache de 180s é da API; o front não precisa invalidar no write (atraso de até 3 min aceitável).
- Sem ranking. Sem linguagem diagnóstica. Sem KPI de atraso.
- Sem testes automatizados.

Contrato canônico (payloads, `series`, filtros): no `akili-api`, `docs/tasks/gameficacao-e-kpis/specs/05-graficos-e-contratos.md`.

---

## 1. Cliente HTTP

Hoje `apiClientData` em `src/lib/api/client.ts` faz `envelope.data`. Isso **quebra** nestes endpoints.

Acrescentar helper (nome livre, ex. `apiClientResource`) que:

1. Chama `apiClient` (resposta crua).
2. Lê a chave pedida (`learning_kpi` | `learning_chart`).
3. Se a chave faltar → erro de contrato (não silenciar).

Não alterar o comportamento de `apiClientData` nas rotas legadas.

Tipos em `src/types/` (ou ao lado do service):

- `LearningKpi` — `aggregation`, `filters`, `time_ratio`, `accuracy` (ver spec 05).
- `LearningChart` — `series`, `bucket`, `filters`, `points[]` (`x`, `y`, `n`, `capped?`).

`time_ratio.avg` e `accuracy.percent` podem ser `null` quando `responses_count = 0`. Tratar empty state.

---

## 2. Service e filtros

Novo service, ex. `src/services/learning-kpi.service.ts`. Não inflar `school-dashboard.service.ts` com estas séries.

Query params (todos opcionais; default na API = últimos 30 dias, `America/Sao_Paulo`):

| Param | UI |
|---|---|
| `date_from` / `date_to` | período; 422 se `to < from` ou > 365 dias — mostrar `errors` do Problem Details |
| `subject_uuid` | disciplina |
| `module_uuid` | módulo |
| `chapter_uuid` | capítulo |
| `topic_uuid` | tópico |
| `classroom_uuid` | turma da escola; omitir = escola inteira |
| `student_uuid` | um aluno da escola |
| `outcome` | `all` \| `correct` \| `incorrect` |
| `session_position` | `all` \| `start` \| `middle` \| `end` |

Reusar o espírito de `DashboardFiltersBar` (não obrigar o mesmo componente). Filtros de currículo podem começar só com disciplina + turma + período se os selects de módulo/capítulo/tópico ainda não existirem no dashboard — documentar o recorte no relatório. `series` é escolha da UI, não um filtro global único: a página pede as séries que for exibir.

`aggregation` no payload é `"response"`: cada resposta pesa igual. Não calcular média das médias no front.

---

## 3. UI

Arquivos-âncora:

- `src/components/dashboard/SchoolExecutiveDashboard.tsx`
- `src/components/dashboard/school/` (`KpiGrid`, `DashboardCharts`, `DashboardFiltersBar`)

Acrescentar seção **Aprendizagem** abaixo ou ao lado dos KPIs legados:

1. Cards: razão média de tempo (`time_ratio.avg`), % acerto (`accuracy.percent`), contagens (`responses_count`, certos/errados).
2. Gráficos das cinco `series` (podem ser abas ou uma grade). Uma chamada HTTP por `series`. Overlay certo/errado = duas chamadas (`outcome=correct` e `incorrect`) se o produto quiser — não multiplexar no servidor.

Biblioteca: reusar o que o dashboard escolar já usa para charts. Não obrigar Recharts novo se `DashboardCharts` já resolve.

Empty: `responses_count = 0` → texto neutro (“Ainda não há respostas neste recorte.”), sem diagnóstico.

---

## 4. Critério de aceite

- Coordenador na escola A não consegue ver números da escola B (403 da API).
- Sem `classroom_uuid` = agregado da escola; com turma = só aquela turma.
- Cards batem com o JSON de `learning_kpi` (conferência manual / Network).
- Trocar `series` / filtros reflete nos pontos (`x`, `y`, `n`).
- Dashboard legado (progresso, materiais, alertas) **inalterado** na função.
- Sem testes automatizados.

## 5. Relatório

`reports/YYYY-MM-DD_spec-02.md`: service, helper de envelope, rotas de UI, quais filtros ficaram na primeira entrega.
