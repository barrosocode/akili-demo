# Roadmap — front-end admin (captura de aprendizagem e KPIs)

Pasta de trabalho: `docs/tasks/gameficacao-e-kpis/front-end/admin/`.  
**Repo de execução:** `akili-admin`.  
Esta pasta é **só documentação**. Código entra quando um agente executar as specs via [prompts/00-orquestrar-execucao.md](prompts/00-orquestrar-execucao.md).

A API já entregou UUID no JSONB, writes de sessão/response e os endpoints de leitura. Contratos canônicos no repo `akili-api`:

- [../../specs/05-graficos-e-contratos.md](../../specs/05-graficos-e-contratos.md)
- [../../reports/2026-09-11_spec-05.md](../../reports/2026-09-11_spec-05.md)

Não reimplementar backend. Não tocar em `akili-site` daqui.

---

## 1. Resposta direta

O Content Studio gera `id` só para o React e **descarta** no POST. Abrir um conteúdo publicado e salvar sem mudar questões manda o array sem `uuid` — o backend reusa pelo índice, mas o admin não fecha o round-trip.

Os dashboards de coordenador e professor mostram o agregado legado (`percent_complete`, tempo de tela). Os KPIs de `t_resposta / t_esperado`, porcentagem de acerto e as cinco séries **não têm UI**.

Depois das specs 01–03 desta pasta: o form persiste e reenvia UUIDs; o dashboard escolar e o portal do professor consomem `learning_kpi` e `learning_chart`.

---

## 2. Estado atual (gap)

| Capacidade | Hoje | Precisa |
|---|---|---|
| Identidade da questão no form | `createId()` a cada `mapQuestionToForm`; payload sem `uuid` | `ContentQuestion.uuid` / `ContentOption.uuid` ida e volta |
| Import JSON | Gera id novo no map | Preservar `uuid` se o JSON trouxer |
| Dashboard coordenador | `GET /schools/{uuid}/dashboard` legado | Seção nova nos mesmos filtros + endpoints de aprendizagem |
| Dashboard professor | Turma / ficha com métricas de conclusão | Mesmos KPIs/charts no recorte da turma ou do aluno |
| Cliente HTTP | `apiClientData` unwrapa `{data}` | Helper que lê `learning_kpi` / `learning_chart` |

---

## 3. Arquitetura alvo

```
Content Studio                         API já pronta
─────────────                          ─────────────
mapQuestionToForm  → uuid              content_versions.questions[].uuid
buildVersionPayload → envia uuid       ResolveContentQuestions (reusa / gera)

SchoolExecutiveDashboard               GET /schools/{school}/kpis/learning
Teacher classroom / student            GET /schools/{school}/charts/learning
                                       GET /teacher/kpis/learning
                                       GET /teacher/charts/learning
```

Não reescrever `GetSchoolDashboard` no front: a seção de aprendizagem é **acréscimo**.

---

## 4. Fases

| Fase | Spec | O quê |
|---|---|---|
| 0 | [specs/01-identidade-questoes.md](specs/01-identidade-questoes.md) | UUID no tipo, no map, no save e no import |
| 1 | [specs/02-kpis-coordenador.md](specs/02-kpis-coordenador.md) | Helper de envelope + UI no dashboard da escola |
| 2 | [specs/03-kpis-professor.md](specs/03-kpis-professor.md) | Mesma UI no portal do professor (turma e aluno) |

Ordem obrigatória: **01 → 02 → 03**. Sem 01 o player do site (pasta irmã) ainda funciona se o backfill da API rodou, mas o admin quebraria o UUID ao re-salvar. Sem o helper da 02 a 03 não deve duplicar cliente HTTP.

---

## 5. Fora deste recorte

- Portal do aluno e do responsável B2C (`akili-site`).
- Hub operacional `/guardian/*` do admin (não é o produto família).
- Ranking, pontos, agenda, conteúdos atrasados.
- Reescrever `SchoolExecutiveDashboard` legado.
- Testes automatizados, salvo pedido explícito.
- Commits autônomos.

---

## 6. Como executar

1. Copiar esta pasta `admin/` para o workspace `akili-admin` (sugestão: `docs/tasks/gameficacao-e-kpis/`) **ou** abrir o prompt com o repo admin montado.
2. Ler este roadmap.
3. Abrir [prompts/00-orquestrar-execucao.md](prompts/00-orquestrar-execucao.md).
4. Cumprir uma spec por vez.
5. Gerar `reports/YYYY-MM-DD_spec-NN.md` ao fechar cada spec.

Critério de pronto desta pasta de docs: os cinco arquivos abaixo existem e não se contradizem.

| Arquivo |
|---|
| [00-roadmap.md](00-roadmap.md) |
| [specs/01-identidade-questoes.md](specs/01-identidade-questoes.md) |
| [specs/02-kpis-coordenador.md](specs/02-kpis-coordenador.md) |
| [specs/03-kpis-professor.md](specs/03-kpis-professor.md) |
| [prompts/00-orquestrar-execucao.md](prompts/00-orquestrar-execucao.md) |
