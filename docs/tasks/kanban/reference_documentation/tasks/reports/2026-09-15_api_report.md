# Relatório SDD — Tasks (API) — 2026-09-15

## Resumo da implementação

Ajustes na API para suportar o Kanban de tasks evoluído no frontend:

1. **`POST /tasks/{id}/move`** — reindex transacional de siblings nas colunas origem e destino.
2. **`GET /tasks` e `GET /tasks/{id}`** — campo `checklist_summary: { total, finished }` agregado de `task_children`.
3. **`PATCH /tasks/{id}`** — flags `clear_estimated_start`, `clear_estimated_end`, `clear_start_date`, `clear_end_date`.
4. **Recorrência** — aceita `frequency: "biweekly"` e normaliza para `{ frequency: "daily", interval: 14 }`.

Sem DDL — schema Postgres validado via MCP (`tasks`, `task_children`).

## Arquivos alterados

| Área | Arquivos |
|------|----------|
| Repository | `src/infrastructure/repositories/task_repository.py`, `task_child_repository.py` |
| Use cases | `move_task.py`, `list_tasks.py`, `get_task.py`, `update_task.py` |
| Schemas | `src/schemas/task/task.py` |
| DI | `src/api/dependencies/auth.py` |
| Testes | `tests/feature/test_tasks.py` |
| Docs | `docs/modules/tasks/schema/tasks.json`, `docs/frontend/modules/tasks.md` |

## Endpoints

| Método | Rota | Mudança |
|--------|------|---------|
| POST | `/api/v1/tasks/{id}/move` | Reindex de siblings |
| GET | `/api/v1/tasks` | `checklist_summary` em cada task |
| GET | `/api/v1/tasks/{id}` | `checklist_summary` |
| PATCH | `/api/v1/tasks/{id}` | Flags `clear_*` para datas |
| POST | `/api/v1/tasks` | Aceita `recurrence.frequency: biweekly` |

## Exemplos

### Move com reindex (intra-coluna)

Request:

```json
POST /api/v1/tasks/{id}/move
{ "status": "backlog", "position": 2 }
```

Coluna `[A:0, B:1, C:2]` com move de A → posição 2 resulta em `[B:0, C:1, A:2]`.

### Listagem com checklist

```json
{
  "status": 200,
  "message": "Tasks carregadas com sucesso",
  "tasks": [
    {
      "id": "...",
      "name": "Implementar login",
      "checklist_summary": { "total": 3, "finished": 1 }
    }
  ],
  "pagination": { "page": 1, "page_size": 15, "total_items": 1, "total_pages": 1 }
}
```

### Limpar data estimada

```json
PATCH /api/v1/tasks/{id}
{ "clear_estimated_end": true }
```

### Recorrência quinzenal

Request:

```json
{ "recurrence": { "frequency": "biweekly", "interval": 1 } }
```

Persistido/resposta:

```json
{ "frequency": "daily", "interval": 14 }
```

## Validação MCP Postgres

Tabelas `tasks` e `task_children` conferidas — colunas compatíveis, sem migration necessária.

## Passos manuais

```bash
make test
make lint
```

## Testes adicionados

- `test_move_reindexes_siblings_same_column`
- `test_move_reindexes_siblings_cross_column`
- `test_list_tasks_includes_checklist_summary`
- `test_patch_clear_estimated_end`
- `test_create_task_biweekly_recurrence_normalized`

## Notas para o frontend

- Após este deploy, o frontend pode remover `loadChecklistSummariesForTasks` e usar `task.checklist_summary` da listagem.
- DnD pode enviar **apenas um** `POST /move` por drag (task arrastada); reindex de siblings é responsabilidade da API.
- Para limpar datas no modal de detalhe, usar flags `clear_*` em vez de `null`.
