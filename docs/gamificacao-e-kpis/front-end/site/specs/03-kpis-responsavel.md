# Spec 03 — KPIs e gráficos do responsável

**Repo:** `akili-site`  
**Depende de:** helper de envelope da [02-frequencia-aluno.md](02-frequencia-aluno.md); player da [01-player-sessoes.md](01-player-sessoes.md) para haver fato.  
**API:**

| Uso | Laravel |
|---|---|
| KPI | `GET /guardian/students/{student}/kpis/learning` |
| Chart | `GET /guardian/students/{student}/charts/learning?series=` |

Permission e gates ficam na API (`guardian.children.progress.read`, `AssertGuardianStudentAccess`, audit `sensitive.read`). O BFF só encaminha o cookie/token do responsável.

---

## Decisões fechadas

- Superfície: `/children/[ref]` (`features/children/components/child-detail.tsx`). Não criar página nova.
- Aluno da rota = o filho. **Não** mandar `student_uuid` na query.
- Mesmos filtros da spec 05 da API (`date_from`, `date_to`, currículo, `outcome`, `session_position`). Período default = últimos 30 dias se o usuário não escolher.
- Cinco `series`. Uma request por série visível. Overlay certo/errado = duas calls se quiser; não exigir nesta spec.
- Gráficos: estilo `features/progress/components/weekly-evolution.tsx` (CSS / Bootstrap). **Não** obrigar Recharts.
- Textos sem diagnóstico (“a criança tem dificuldade…”). Números + rótulos neutros (razão de tempo, porcentagem de acerto).
- Supervisão `/aluno/supervisao/...` **não** precisa desta UI nesta spec (já é read-only do ambiente do aluno). Não gravar sessão dali (já fechado na spec 01).
- Sem testes automatizados.

Contrato: `akili-api` `docs/tasks/gameficacao-e-kpis/specs/05-graficos-e-contratos.md`.

---

## 1. BFF

Espelhar o map de `app/api/guardian/children/[ref]/progress/route.ts` (resolve o uuid do filho, chama Laravel, devolve `{data}`).

Sugestão:

| BFF | Laravel | Chave Laravel |
|---|---|---|
| `GET /api/guardian/children/[ref]/kpis/learning` | `GET /guardian/students/{uuid}/kpis/learning` | `learning_kpi` |
| `GET /api/guardian/children/[ref]/charts/learning` | `GET /guardian/students/{uuid}/charts/learning` | `learning_chart` |

Reusar `unwrapResource` da spec 02. Query string de filtros/série passa adiante.

403/404 da API → o BFF propaga o Problem Details; a UI mostra a mensagem em português.

---

## 2. UI

Seção **Aprendizagem** no detalhe do filho, ao lado do progresso legado (`ProgressOverview`, `WeeklyEvolution` antigo **permanece**).

1. Cards: `time_ratio.avg`, `accuracy.percent`, contagens. `null` → empty state (“Ainda não há respostas neste período.”).
2. Gráficos:
   - evolução da razão no tempo
   - razão vs ordem
   - evolução do acerto
   - acerto vs ordem
   - acerto vs faixa de razão (`0-0.5`, `0.5-1`, `1-1.5`, `1.5+`)

Filtros mínimos na primeira entrega: período + disciplina (se o detalhe do filho já tiver subject). `outcome` / `session_position` podem ser toggles simples. Documentar no relatório o que ficou de fora.

`aggregation: "response"` — não recalcular média por aula no front.

---

## 3. Critério de aceite

- Pai do filho A não vê números do filho B (403/404 tratado).
- Cards batem com `learning_kpi` no Network.
- Trocar período atualiza as séries.
- Progresso legado e gamificação demo **não** somem.
- Sem testes automatizados.

## 4. Relatório

`reports/YYYY-MM-DD_spec-03.md`: rotas BFF, filtros entregues, como o empty state aparece.
