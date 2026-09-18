# Spec 02 — Plano de estudos do responsável

**Repo:** `akili-site`  
**Módulo SDD:** `/sdd-module guardian-study-planner`  
**Schema:** `docs/modules/guardian-study-planner/schema/guardian-study-planner.json`  
**API:** v1 — [contratos-api-v1.md](../contratos-api-v1.md) seções Inputs, Planos, warnings  
**Depende de:** consentimento/progresso do filho já existente no site.  
**Desbloqueia:** cards no quadro (spec 03).

O responsável acompanha o filho em `/children/[ref]` mas não configura agenda nem gera roteiro.

---

## Decisões fechadas

- Superfície: detalhe do filho (sugerida `/children/[ref]/estudos` ou aba “Estudos”). Lista de quadros: `GET /guardian/boards` na home de filhos se couber sem duplicar a lista atual.
- Só o responsável **edita** inputs e **dispara** geração. Aluno e professor não usam estas rotas.
- PUT de availability e school-schedule **substitui o conjunto** (enviar a lista completa da tela).
- DPS (`tdah_adjustment`, `on_medication`) só neste form. `autocomplete="off"`. Estado em memória/React Query. **Proibido** `localStorage` / `sessionStorage`.
- Checkboxes DPS **não** vêm pré-marcados por default de UI: o valor inicial é o GET. Se GET default for `false`, a caixa começa desmarcada.
- POST generate → 202 → poll do plano até `applied`/`failed`. 409: não reenviar; mostrar “Geração em andamento” e poll.
- E006: erro de campo em tópicos. Warnings E001–E008 **depois** de applied, na lista `warnings[]`.
- Tópicos e disciplinas: catálogo do filho `GET .../learning` (`materials[].content.topic` / `.subject`). Sem inventar `GET /subjects` no BFF guardian.
- Sem testes automatizados.

---

## 1. Tipos

Arquivo sugerido: `types/guardian-study-planner.ts`.

Settings, slots, exams, topics, study_plan detalhe — campos **iguais** ao contrato v1. `weekday` no form pode ser PT; enviar ISO ou PT (API aceita ambos). Ler da resposta sempre ISO.

---

## 2. BFF

Todas as rotas Laravel em `/api/v1/guardian/students/{student}/...` e `GET /api/v1/guardian/boards`.

Chaves: `boards`, `board`, `study_setting`, `availability_slots`, `school_schedule_slots`, `study_plan`, `study_plans`.

PUT devolve a coleção já paginada. Mapear `errors` do envelope para campos do form (PT).

Reusar o unwrap de recurso criado na spec 01 se existir; senão criar helper único `unwrapResource(payload, key)`.

`GET learning` já existe no site (envelope `{data}`) — reusar para o picker de tópicos/disciplinas. Não misturar os dois envelopes no mesmo helper cego.

---

## 3. UI — wizard ou seções na mesma página

Ordem sugerida:

1. Configuração de estudo (método + DPS).
2. Disponibilidade (grade semanal, vários intervalos; validar `ends_at > starts_at` no cliente).
3. Horário escolar (dia + disciplina do catálogo).
4. Restrições da geração: `starts_on`, `content_deadline_on`, `blocked_dates`, provas.
5. Tópicos: multi-select do catálogo; cada um com `difficulty_level` N1–N5 e `needs_reinforcement`.
6. Botão “Gerar plano”. Loading até applied/failed.
7. Resultado: warnings, omitted_topics, task_count. Link para o Kanban read-only (spec 03).

Empty: sem disponibilidade — a API ainda aceita gerar; o motor emite warnings. Não bloquear o submit só por slots vazios (E006 é só tópicos vazios).

Histórico: lista `GET study-plans` paginada (status superseded visível, não editável).

---

## 4. Critério de aceite

- PUT settings persiste; reload mostra os mesmos booleanos (incluindo DPS só nesta tela).
- PUT availability com overlap → 422 no campo, mensagem da API.
- POST sem tópicos → 422 `E006`.
- POST válido → 202 → plano vira `applied` (Horizon no ar) → warnings renderizados.
- Network do Kanban/aluno **não** contém `tdah_adjustment` / `on_medication`.
- Sem testes automatizados.

## 5. Relatório

`docs/modules/guardian-study-planner/reports/YYYY-MM-DD_report.md` e `docs/tasks/kanban/reports/YYYY-MM-DD_spec-02.md`.
