# Relatório — Ajustes API Boards (Frontend)

**Data:** 2026-09-15

## Resumo

Extensão do contrato v1 de boards e users para desbloquear o frontend: membros enriquecidos, convite por e-mail, share na criação e lookup/search para typeahead.

## Mudanças implementadas

### Boards

| Mudança | Detalhe |
|---------|---------|
| `BoardMemberResponseDTO` | Campos `name` e `email` (claro para co-membros) |
| `POST /boards` | Campo opcional `share_with: [{ email, role? }]` (max 10) |
| `POST /boards/{id}/share` | Aceita `user_id` **ou** `email` (exclusivo) |
| `GET /boards/{id}` | Membros retornam nome + e-mail |

### Users (convite)

| Endpoint | Descrição |
|----------|-----------|
| `GET /users/lookup?email=` | Match exato por e-mail |
| `GET /users/search?q=` | Busca por nome (min 2 chars, max 10 resultados) |

Permissão nova: `users:lookup` no role `user`.

## Exemplos

### Criar board com convite

```json
POST /api/v1/boards
{
  "name": "Meu Kanban",
  "code": "meu-kanban",
  "share_with": [{ "email": "maria@example.com" }]
}
```

### Share por e-mail

```json
POST /api/v1/boards/{id}/share
{ "email": "maria@example.com", "role": "member" }
```

### Membro enriquecido

```json
{
  "user_id": "uuid",
  "name": "Maria Silva",
  "email": "maria@example.com",
  "role": "member",
  "created_at": "..."
}
```

### Lookup typeahead

```
GET /api/v1/users/lookup?email=maria@example.com
GET /api/v1/users/search?q=mar
```

## Conformidade LGPD

| Dado | Exposição | Base |
|------|-----------|------|
| `email` em membros do board | Claro para co-membros/owner | Execução do compartilhamento |
| `email` em lookup/search | Claro para usuários autenticados com `users:lookup` | Fluxo de convite |
| CPF/telefone | Nunca expostos nos novos endpoints | — |

Auditoria de share registra `email` no `new_values` (sem texto de comentários).

## Testes

- `tests/feature/test_boards.py` — enrich, share email, create share_with, validação XOR
- `tests/feature/test_users_invite_lookup.py` — lookup, search, 401

## Passos manuais

```bash
make test
```

Frontend (`personal-planner-site`) pode migrar para e-mail/typeahead conforme doc atualizada.
