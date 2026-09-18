# Roadmap — Kanban de estudos do aluno

Pasta de trabalho: `docs/tasks/kanban/`.  
Referência do planner genérico (não copiar à risca): [reference_documentation/](reference_documentation/).  
Schemas SDD 2.0 para `/sdd-module`: `docs/modules/student-boards`, `study-plan-inputs`, `study-plans`, `study-tasks`.

ADRs: `docs/akili-platform/13-decisoes-tecnicas-fechadas.md` (012, 013, 014). Envelope HTTP padrão. Backend só via Docker/Makefile. MCP Postgres Akili: validar schema **antes** de DDL, só leitura.

O recorte de KPIs em `docs/tasks/gameficacao-e-kpis/` **não** implementa agenda. Este roadmap é o módulo de agenda/Kanban.

---

## 1. O que estamos construindo

Cada aluno (`students`, 1:1) tem **um** quadro. O responsável preenche disponibilidade, horário, método e dispara a geração. O sistema cria os cards com regras **determinísticas** (sem LLM). O aluno estuda no player; o card muda de coluna sozinho a partir de `learning_sessions`.

O professor da turma **vê** o quadro (read-only). Ninguém cria card na mão.

---

## 2. Decisões fechadas

| # | Decisão |
|---|---|
| 1A | Board pertence ao perfil `Student`, não ao `users.type`. Existe mesmo sem login. Unique `(student_id)`. |
| 2B | Professor da turma (`classroom_teachers.left_at IS NULL`) vê o board/tasks. Não gera plano e não edita inputs. |
| 3 | Card = **um tópico ou uma revisão** (R1/R2/R3). Não há `task_children`. Várias cards podem compartilhar o mesmo horário de sessão. |
| 4 | Quem preenche inputs e dispara geração: **responsável** (vínculo ativo + verificado + `can_view_progress` + consentimento `child_progress`). |
| 5B | Regenerar: mantém cards `doing`/`done`; substitui só `backlog`/`todo`. Não recria conteúdo novo já concluído em `student_content_progress`. |
| 6 | Zero CRUD manual de task. `source = system`. |
| 7A | `already_studied` só de `student_content_progress.status = completed`. |
| 8C | Card só nasce se existir `contents` **publicado** + entitlement ativo do aluno. Tópico órfão vai para `omitted_topics`, não para o quadro. |
| 9 | Horário escolar: prefills do que já estiver salvo no aluno; o responsável edita no input da geração. Não há tabela de horário de turma hoje — não inventar `classroom_schedule` neste recorte. |
| 10A | Medicação/TDAH **não existem no banco**. Criar `student_study_settings` neste módulo (DPS, `encrypt: true`, fora do envelope de tasks). |
| 11 | Motor 100% determinístico (`engine_version = deterministic-v1`). |
| 12 | Erros da cliente: E001–E008 (ver spec 03). |
| 13 | Colunas: `backlog`, `todo`, `doing`, `done`. Trocas automáticas (spec 04). |

Fora deste recorte: comentários, anexos, recorrência JSON, share por e-mail, vários boards, LLM, cards manuais, `student_cognitive_profiles` completo.

---

## 3. Mapeamento do JSON da cliente

| Input | Persistência |
|---|---|
| `aluno.nome` / `ano_escolar` | `students` + matrícula/`series` (já existem) |
| `aluno.perfil_cognitivo` / `medicacao` | `student_study_settings.tdah_adjustment`, `on_medication` |
| `conteudo[]` | payload da geração → `study_plan_topics` (só os 8C) + `omitted_topics` |
| `conteudo.disciplina/topico/codigo` | `subjects` / `module_topics` (FK, não string solta no card) |
| `conteudo.nivel_dificuldade` | enum `N1…N5` em `study_plan_topics` (não reusar `difficulties` Fácil/Médio/Difícil) |
| `conteudo.ja_estudou` | ignorar no input; derivar de progresso |
| `conteudo.precisa_reforco` | `study_plan_topics.needs_reinforcement` |
| `disponibilidade[]` | `student_availability_slots` |
| `restricoes` | gravadas no `study_plans` daquela geração |
| `metodo` | `student_study_settings` |
| `horario_escolar[]` | `student_school_schedule_slots` (`subject_id`) |

---

## 4. Máquina de status do card

Um card está em **uma** coluna:

| Status | Significado | Quem muda |
|---|---|---|
| `backlog` | Item do roteiro ainda não é “de hoje” | Gerador (estado inicial). Job/listagem promove se `scheduled_on = hoje`. |
| `todo` | `scheduled_on` = data de hoje e ainda não aberto | Job diário (00:05 America/Fortaleza) + promoção lazy no `GET` do board |
| `doing` | Aluno abriu a atividade (`learning_sessions` `started` / `in_progress`) | Sync no write da sessão |
| `done` | Sessão `completed` **ou** progresso do conteúdo `completed` (conteúdo novo) | Sync no fim da sessão / upsert de progresso |

Revisões R1/R2/R3 são cards separados, mesmo `content_id`. Abertura pelo Kanban **deve** enviar `study_task_uuid` em `learning_sessions.metadata` para não ambiguidade. Fallback: card `todo`/`doing` daquele `content_id` com `scheduled_on = hoje`.

---

## 5. Fases de implementação

| Fase | Spec | Módulo SDD | O quê | Repo |
|---|---|---|---|---|
| 1 | [specs/01-student-boards.md](specs/01-student-boards.md) | `/sdd-module student-boards` | Board 1:1, membros automáticos, listagem | `akili-api` |
| 2 | [specs/02-study-plan-inputs.md](specs/02-study-plan-inputs.md) | `/sdd-module study-plan-inputs` | Disponibilidade, horário, settings DPS | `akili-api` |
| 3 | [specs/03-study-plans-e-gerador.md](specs/03-study-plans-e-gerador.md) | `/sdd-module study-plans` | Plano, tópicos, motor determinístico, E001–E008, regen 5B | `akili-api` |
| 4 | [specs/04-study-tasks-e-status.md](specs/04-study-tasks-e-status.md) | `/sdd-module study-tasks` | Cards, colunas, sync com sessões, job todo | `akili-api` |
| 5 | [front-end/](front-end/README.md) | `/sdd-module` no site/admin | UI aluno/responsável (`akili-site`) e professor read-only (`akili-admin`) | `akili-site`, `akili-admin` |

Ordem obrigatória no backend: **1 → 2 → 3 → 4**. A fase 3 cria tasks; a 4 só liga o status ao player. Sem board (1) não há onde pendurar o plano.

Specs 01–04 estão no código da API. A fase 5 **não** usa as specs Laravel: copie [front-end/](front-end/README.md) para o repo do front.

Orquestração backend: [prompts/00-orquestrar-execucao.md](prompts/00-orquestrar-execucao.md).  
Orquestração front: [front-end/site/prompts/00-orquestrar-execucao.md](front-end/site/prompts/00-orquestrar-execucao.md) e [front-end/admin/prompts/00-orquestrar-execucao.md](front-end/admin/prompts/00-orquestrar-execucao.md).

---

## 6. Domínios Laravel

| Domínio | Responsabilidade |
|---|---|
| `StudyPlanner` (novo) | Board, membros, inputs, plano, gerador, tasks |
| `Students` | Hook em `CreateStudent` (cria board) |
| `Guardians` | Hook em verify/revoke (sync membros) |
| `Learning` | Hook em sessão/progresso (status do card) |
| `Teachers` | `AssertTeacherClassroomAccess` no GET do board |

Não criar microserviço. Actions/Policies no monólito (ADR-012/013).

---

## 7. IDs, tenant, LGPD

- PK `bigint` + `uuid` público (padrão Akili). **Não** copiar PK UUID do personal-planner.
- FKs internas `bigint` (`students.id`, `users.id`, `contents.id`, `module_topics.id`).
- `tenant_id uuid` em toda tabela do módulo (= `students.tenant_id`).
- Soft-delete em board, settings, slots, plano, tópico, task.
- `on_medication` e `tdah_adjustment`: DPS, criptografar no persistir, **nunca** no JSON de tasks/board.
- Audit: criação de board, sync de membro, geração/falha/regen, conclusão de card.

Validação MCP (2026-09-16): **não existem** `boards`/`tasks`/`student_study_settings`/`student_cognitive_profiles`. Migrations são CREATE TABLE.
