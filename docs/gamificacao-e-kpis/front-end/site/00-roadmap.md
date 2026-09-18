# Roadmap — front-end site (player e KPIs família)

Pasta de trabalho: `docs/tasks/gameficacao-e-kpis/front-end/site/`.  
**Repo de execução:** `akili-site`.  
Esta pasta é **só documentação**. Código entra quando um agente executar as specs via [prompts/00-orquestrar-execucao.md](prompts/00-orquestrar-execucao.md).

A API já entregou writes de sessão/tentativa/response e os endpoints de leitura. Contratos:

- Writes (envelope `{data}`): [../../specs/02-sessoes-tentativas-respostas.md](../../specs/02-sessoes-tentativas-respostas.md) e [../../reports/2026-09-11_spec-02.md](../../reports/2026-09-11_spec-02.md)
- Leituras (envelope com chave de recurso): [../../specs/05-graficos-e-contratos.md](../../specs/05-graficos-e-contratos.md)

Não reimplementar backend. Não tocar em `akili-admin` daqui. Professor e coordenador ficam no admin.

---

## 1. Resposta direta

O player calcula acerto e embaralha no browser (`Math.random`, índice da aba) e **não envia** a resposta. O checkpoint `/progress` só grava conclusão da aula. Sem instrumentação, os KPIs da API ficam vazios.

O dashboard do aluno ainda não mostra frequência (disponíveis / vistas / pendentes). O responsável ainda não vê razão de tempo nem evolução de acerto — só o progresso legado.

Depois das specs 01–03 desta pasta: o clique grava `activity_responses`; o aluno vê frequência; o pai vê `learning_kpi` e as cinco séries.

---

## 2. Estado atual (gap)

| Capacidade | Hoje | Precisa |
|---|---|---|
| Identidade no tipo | `ContentQuestion` sem `uuid` | `uuid` na questão e na opção |
| Shuffle | `Math.random()` a cada load | `shuffle_seed` da sessão |
| Resposta | `answersByTab[tab][index]` só memória | POST no clique + hidratar |
| BFF writes | só `progress` | sessions / attempts / responses |
| Envelope KPI | `unwrapData` só entende `{data}` | extrair `frequency` / `learning_kpi` / `learning_chart` |
| Aluno | cards de `percent_complete` | cards de frequência |
| Responsável | `WeeklyEvolution` no progresso legado | gráficos das séries novas |

---

## 3. Arquitetura alvo

```
Player (Kiddino)              BFF site                         API
────────────────              ────────                         ───
load → POST session           /api/student/.../sessions        /mobile/student/...  {data}
aba  → POST attempt
clique → POST response
Continuar → POST progress     (já existe)

dashboard aluno               /api/student/kpis/frequency      chave frequency
filho (pai)                   /api/guardian/children/.../kpis  chave learning_kpi
                              /api/guardian/children/.../charts chave learning_chart
```

`unwrapData` **serve** nos writes (`{data}`). **Não serve** nas leituras de KPI — cada rota BFF mapeia a chave e devolve `{data}` ao browser, no padrão de `jsonSuccess`.

---

## 4. Fases

| Fase | Spec | O quê |
|---|---|---|
| 0 | [specs/01-player-sessoes.md](specs/01-player-sessoes.md) | Instrumentar player + BFF de write |
| 1 | [specs/02-frequencia-aluno.md](specs/02-frequencia-aluno.md) | Frequência no dashboard/lista do aluno |
| 2 | [specs/03-kpis-responsavel.md](specs/03-kpis-responsavel.md) | KPI + charts no detalhe do filho |

Ordem obrigatória: **01 → 02 → 03**. Sem player os KPIs ficam zerados. A 02 e a 03 podem compartilhar o unwrapper de envelope no BFF — extrair na 02 e reusar na 03.

---

## 5. Fora deste recorte

- Portal professor / coordenador (`akili-admin`).
- Taxa de acerto no dashboard do **aluno**.
- Recharts obrigatório (usar CSS no estilo `WeeklyEvolution`).
- Ranking, pontos, agenda, atraso, fila offline completa.
- Testes automatizados, salvo pedido explícito.
- Commits autônomos.

---

## 6. Como executar

1. Copiar esta pasta `site/` para o workspace `akili-site` (sugestão: `docs/tasks/gameficacao-e-kpis/`) **ou** abrir o prompt com o repo site montado.
2. Ler este roadmap.
3. Abrir [prompts/00-orquestrar-execucao.md](prompts/00-orquestrar-execucao.md).
4. Cumprir uma spec por vez.
5. Gerar `reports/YYYY-MM-DD_spec-NN.md` ao fechar cada spec.

Critério de pronto desta pasta de docs: os cinco arquivos abaixo existem e não se contradizem.

| Arquivo |
|---|
| [00-roadmap.md](00-roadmap.md) |
| [specs/01-player-sessoes.md](specs/01-player-sessoes.md) |
| [specs/02-frequencia-aluno.md](specs/02-frequencia-aluno.md) |
| [specs/03-kpis-responsavel.md](specs/03-kpis-responsavel.md) |
| [prompts/00-orquestrar-execucao.md](prompts/00-orquestrar-execucao.md) |
