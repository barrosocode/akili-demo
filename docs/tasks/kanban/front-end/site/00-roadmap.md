# Roadmap — front-end site (Kanban de estudos)

Pasta de trabalho: `docs/tasks/kanban/` neste repo **depois da cópia**, ou `docs/tasks/kanban/front-end/site/` no `akili-api`.  
**Repo de execução:** `akili-site` (Kiddino: aluno, responsável, BFF Next.js).  
Esta pasta é **só documentação**. Código entra via `/sdd-module` (módulos em `docs/modules/`) ou pelo [prompts/00-orquestrar-execucao.md](prompts/00-orquestrar-execucao.md).

A API **já** entregou board, inputs, gerador e cards. Contrato canônico: [contratos-api-v1.md](contratos-api-v1.md) (versão **v1**). Se esse arquivo não estiver no workspace, **aborte**.

Não reimplementar backend. Não tocar em `akili-admin` daqui. Professor fica no admin.

---

## 1. Resposta direta

O aluno e o responsável ainda não têm tela de quadro. O player não envia `study_task_uuid`. O responsável não preenche disponibilidade nem dispara o gerador.

Depois das specs 01–03 desta pasta: o aluno vê o Kanban e abre a aula pelo card; o responsável configura, gera e acompanha o quadro do filho (read-only).

---

## 2. Estado atual (gap)

| Capacidade | Hoje | Precisa |
|---|---|---|
| Quadro do aluno | inexistente | `GET /mobile/student/board` + empty state sem plano |
| Kanban | inexistente | quatro colunas via `GET .../board/tasks?status=` |
| Abrir aula pelo card | player sem `study_task_uuid` | POST session com `metadata.study_task_uuid` |
| Lista de filhos / boards | children legado | `GET /guardian/boards` + atalho no filho |
| Settings / horários | inexistente | GET/PUT settings, availability, school-schedule |
| Gerar plano | inexistente | POST 202 + poll + warnings E001–E008 |
| Envelope | `unwrapData` só `{data}` | extrair `board` / `tasks` / `study_plan` / `study_setting` / `availability_slots` / `school_schedule_slots` |

---

## 3. Arquitetura alvo

```
Aluno (/aluno/estudos)          BFF site                         API v1
──────────────────────          ────────                         ──────
GET board                       /api/student/board               /mobile/student/board
GET tasks × 4 status            /api/student/board/tasks         /mobile/student/board/tasks
clique card → player            POST .../sessions                metadata.study_task_uuid

Responsável (/children/[ref]/estudos)
GET/PUT settings, slots, schedule
POST study-plans → 202 → poll
GET board + tasks (read-only, sem sessão)
```

Writes de sessão continuam no envelope `{data}`. Leituras deste recorte **não**.

---

## 4. Fases

| Fase | Spec | `/sdd-module` | O quê |
|---|---|---|---|
| 1 | [specs/01-quadro-do-aluno.md](specs/01-quadro-do-aluno.md) | `student-study-board` | Rota, BFF board, empty state, resumo do plano atual |
| 2 | [specs/02-plano-do-responsavel.md](specs/02-plano-do-responsavel.md) | `guardian-study-planner` | Inputs DPS + gerar + warnings + boards |
| 3 | [specs/03-kanban-e-player.md](specs/03-kanban-e-player.md) | `student-study-kanban` | Quatro colunas + clique → player; guardian reusa read-only |

Ordem obrigatória: **01 → 02 → 03**. Sem 01 não há casca. Sem 02 o Kanban nasce vazio. Sem 03 o card não anda de coluna.

Copiar `modules/` desta pasta para `docs/modules/` do site **antes** do `/sdd-module`.

---

## 5. Fora deste recorte

- Portal professor (`akili-admin`).
- Drag-and-drop, cards manuais, comentários, vários boards, share.
- KPI de atraso / gamificação.
- App mobile nativo.
- Testes automatizados, salvo pedido explícito.
- Commits autônomos.

---

## 6. Como executar

1. Copiar conforme [../README.md](../README.md) (inclui `contratos-api-v1.md` e `docs/modules/*`).
2. Ler este roadmap e o contrato v1.
3. `/sdd-module student-study-board` → OK → código → relatório.
4. Repetir para `guardian-study-planner` e `student-study-kanban`.
5. Relatório: `docs/modules/<modulo>/reports/YYYY-MM-DD_report.md` **e** `docs/tasks/kanban/reports/YYYY-MM-DD_spec-0N.md`.
