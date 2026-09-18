# Roadmap — front-end site (sessão por card)

Pasta de trabalho: `docs/tasks/sessoes-por-card/` neste repo **depois da cópia**, ou `docs/tasks/sessoes-por-card/front-end/site/` no `akili-api`.  
**Repo de execução:** `akili-site` (Kiddino: aluno, BFF Next.js).  
Esta pasta é **só documentação**. Código entra via `/sdd-module` (módulos em `docs/modules/`) ou pelo [prompts/00-orquestrar-execucao.md](prompts/00-orquestrar-execucao.md).

A API **já** entregou (fase 1–2 deste recorte) `session_kind` + `visible_tabs`. Contrato: [contratos-api-v1.md](contratos-api-v1.md) (versão **v1**). Se esse arquivo não estiver no workspace, **aborte**.

Não reimplementar backend. Não tocar em `akili-admin`.

---

## 1. Resposta direta

O player ainda monta **todas** as abas do conteúdo. O clique no card do Kanban, se existir, só manda `study_task_uuid` — a API antiga retomava a mesma sessão da aula. O aluno vê conferência e revisões juntas.

Depois das specs 01–02 desta pasta: o player renderiza só `visible_tabs` da sessão; o card de aula e o de revisão abrem recortes diferentes.

---

## 2. Estado atual (gap)

| Capacidade | Hoje | Precisa |
|---|---|---|
| Abas do player | `treino, conf, r1, r2, r3, desafio` fixo | `session.visible_tabs` |
| POST session | `content_version_uuid` (+ uuid opcional) | uuid do card **obrigatório** a partir do Kanban |
| GET current | sem query | `study_task_uuid` ou `session_kind` |
| Attempt | qualquer aba | só aba permitida; 422 visível se o cliente errar |
| Lista de materiais | player completo | mesma aula (`treino`+`conf`), sem R1–R3 |
| Progresso | percent = abas visíveis locais | aula: só treino+conf; revisão: só a aba da revisão |

---

## 3. Arquitetura alvo

```
Kanban card.kind                 BFF                              Laravel
────────────────                 ───                              ───────
clique → /aluno/.../contents/[uuid]?study_task_uuid=&kind=
                                 POST .../sessions                {data} + visible_tabs
                                 GET  .../sessions/current?study_task_uuid=
                                 POST .../attempts                tab ∈ visible_tabs

Lista de materiais → same player, sem study_task_uuid → session_kind=new_content
```

---

## 4. Fases

| Fase | Spec | `/sdd-module` | O quê |
|---|---|---|---|
| 1 | [specs/01-player-por-card.md](specs/01-player-por-card.md) | `student-player-session-scope` | Player + BFF usam `visible_tabs` / query current |
| 2 | [specs/02-kanban-abre-sessao.md](specs/02-kanban-abre-sessao.md) | `student-kanban-player-scope` | Clique do card leva kind + uuid; refetch colunas |

Ordem obrigatória: **01 → 02**. Sem o player filtrar abas, o Kanban continua abrindo a aula inteira.

Copiar `modules/` desta pasta para `docs/modules/` do site **antes** do `/sdd-module`.

---

## 5. Fora deste recorte

- Portal professor (`akili-admin`).
- Aba `desafio` (D1 da API).
- KPI, gerador de plano, DnD.
- Testes automatizados, salvo pedido explícito.
- Commits autônomos.

---

## 6. Como executar

1. Copiar conforme [../README.md](../README.md).
2. Ler este roadmap e o contrato v1.
3. `/sdd-module student-player-session-scope` → OK → código → relatório.
4. `/sdd-module student-kanban-player-scope`.
5. Relatório: `docs/modules/<modulo>/reports/YYYY-MM-DD_report.md` **e** `docs/tasks/sessoes-por-card/reports/YYYY-MM-DD_spec-0N.md`.
