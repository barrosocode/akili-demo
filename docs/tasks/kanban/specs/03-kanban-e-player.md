# Spec 03 — Kanban e player

**Repo:** `akili-site`  
**Módulo SDD:** `/sdd-module student-study-kanban`  
**Schema:** `docs/modules/student-study-kanban/schema/student-study-kanban.json`  
**API:** v1 — [contratos-api-v1.md](../contratos-api-v1.md) seções Cards e Player  
**Depende de:** spec 01 (rota do quadro). Spec 02 gera os cards; o Kanban funciona vazio se não houver plano.

O quadro existe (01) mas não lista cards. O player não amarra a sessão ao card.

---

## Decisões fechadas

- Quatro colunas fixas: Roteiro / Hoje / Em estudo / Concluído (`backlog` `todo` `doing` `done`).
- Um GET paginado **por coluna** (`status=`). `page_size=50`. “Carregar mais” se `total_pages > 1`.
- Ordenar por `position`, depois `scheduled_start`.
- **Sem** drag-and-drop persistente. Se o kit UI tiver DnD, desligar ou tornar no-op.
- Clique do **aluno** em card com `content_uuid`: ir ao player já existente (`/aluno/.../contents/[uuid]` ou equivalente) passando o card.
- No `POST sessions` existente, incluir `metadata.study_task_uuid`.
- Após voltar do player, refetch das colunas `todo`/`doing`/`done`.
- Responsável: **mesmo** componente de colunas, `readOnly` — clique pode abrir playback de supervisão já existente; **zero** POST session.
- “Hoje” na UI: data `YYYY-MM-DD` em `America/Fortaleza` (não `Date#toISOString` UTC à meia-noite). Filtro opcional `scheduled_on` só se houver toggle “só hoje”; default da coluna `todo` já é o conjunto promovido pelo servidor.
- Sem testes automatizados.

---

## 1. Tipos

```ts
export type StudyTaskStatus = 'backlog' | 'todo' | 'doing' | 'done';
export type StudyTaskKind =
  | 'new_content' | 'review_r1' | 'review_r2' | 'review_r3';

export interface StudyTask {
  uuid: string;
  kind: StudyTaskKind;
  name: string;
  status: StudyTaskStatus;
  position: number;
  scheduled_on: string;
  scheduled_start: string | null;
  scheduled_end: string | null;
  duration_minutes: number;
  compacted_review: boolean;
  is_weekend: boolean;
  source: 'system';
  content_uuid: string | null;
  subject_uuid: string | null;
  topic_uuid: string | null;
  origin_task_uuid: string | null;
  study_plan_uuid: string | null;
  started_at: string | null;
  completed_at: string | null;
}
```

Card: título `name`, selo `kind`, horário, duração, flag “revisão compactada” se `compacted_review`. Sem DPS.

---

## 2. BFF

| BFF | Laravel | Chave |
|---|---|---|
| `GET /api/student/board/tasks` | `GET /api/v1/mobile/student/board/tasks` | `tasks` |
| `GET /api/guardian/children/[student]/board/tasks` | `GET /api/v1/guardian/students/{uuid}/board/tasks` | `tasks` |

Query string: `status`, `kind`, `scheduled_on`, `page`, `page_size`.

Player: rota BFF de session **já existe**. Só acrescentar o uuid no body. Envelope `{data}` permanece nesse POST.

---

## 3. Player

Arquivos reais a descobrir (referência gamificação): `features/content-player/...`.

1. Query ou estado: `study_task_uuid` na navegação a partir do Kanban.
2. `POST sessions` com `content_version_uuid` **e** `metadata.study_task_uuid`.
3. Abrir material pela lista de materiais **sem** passar pelo Kanban: não inventar uuid; o backend faz fallback.

Não criar POST de task.

---

## 4. Empty / loading

- Plano applied mas tasks vazias: “Nenhum card nesta coluna.”
- Erro 403 no responsável: copy do gate de progresso já usado no filho.
- Polling leve (30–60s) só na coluna `doing` enquanto o aluno está fora do player é opcional; refetch on focus basta no MVP.

---

## 5. Critério de aceite

- Quatro colunas; cards na coluna certa após geração (QA manual).
- Clique aluno → Network POST session contém `study_task_uuid`.
- Completar aula → card some de `doing` e aparece em `done` após refetch.
- Guardian não dispara POST session.
- Não há request PATCH `/tasks`.
- Sem testes automatizados.

## 6. Relatório

`docs/modules/student-study-kanban/reports/YYYY-MM-DD_report.md` e `docs/tasks/kanban/reports/YYYY-MM-DD_spec-03.md`.
