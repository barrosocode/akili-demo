# Spec 02 — Kanban abre a sessão do card

**Repo:** `akili-site`  
**Módulo SDD:** `/sdd-module student-kanban-player-scope`  
**Schema:** `docs/modules/student-kanban-player-scope/schema/student-kanban-player-scope.json`  
**API:** v1 — [contratos-api-v1.md](../contratos-api-v1.md) + contrato Kanban (`docs/tasks/kanban/front-end/contratos-api-v1.md` se copiado).  
**Depende de:** spec 01 desta pasta (player já filtra `visible_tabs`).

Se o Kanban da pasta `docs/tasks/kanban/` ainda não existir no site, implemente só o gancho de navegação nesta spec e registre o bloqueio. Não reconstrua as quatro colunas aqui.

---

## Decisões fechadas

- Clique do **aluno** em card com `content_uuid`: navegar ao player existente levando `study_task_uuid` e `kind`.
- POST session (já na spec 01) **deve** ir com esse uuid.
- Responsável: `readOnly` — playback de supervisão, zero POST session.
- Sem PATCH de task. Sem DnD.
- Sem testes automatizados.

---

## 1. Navegação

Do card para o player:

```
/aluno/.../contents/[contentUuid]?study_task_uuid=[task.uuid]&kind=[task.kind]
```

(Ajuste o path ao que o site já usa.)

O player lê `study_task_uuid` da query/estado e manda no POST/GET da spec 01. `kind` na URL é selo/telemetria local — a API não autoriza por ele.

---

## 2. Depois do player

Ao voltar ao quadro: refetch `todo` / `doing` / `done`. Card de aula `done` não some com o de R1 (são linhas diferentes).

---

## 3. Critério de aceite

- Network do clique na aula: POST session com `study_task_uuid` do card `new_content`; resposta `visible_tabs: ["treino","conf"]`.
- Clique em R2: uuid do card `review_r2`; `visible_tabs: ["r2"]`.
- Dois cards do mesmo conteúdo no mesmo dia não compartilham sessão.
- Guardian não dispara POST.
- Relatório `docs/tasks/sessoes-por-card/reports/YYYY-MM-DD_spec-02.md`.
