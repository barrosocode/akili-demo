# Spec 03 — Plano e gerador determinístico

**Módulo SDD:** `/sdd-module study-plans`  
**Schema:** `docs/modules/study-plans/schema/study_plans.json`  
**Prompt:** `docs/modules/study-plans/prompts/main.md`

Depende das specs 01 e 02. Cria `study_tasks` (tabela da spec 04 pode nascer aqui se 04 ainda não rodou — preferir migration da 04 **antes** do apply, ou criar a tabela de tasks nesta spec e a 04 só ligar o sync). **Recomendação de PR:** migration de `study_tasks` nesta spec (output do gerador) e spec 04 só status/job/hooks.

## Objetivo

`POST generate` lê settings + slots + payload de restrições/conteúdos, roda `GenerateStudyPlan` (regras, sem LLM) e materializa cards.

## Tabelas

### `study_plans`

- FKs: tenant, student, board
- `status` `pending|generating|applied|failed|superseded`
- `starts_on`, `content_deadline_on` date
- `blocked_dates` JSONB
- `exams` JSONB `[{ "date": "Y-m-d", "subject_ids": [bigint] }]`
- `input_snapshot` JSONB (canônico **sem** medicação/TDAH em claro; esses campos já estão criptografados na tabela de settings)
- `omitted_topics` JSONB `[{ "code", "reason": "NO_PUBLISHED_CONTENT"|"NO_ENTITLEMENT"|"TOPIC_NOT_FOUND" }]`
- `warnings` JSONB `[{ "code": "E001", "message", "action_taken" }]`
- `error_code` / `error_details` (falha dura)
- `engine_version` default `deterministic-v1`
- `generated_at`, `applied_at`, `created_by` (user do responsável)
- soft-delete

### `study_plan_topics`

Só tópicos que passaram no filtro 8C (conteúdo publicado + entitlement).

- FKs: plan, subject, module_topic, content (**obrigatório**)
- `difficulty_level` `N1|N2|N3|N4|N5`
- `already_studied` boolean (copiado do progresso no momento da geração)
- `needs_reinforcement` boolean
- unique `(study_plan_id, module_topic_id)`

## POST generate

`POST /api/v1/guardian/students/{student}/study-plans`

Body (além do que já está persistido na spec 02):

```json
{
  "starts_on": "YYYY-MM-DD",
  "content_deadline_on": "YYYY-MM-DD",
  "blocked_dates": ["YYYY-MM-DD"],
  "exams": [{ "date": "YYYY-MM-DD", "subject_uuids": ["..."] }],
  "topics": [
    {
      "topic_uuid": "...",
      "difficulty_level": "N3",
      "needs_reinforcement": false
    }
  ]
}
```

`topics[].codigo` da cliente resolve para `module_topics.uuid`. Disciplina vem da hierarquia, não do cliente.

409 se já houver plano `generating`. Job `GenerateStudyPlanJob` (Horizon). Envelope 202 com `study_plan` pending, ou 200 síncrono se a alocação for rápida o bastante no MVP — preferir **job + 202**.

## Regen (5B)

1. Plano `applied` atual → `superseded`.
2. Soft-delete de `study_tasks` com `status IN (backlog, todo)` daquele board.
3. Preservar `doing` e `done`.
4. Não criar card `new_content` para tópico com progresso `completed` ou task `done` ainda viva.
5. Revisões ainda não feitas podem ser recriadas se as regras pedirem.

## Filtro 8C

Para cada tópico do payload:

1. `module_topics` pelo uuid/código.
2. `contents` com `module_topic_id`, `status = published`, não deletado.
3. Entitlement ativo do aluno que cubra esse content/pacote (reusar catálogo de materiais).
4. Se falhar: entrada em `omitted_topics`, **não** cria card.
5. Se **nenhum** tópico passar e o payload não era vazio: ainda pode aplicar plano só com omitted + warning; se payload vazio → E006 (bloqueia).

## Motor (`deterministic-v1`)

Capacidade da sessão (para **agrupar horários**, não para criar pai/filho):

- itens = `floor(duração_min / 45)`, máximo 4
- TDAH e slot > 90 min: reduzir 1
- medicado: capacidade padrão
- vários cards podem receber o mesmo `scheduled_on` + `scheduled_start`

Sala invertida: alocar conteúdo novo na véspera do dia em que `subject_id` aparece no horário; tolerância 2 dias.

Dehaene: R1 +1d / 10 min; R2 +7d / 15 min; R3 +21d / 10 min; se não há slot, próximo disponível.

Prioridade: conteúdo novo; R3 antes de novo quando possível; disciplinas da prova mais próxima; `needs_reinforcement` com antecedência maior.

Distribuição: slots grandes = novo + R1; médios = R2 + novo; pequenos = R1 ou R3; sáb/dom só se slots úteis insuficientes.

Card gerado: `kind` `new_content|review_r1|review_r2|review_r3`, `origin_task_id` nas revisões, `status = backlog` (se `scheduled_on` já é hoje, já nasce `todo`).

## Erros E001–E008

| Código | Tipo | Comportamento |
|---|---|---|
| E006 | duro | 422, não cria plano applied. `conteudo` vazio. |
| E001 | warning | Gera o que couber; `warnings` com déficit em dias; sugere fim de semana ou reduzir conteúdo. |
| E002 | auto | `content_deadline_on = min(atual, data_prova - 3 dias)`; notifica no `warnings`. |
| E003 | auto | Compacta R2=5d, R3=14d; card `compacted_review = true`; warning. |
| E004 | auto | Se invertida e horário vazio: desliga invertida nesta geração (não necessariamente persiste o setting); distribuição padrão; warning. |
| E005 | auto | Semana sem slot: pula e redistribui nas adjacentes; warning de sobrecarga. |
| E007 | auto | `items_per_session` maior que a capacidade do slot: ignora override, usa calculado; warning. |
| E008 | warning | `blocked_dates` cobrem >50% dos slots: gera + inclui `weekend_simulation` (contagens) no `study_plan`; alerta inviabilidade. |

Mensagens de `warnings[].message` em português. `error_code` HTTP do envelope só em falha dura (E006 ou falha interna). Warnings **não** usam `error_code` de envelope; vão no recurso `study_plan.warnings`.

## GET

- `GET /api/v1/guardian/students/{student}/study-plans` paginado (`study_plans`)
- `GET /api/v1/guardian/students/{student}/study-plans/{plan}` (`study_plan`)
- Aluno/professor: o plano applied atual vem embutido no GET do board (spec 01 estendida) ou `GET .../study-plans/current` read-only

## Permissões

- `guardian.children.study_plan.manage` (POST)
- `guardian.children.board.view` / `student.board.view` / `teacher.students.board.view` (GET)
