# Spec 02 — Inputs persistentes do plano

**Módulo SDD:** `/sdd-module study-plan-inputs`  
**Schema:** `docs/modules/study-plan-inputs/schema/study_plan_inputs.json`  
**Prompt:** `docs/modules/study-plan-inputs/prompts/main.md`

## Objetivo

O responsável grava disponibilidade, horário escolar e método. A geração (spec 03) lê estes dados. Professor e aluno não editam.

## Tabelas

### `student_study_settings` (1:1 aluno)

- `inverted_classroom`, `spaced_review` boolean
- `review_model` enum `dehaene|leitner|custom` default `dehaene`
- `items_per_session` smallint null (override; senão o motor calcula)
- `tdah_adjustment` boolean DPS `encrypt: true`
- `on_medication` boolean DPS `encrypt: true`
- soft-delete

**Resposta de API:** devolver `tdah_adjustment` e `on_medication` **somente** no GET do responsável do próprio filho (ele quem persiste). Nunca em listagem de board/tasks, nunca em log.

### `student_availability_slots`

- `weekday` `mon|tue|wed|thu|fri|sat|sun`
- `starts_at` / `ends_at` time, `ends_at > starts_at`
- `is_recurring` default true
- `exception_dates` JSONB array de datas
- overlap no mesmo weekday é 422

### `student_school_schedule_slots`

- `weekday` + `subject_id` FK `subjects`
- unique `(student_id, weekday, subject_id)`
- PUT substitui o conjunto (editável no input, regra 9)

Não existe horário de turma no banco hoje: o “herdado” é o último conjunto salvo deste aluno. Primeiro cadastro começa vazio.

## API

Prefixo: `/api/v1/guardian/students/{student}/`

| Método | Path | Chave |
|---|---|---|
| GET/PUT | `study-settings` | `study_setting` |
| GET | `availability-slots` | `availability_slots` + pagination |
| PUT | `availability-slots` | substitui o conjunto; `availability_slots` |
| GET/PUT | `school-schedule` | `school_schedule_slots` |

Gate: o mesmo de progresso do filho (`assertViewProgress`).

## Permissões novas

- `guardian.children.study_plan.manage`

## Fora

Gerar plano, criar cards, motor, medicação em `student_cognitive_profiles`.
