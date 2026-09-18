# Contratos HTTP — Kanban de estudos (API v1)

**Versão da API:** `v1`  
**Base:** `/api/v1`  
**Fonte:** implementação Laravel em 2026-09-17 (specs 01–04). Não inventar rotas.

Timezone de “hoje”: `America/Fortaleza`. Datas `YYYY-MM-DD`. Horários `HH:MM` (API devolve 5 caracteres).

---

## Envelope (obrigatório)

Todas as rotas deste recorte usam:

```json
{
  "status": 200,
  "message": "Mensagem em português",
  "errors": {},
  "<chave>": {},
  "pagination": null,
  "error_code": null
}
```

- Sucesso: `errors` objeto vazio, `error_code` null.
- Falha de validação: `status` 422, `error_code` `VALIDATION_ERROR` (padrão Akili) **exceto** E006 (ver abaixo).
- **Nunca** chave literal `data` / `model`.
- Item: chave no singular (`board`, `study_plan`, `study_setting`).
- Coleção: chave no plural (`boards`, `tasks`, `study_plans`, `availability_slots`, `school_schedule_slots`).
- Listas **sempre** paginadas: `page`, `page_size`, `total_items`, `total_pages`. Query: `page` (default 1), `page_size` (default 15, **tasks default 50**, max 100).

BFF do site: se o helper atual só unwrapa `{data}`, **não** passar estas respostas cegas. Extrair a chave de recurso e, se o browser ainda espera `{data}`, devolver `jsonSuccess(recurso)` **depois** de ler a chave certa.

Admin: `apiClientData` (espera `{data}`) **não** serve. Helper dedicado por chave.

---

## Auth e prefixos

| Persona | Auth | Prefixo Laravel |
|---|---|---|
| Aluno | Sanctum canal mobile (`akili_student_session`) | `/api/v1/mobile/student/...` |
| Responsável | Sanctum canal client (`/client/auth` / cookies guardian) | `/api/v1/guardian/...` |
| Professor | Sanctum admin | `/api/v1/teacher/...` |

Sessões **não** se misturam.

Sugestão de BFF site (espelhar o que já existe em `app/api/student/*` e `app/api/guardian/*`):

| BFF | Laravel |
|---|---|
| `GET /api/student/board` | `GET /api/v1/mobile/student/board` |
| `GET /api/student/board/tasks` | `GET /api/v1/mobile/student/board/tasks` |
| `GET /api/student/study-plans/current` | `GET /api/v1/mobile/student/study-plans/current` |
| `GET /api/guardian/boards` | `GET /api/v1/guardian/boards` |
| `GET /api/guardian/children/[student]/board` | `GET /api/v1/guardian/students/{uuid}/board` |
| `GET /api/guardian/children/[student]/board/tasks` | `GET /api/v1/guardian/students/{uuid}/board/tasks` |
| `GET/PUT /api/guardian/children/[student]/study-settings` | idem Laravel |
| `GET/PUT /api/guardian/children/[student]/availability-slots` | idem |
| `GET/PUT /api/guardian/children/[student]/school-schedule` | idem |
| `GET/POST /api/guardian/children/[student]/study-plans` | idem |
| `GET /api/guardian/children/[student]/study-plans/current` | idem |
| `GET /api/guardian/children/[student]/study-plans/[plan]` | idem |

Admin chama Laravel direto (padrão TailAdmin), prefixo `/api/v1/teacher/...`.

---

## Permissões RBAC

| Permission | Quem |
|---|---|
| `student.board.view` | aluno: board, tasks, plano atual |
| `guardian.children.board.view` | responsável: boards, board, tasks, GET planos |
| `guardian.children.study_plan.manage` | responsável: PUT inputs + POST gerar |
| `teacher.students.board.view` | professor da turma: GET board, tasks, plano atual |

Gate extra do responsável: vínculo ativo + verificado + `can_view_progress` + consentimento `child_progress` (`assertViewProgress`). Sem isso: 403.

Professor: `AssertTeacherClassroomAccess` (turma ativa). Sem isso: 403. Professor **não** gera plano e **não** edita inputs.

---

## 1. Board

### GET detalhe — chave `board`

- Aluno: `GET /api/v1/mobile/student/board`
- Responsável: `GET /api/v1/guardian/students/{student}/board`
- Professor: `GET /api/v1/teacher/students/{student}/board`

```json
{
  "status": 200,
  "message": "Quadro de estudos obtido com sucesso.",
  "errors": {},
  "board": {
    "uuid": "...",
    "name": "Estudos de Ana",
    "status": "active",
    "student_uuid": "...",
    "school_uuid": "...",
    "members": [
      { "user_uuid": "...", "name": "Ana", "member_role": "owner" }
    ],
    "current_study_plan": {
      "uuid": "...",
      "status": "applied",
      "starts_on": "2026-09-21",
      "content_deadline_on": "2026-10-31",
      "warnings_count": 1
    },
    "created_at": "2026-09-17T14:00:00+00:00",
    "updated_at": "2026-09-17T14:00:00+00:00"
  },
  "pagination": null,
  "error_code": null
}
```

`current_study_plan` é `null` se não houver plano `applied`. Membros: `owner` | `guardian`. **Sem e-mail. Sem DPS.**

Não existe POST/PATCH/DELETE de board.

### GET lista do responsável — chave `boards`

`GET /api/v1/guardian/boards?page=1&page_size=15`

```json
{
  "uuid": "...",
  "name": "Estudos de Ana",
  "status": "active",
  "student_uuid": "...",
  "student_name": "Ana",
  "created_at": "..."
}
```

---

## 2. Cards (Kanban) — chave `tasks`

- Aluno: `GET /api/v1/mobile/student/board/tasks`
- Responsável: `GET /api/v1/guardian/students/{student}/board/tasks`
- Professor: `GET /api/v1/teacher/students/{student}/board/tasks`

Query: `status`, `kind`, `scheduled_on` (`YYYY-MM-DD`), `page`, `page_size` (default **50**, max 100).

`status`: `backlog` | `todo` | `doing` | `done`  
`kind`: `new_content` | `review_r1` | `review_r2` | `review_r3`

O front monta **quatro colunas** com quatro GETs (`status=backlog` etc.). Não há endpoint “board completo”.

O GET promove `backlog` → `todo` quando `scheduled_on` é hoje (Fortaleza). Não precisa de job no cliente.

```json
{
  "status": 200,
  "message": "Cards de estudo obtidos com sucesso.",
  "errors": {},
  "tasks": [
    {
      "uuid": "...",
      "kind": "new_content",
      "name": "Frações",
      "status": "todo",
      "position": 0,
      "scheduled_on": "2026-09-17",
      "scheduled_start": "14:00",
      "scheduled_end": "16:00",
      "duration_minutes": 45,
      "compacted_review": false,
      "is_weekend": false,
      "source": "system",
      "content_uuid": "...",
      "subject_uuid": "...",
      "topic_uuid": "...",
      "origin_task_uuid": null,
      "study_plan_uuid": "...",
      "started_at": null,
      "completed_at": null
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 50,
    "total_items": 1,
    "total_pages": 1
  },
  "error_code": null
}
```

**Proibido:** POST, PATCH, DELETE, `move`. O card muda sozinho via sessão/progresso.

Labels sugeridos (UI):

| `status` | Coluna |
|---|---|
| `backlog` | Roteiro |
| `todo` | Hoje |
| `doing` | Em estudo |
| `done` | Concluído |

| `kind` | Selo |
|---|---|
| `new_content` | Conteúdo novo |
| `review_r1` | Revisão 1 |
| `review_r2` | Revisão 2 |
| `review_r3` | Revisão 3 |

---

## 3. Player (só aluno, a partir do Kanban)

`POST /api/v1/mobile/student/contents/{content}/sessions`

```json
{
  "content_version_uuid": "...",
  "metadata": { "study_task_uuid": "<uuid do card>" }
}
```

Também aceita `study_task_uuid` no root do body. Sem o uuid, revisões do mesmo conteúdo no mesmo dia podem colidir.

Writes de sessão usam envelope legado `{data}` (já existente no player). Leituras de board/tasks **não**.

| Sessão | Card (servidor) |
|---|---|
| `started` / `in_progress` | `doing` |
| `completed` | `done` |
| `abandoned` | permanece `doing` |

Responsável e professor: **zero** writes de sessão. Card clicável só navega para playback read-only (guardian) ou não navega (professor — só visualiza).

---

## 4. Inputs do plano (só responsável)

Prefixo: `/api/v1/guardian/students/{student}/`  
Permission: `guardian.children.study_plan.manage`

### Settings — chave `study_setting`

`GET` / `PUT study-settings`

PUT body (todos obrigatórios, menos `items_per_session`):

```json
{
  "inverted_classroom": false,
  "spaced_review": true,
  "review_model": "dehaene",
  "items_per_session": null,
  "tdah_adjustment": false,
  "on_medication": false
}
```

`review_model`: `dehaene` | `leitner` | `custom`  
`items_per_session`: 1–4 ou null.

GET sem registro prévio devolve os defaults acima com `uuid: null`.

DPS (`tdah_adjustment`, `on_medication`) **só** nestes GET/PUT. Checkboxes explícitos, nunca pré-marcados a partir de cache local. `autocomplete="off"`. Não persistir no browser.

### Disponibilidade — chave `availability_slots` + pagination

`GET` / `PUT availability-slots`

PUT **substitui o conjunto**:

```json
{
  "availability_slots": [
    {
      "weekday": "seg",
      "starts_at": "14:00",
      "ends_at": "16:00",
      "is_recurring": true,
      "exception_dates": []
    }
  ]
}
```

`weekday` aceito: ISO `mon`…`sun` **ou** PT `seg`…`dom` (também `segunda`, `terça`, …). A resposta **sempre** normaliza ISO (`mon`…`sun`).

Overlap no mesmo dia → 422 (`Há horários sobrepostos no mesmo dia da semana.`).

### Horário escolar — chave `school_schedule_slots` + pagination

`GET` / `PUT school-schedule`

```json
{
  "school_schedule_slots": [
    { "weekday": "mon", "subject_uuid": "..." }
  ]
}
```

Resposta do item: `uuid`, `weekday`, `subject_uuid`, `subject_name`.

Não existe `GET /subjects` no canal guardian. Disciplinas vêm do catálogo do filho: `GET /api/v1/guardian/students/{student}/learning` (envelope legado `{data}`), campo `materials[].content.subject` e `materials[].content.topic` (`uuid` + `name`). Deduplicar por uuid para o typeahead.

Tópicos do POST generate: `materials[].content.topic.uuid` (é `module_topics.uuid`). Dificuldade `N1`…`N5` é input do responsável, não vem do catálogo.

---

## 5. Planos — chave `study_plan` / `study_plans`

### POST gerar — 202

`POST /api/v1/guardian/students/{student}/study-plans`  
Permission: `guardian.children.study_plan.manage`

```json
{
  "starts_on": "2026-09-21",
  "content_deadline_on": "2026-10-31",
  "blocked_dates": ["2026-09-23"],
  "exams": [{ "date": "2026-10-20", "subject_uuids": ["..."] }],
  "topics": [
    { "topic_uuid": "...", "difficulty_level": "N3", "needs_reinforcement": false }
  ]
}
```

`topics` vazio → **422**, `error_code: "E006"`, campo `topics`. Não cria plano.

Já existe plano `pending`/`generating` → **409**, `error_code: "STUDY_PLAN_GENERATING"`, devolve o plano em andamento em `study_plan`.

202:

```json
{
  "status": 202,
  "message": "Geração do plano de estudos enfileirada.",
  "errors": {},
  "study_plan": {
    "uuid": "...",
    "status": "pending",
    "starts_on": "2026-09-21",
    "content_deadline_on": "2026-10-31",
    "blocked_dates": [],
    "exams": [],
    "omitted_topics": [],
    "warnings": [],
    "weekend_simulation": null,
    "engine_version": "deterministic-v1",
    "error_code": null,
    "generated_at": null,
    "applied_at": null,
    "topics": [],
    "task_count": 0,
    "created_at": "..."
  },
  "pagination": null,
  "error_code": null
}
```

UI: após 202, poll `GET .../study-plans/{uuid}` (ou `current`) a cada 3s até `applied` | `failed` (timeout ~90s). `generating` mostra spinner. Não disparar POST de novo enquanto 409.

Regen: o mesmo POST. Servidor supersede o `applied` e troca só cards `backlog`/`todo`. A UI não escolhe o modo.

### GET lista / detalhe / atual

| Método | Path | Quem | Chave |
|---|---|---|---|
| GET | `/guardian/students/{student}/study-plans` | responsável | `study_plans` paginado (resumo) |
| GET | `/guardian/students/{student}/study-plans/{plan}` | responsável | `study_plan` detalhe |
| GET | `/guardian/students/{student}/study-plans/current` | responsável | `study_plan` ou `null` |
| GET | `/mobile/student/study-plans/current` | aluno | `study_plan` ou `null` |
| GET | `/teacher/students/{student}/study-plans/current` | professor | `study_plan` ou `null` |

Resumo da lista: `uuid`, `status`, `starts_on`, `content_deadline_on`, `engine_version`, `warnings_count`, `omitted_topics_count`, `generated_at`, `applied_at`, `created_at`.

Detalhe inclui `topics[]` (`uuid`, `topic_uuid`, `subject_uuid`, `content_uuid`, `difficulty_level`, `already_studied`, `needs_reinforcement`), `omitted_topics`, `warnings`, `weekend_simulation`, `task_count`. **Sem DPS.**

`status` do plano: `pending` | `generating` | `applied` | `failed` | `superseded`.

---

## 6. Warnings E001–E008 (UI)

`error_code` do **envelope** só em falha dura (E006 ou 409 `STUDY_PLAN_GENERATING`). Os demais vão em `study_plan.warnings[]`:

```json
{ "code": "E001", "message": "...", "action_taken": "..." }
```

Mostrar banner/lista após `applied`. Não tratar warning como toast de erro de formulário.

| Código | Tipo | UI |
|---|---|---|
| E006 | duro (422) | Bloquear submit; erro no campo tópicos |
| E001 | warning | Capacidade insuficiente; sugerir fim de semana ou reduzir conteúdo |
| E002 | auto | Prazo ajustado em função da prova |
| E003 | auto | Revisões compactadas (`compacted_review` no card) |
| E004 | auto | Sala invertida desligada nesta geração |
| E005 | auto | Semana sem slot; redistribuiu |
| E007 | auto | `items_per_session` ignorado |
| E008 | warning | Muitas datas bloqueadas; ver `weekend_simulation` |

`omitted_topics[]`: `{ "code", "reason": "NO_PUBLISHED_CONTENT" \| "NO_ENTITLEMENT" \| "TOPIC_NOT_FOUND" }`. Lista “não entrou no quadro” — não são cards.

---

## 7. O que o cliente NÃO chama

- Qualquer `/boards` ou `/tasks` do personal-planner.
- Create/share/delete de board.
- PATCH de status, posição, data.
- Endpoints de `task_children`.
- Settings / generate no canal aluno ou professor.

---

## 8. LGPD (front)

| Campo | Onde pode aparecer |
|---|---|
| `student_name` / `name` do board | lista do responsável; detalhe |
| membros `name` | detalhe do board |
| `tdah_adjustment` / `on_medication` | **somente** form de settings do responsável do próprio filho |
| e-mail | **nunca** neste recorte |
| DPS | nunca em `board`, `tasks`, `study_plan`, logs do browser, `localStorage` |

Máscaras de CPF/telefone não se aplicam (campos inexistentes). Consentimento de progresso já é gate da API; a tela de settings não substitui o fluxo de consentimento.
