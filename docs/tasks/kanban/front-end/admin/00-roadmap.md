# Roadmap — front-end admin (Kanban read-only do professor)

Pasta de trabalho: `docs/tasks/kanban/` neste repo **depois da cópia**, ou `docs/tasks/kanban/front-end/admin/` no `akili-api`.  
**Repo de execução:** `akili-admin` (TailAdmin / portal do professor).  
Esta pasta é **só documentação**. Código: `/sdd-module teacher-study-board`.

A API **já** entregou GET board/tasks/plano atual no canal teacher. Contrato: [contratos-api-v1.md](contratos-api-v1.md) (versão **v1**). Sem o arquivo no workspace, **aborte**.

Não reimplementar backend. Não tocar em `akili-site`. Quem gera o plano é o responsável no site.

---

## 1. Resposta direta

A ficha do aluno no portal do professor não mostra o roteiro Kanban. O professor da turma **já** tem permissão `teacher.students.board.view`.

Depois da spec 01: na ficha do aluno há um quadro read-only (quatro colunas). Sem gerar, sem settings, sem DPS, sem player write.

---

## 2. Estado atual (gap)

| Capacidade | Hoje | Precisa |
|---|---|---|
| Ficha do aluno | progresso / KPIs / mensagens | seção Estudos |
| Envelope | `apiClientData` espera `{data}` | ler `board` / `tasks` / `study_plan` |
| Move de card | — | **não implementar** |

---

## 3. Arquitetura alvo

```
Teacher student page
  GET /api/v1/teacher/students/{uuid}/board
  GET /api/v1/teacher/students/{uuid}/board/tasks?status=
  GET /api/v1/teacher/students/{uuid}/study-plans/current
```

Acréscimo na página existente (`/teacher/students/{uuid}` ou equivalente). Não criar app nova.

---

## 4. Fases

| Fase | Spec | `/sdd-module` | O quê |
|---|---|---|---|
| 1 | [specs/01-quadro-do-professor.md](specs/01-quadro-do-professor.md) | `teacher-study-board` | Board + Kanban read-only + plano atual |

Uma spec só. Copiar `modules/` para `docs/modules/` do admin antes do comando.

---

## 5. Fora deste recorte

- Portal aluno/responsável (`akili-site`).
- Hub `/guardian/*` do admin.
- Gerar plano, editar horários, DPS.
- Drag-and-drop, comentários.
- Testes automatizados, commits autônomos.

---

## 6. Como executar

1. Copiar conforme [../README.md](../README.md).
2. `/sdd-module teacher-study-board` → plano → OK → código → relatório.
