# Guia de desenvolvimento — Portal do Responsável

## Pré-requisitos

- Node.js 20+
- API Laravel Akili rodando em `http://localhost:8000`
- Rota de auth do cliente habilitada: `POST /api/v1/client/auth/login`

> A API deve expor o prefixo `/client/auth/*` com `auth_device: client`. No monorepo local, o arquivo vive em `api/routes/api/v1/client-auth.php`.

## Setup local

```bash
cd site
cp .env.example .env
npm install
npm run dev
```

| Serviço | URL |
|---------|-----|
| Portal | http://localhost:3000 |
| Admin (escolas) | http://localhost:3001 |
| API Laravel | http://localhost:8000/api/v1 |

## Variáveis de ambiente

| Variável | Escopo | Descrição |
|----------|--------|-----------|
| `LARAVEL_API_URL` | server | Base da API (inclui `/api/v1`) |
| `AUTH_COOKIE_NAME` | server | Cookie HttpOnly do access token |
| `AUTH_REFRESH_COOKIE_NAME` | server | Cookie HttpOnly do refresh |
| `COOKIE_SECURE` | server | `true` em produção |
| `ADMIN_APP_URL` | server | Link para escolas no layout de auth |
| `NEXT_PUBLIC_APP_NAME` | client | Nome exibido na UI |
| `NEXT_PUBLIC_APP_URL` | client | URL pública do portal |

**Nunca** definir `NEXT_PUBLIC_API_URL`.

## Fluxo de dados

```
Componente → services/bff/*.bff.ts → /api/* (Route Handler) → laravelRequest → Laravel
```

Queries e mutations ficam em `services/queries/`. Componentes **não** importam `axios` nem `fetch` para a API Laravel.

## Perfis e capabilities

| Origem | `canAddChildren` | Comportamento |
|--------|------------------|---------------|
| B2C | `true` | Pode cadastrar filhos após checkout |
| Convite escola | `false` | Só visualiza filhos já vinculados |

Lógica em `lib/permissions/guardian-capabilities.ts`.

## Rotas do app

### Públicas

| Rota | Descrição |
|------|-----------|
| `/` | Landing (visitante) ou home dos filhos (logado) |
| `/checkout` | Contratação B2C (stub) |
| `/signin` | Login |
| `/forgot-password` | Recuperação de senha (stub) |
| `/first-access` | Primeiro acesso (stub) |
| `/invite` | Aceitar convite da escola (stub) |

### Autenticadas (responsável)

| Rota | Descrição |
|------|-----------|
| `/children/new` | Cadastrar filho (somente B2C) |
| `/children/[ref]` | Relatórios do filho (mock Kiddino; `Ver detalhes` em Meus filhos) |
| `/purchases` | Compras e assinaturas |
| `/profile` | Perfil do responsável (nome, telefone, CPF → `GET/PATCH /api/profile` → `/guardian/me`) |

## Adicionar uma feature

1. `features/<nome>/` — components, hooks, schemas, types
2. `services/bff/<nome>.bff.ts` — chamadas ao BFF
3. `services/queries/<nome>.queries.ts` — TanStack Query
4. `app/api/<nome>/route.ts` — Route Handler
5. `app/(dashboard)/<nome>/page.tsx` — thin shell
6. Permissão em `lib/permissions/route-permissions.ts`

## Qualidade

```bash
npm run lint
npm run build
```

## Referências

- [architecture.md](./architecture.md) — visão arquitetural
- [cursor-rules.md](./cursor-rules.md) — divisão das regras Cursor (produto vs implementação)
- [../.cursor/rules/](../.cursor/rules/) — arquivos de regra do projeto
