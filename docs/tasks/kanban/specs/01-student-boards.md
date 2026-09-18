# Spec 01 — Board único do aluno

**Módulo SDD:** `/sdd-module student-boards`  
**Schema:** `docs/modules/student-boards/schema/student_boards.json`  
**Prompt:** `docs/modules/student-boards/prompts/main.md`

## Objetivo

Persistir um quadro Kanban por `Student` e controlar quem vê. Sem geração de cards nesta spec.

## Regras

1. `CreateStudent` (e backfill Artisan para alunos já existentes) cria `student_boards` 1:1. Nome default: `Estudos de {preferred_name || name}`.
2. Aluno entra em `student_board_members` como `owner` **somente** se `students.user_id` existir. Se o login for criado depois, sync no vínculo user↔student.
3. Responsável entra como `guardian` quando o vínculo está `active` + `verified_at` + `can_view_progress` + consentimento `child_progress` vigente. Revogar vínculo ou consentimento remove o membro.
4. Professor **não** entra na pivot. `GET` autorizado via `AssertTeacherClassroomAccess`.
5. Sem endpoints de create/share/delete de board. Sem `code` global. Sem `share_with`.

## Tabelas

- `student_boards` (bigint + uuid, tenant_id, student_id unique, school_id, name, status, timestamps, deleted_at)
- `student_board_members` (board_id, user_id, member_role `owner|guardian`, unique (board_id, user_id))

## API (envelope padrão)

| Método | Rota | Quem | Chave |
|---|---|---|---|
| GET | `/api/v1/mobile/student/board` | aluno autenticado | `board` |
| GET | `/api/v1/guardian/students/{student}/board` | responsável | `board` |
| GET | `/api/v1/teacher/students/{student}/board` | professor da turma | `board` |

Listagem de boards do responsável (vários filhos): `GET /api/v1/guardian/boards` com paginação, chave `boards`.

Membros na resposta do detalhe: `user_uuid`, `name`, `member_role` — **sem** e-mail no envelope do aluno; responsável/professor podem ver e-mail ofuscado ou omitir (preferir omitir).

## Permissões novas

- `student.board.view`
- `guardian.children.board.view`
- `teacher.students.board.view`

## Fora

Tasks, inputs, gerador, UI.
