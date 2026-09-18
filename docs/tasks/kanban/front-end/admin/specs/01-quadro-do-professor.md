# Spec 01 — Quadro do professor (read-only)

**Repo:** `akili-admin`  
**Módulo SDD:** `/sdd-module teacher-study-board`  
**Schema:** `docs/modules/teacher-study-board/schema/teacher-study-board.json`  
**API:** v1 — [contratos-api-v1.md](../contratos-api-v1.md) (board, tasks, GET current no prefixo teacher)

A ficha do aluno no portal do professor não mostra o roteiro. A permissão `teacher.students.board.view` já existe.

---

## Decisões fechadas

- Seção “Estudos” na página já existente do aluno (`/teacher/students/{uuid}` — descobrir path real).
- GET board + GET current + quatro GETs `tasks?status=` (`page_size=50`).
- Empty: sem plano applied → “O responsável ainda não gerou o plano.”
- 403 fora da turma: copy padrão do admin.
- Cards **não** abrem o player. Sem POST session. Sem settings. Sem DPS.
- Sem DnD. Sem testes automatizados.

---

## 1. Tipos

Reusar o shape de `StudentBoard` / `StudyTask` / detalhe resumido de `study_plan` do contrato v1. Admin **não** tipa `tdah_adjustment`.

---

## 2. Cliente HTTP

Helper que lê a chave do envelope (`board`, `tasks`, `study_plan`) — o mesmo espírito do helper de `learning_kpi` (gamificação). Não passar por `apiClientData`.

Rotas Laravel (auth Sanctum admin já configurada):

| Método | Path | Chave |
|---|---|---|
| GET | `/api/v1/teacher/students/{uuid}/board` | `board` |
| GET | `/api/v1/teacher/students/{uuid}/board/tasks` | `tasks` |
| GET | `/api/v1/teacher/students/{uuid}/study-plans/current` | `study_plan` (nullable) |

---

## 3. UI

- Título = `board.name`.
- Resumo do plano: datas, `warnings_count`, lista `warnings[]` se o GET current trouxer detalhe.
- `omitted_topics` visível (tópicos que não viraram card) — pedagógico, sem DPS.
- Quatro colunas. Card: `name`, selo `kind`, horário, duração.
- Loading / vazio por coluna.

Não adicionar botão gerar. Não linkar Content Studio.

---

## 4. Critério de aceite

- Professor da turma vê colunas após o responsável gerar (QA manual).
- Professor sem vínculo: 403.
- Network sem PUT/POST deste recorte.
- Payload de tasks sem campos de medicação/TDAH.
- Sem testes automatizados.

## 5. Relatório

`docs/modules/teacher-study-board/reports/YYYY-MM-DD_report.md` e `docs/tasks/kanban/reports/YYYY-MM-DD_spec-01.md`.
