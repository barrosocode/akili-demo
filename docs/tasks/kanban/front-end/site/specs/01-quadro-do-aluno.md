# Spec 01 — Quadro do aluno (casca)

**Repo:** `akili-site`  
**Módulo SDD:** `/sdd-module student-study-board`  
**Schema:** `docs/modules/student-study-board/schema/student-study-board.json`  
**API:** v1 — [contratos-api-v1.md](../contratos-api-v1.md) seções Board e Planos (GET current)  
**Desbloqueia:** spec 03 (colunas). Pode coexistir com spec 02 no responsável.

O aluno autenticado ainda não tem rota de estudos. O dashboard/materiais existem; o quadro 1:1 não.

---

## Decisões fechadas

- Uma rota no portal aluno (sugerida: `/aluno/estudos`). Ajustar ao roteador Kiddino existente (`/aluno/...`).
- GET board no load. Não criar board no cliente.
- Se `current_study_plan` for `null`: empty state *“Seu responsável ainda não gerou o plano de estudos.”* Sem colunas vazias fingindo Kanban.
- Se houver plano `applied`: mostrar nome do board, datas `starts_on` / `content_deadline_on`, `warnings_count`. Colunas entram na spec 03; nesta spec um atalho “Ver roteiro” pode ser placeholder.
- Nav: item “Estudos” no menu do aluno, visível só logado como student.
- Sem testes automatizados.

---

## 1. Tipos

Arquivo sugerido: `types/student-study-board.ts` (descobrir pasta `types/` real).

```ts
export type BoardMemberRole = 'owner' | 'guardian';
export type BoardStatus = 'active' | 'archived';
export type StudyPlanStatus =
  | 'pending' | 'generating' | 'applied' | 'failed' | 'superseded';

export interface BoardMember {
  user_uuid: string;
  name: string | null;
  member_role: BoardMemberRole;
}

export interface BoardStudyPlanEmbed {
  uuid: string;
  status: StudyPlanStatus;
  starts_on: string;
  content_deadline_on: string;
  warnings_count: number;
}

export interface StudentBoard {
  uuid: string;
  name: string;
  status: BoardStatus;
  student_uuid: string | null;
  school_uuid: string | null;
  members: BoardMember[];
  current_study_plan: BoardStudyPlanEmbed | null;
  created_at: string | null;
  updated_at: string | null;
}
```

Não incluir `tdah_adjustment` / `on_medication`. Não incluir e-mail.

---

## 2. BFF

Espelhar `app/api/student/...` (`studentLaravelRequest`).

| BFF | Laravel | Chave |
|---|---|---|
| `GET /api/student/board` | `GET /api/v1/mobile/student/board` | `board` |
| `GET /api/student/study-plans/current` | `GET /api/v1/mobile/student/study-plans/current` | `study_plan` (pode ser `null`) |

Não unwrapar `{data}`. Ler a chave, devolver `jsonSuccess` ao browser se esse for o padrão do `bffClient`. Preservar `pagination` quando houver (aqui é null).

403/401: fluxo de auth já existente.

---

## 3. UI

- Header: `board.name`.
- Empty state se plano null.
- Se plano: chips de datas; não listar tópicos nesta spec (detalhe é GET current — opcional colapsável, sem DPS).
- Não renderizar colunas ainda (spec 03).
- Loading e erro de rede em português.

---

## 4. Critério de aceite

- Aluno logado abre `/aluno/estudos` (ou rota equivalente) e vê o nome do quadro.
- Sem plano applied: copy de espera, sem Kanban.
- Network: GET `/api/student/board` (BFF) → Laravel `.../mobile/student/board`.
- Nenhum POST/PATCH.
- Sem testes automatizados.

## 5. Relatório

`docs/modules/student-study-board/reports/YYYY-MM-DD_report.md` e `docs/tasks/kanban/reports/YYYY-MM-DD_spec-01.md`. Listar rotas BFF e arquivos de página.
