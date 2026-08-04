# Arquitetura — Portal do Responsável (Akili)

## Visão geral

Aplicação Next.js 16 para **responsáveis** (B2C e convidados pela escola). Escolas operam no Admin (`../admin/`).

```
Browser → /api/* (BFF) → Laravel API (/client/auth/*, /guardian/*)
```

O browser **nunca** acessa a API Laravel diretamente.

## Estrutura de pastas

```
app/           # Rotas Next.js (auth, dashboard, api/BFF)
components/    # UI reutilizável (shadcn + compostos)
features/      # Domínios feature-first
services/      # bff/ (browser→/api) + queries/ (TanStack)
lib/           # api, auth, permissions, utils
types/         # Tipos compartilhados
providers/     # React providers
hooks/         # Hooks transversais
styles/        # Design tokens
middleware.ts  # Proteção de rotas
```

## Autenticação

- Login via `POST /api/auth/login` → Laravel `/client/auth/login`
- Tokens em cookies **HttpOnly** (`lib/auth/cookies.ts`)
- Sessão sanitizada via `toSessionUser()` — sem UUID no browser
- Apenas perfil `guardian` (`dashboards.guardian.view`)

## Capabilities

| Capability | B2C | Convite escola |
|------------|-----|----------------|
| `canAddChildren` | true | false |
| `canPurchase` | conforme permissão | conforme vínculo |

## Mapa BFF → Laravel

| BFF | Laravel |
|-----|---------|
| `POST /api/auth/login` | `POST /client/auth/login` |
| `GET /api/auth/me` | `GET /client/auth/me` |
| `POST /api/auth/invite/accept` | `POST /guardian/invite/accept` |
| `GET /api/guardian/children` | `GET /guardian/students` |
| `GET /api/guardian/children/[ref]/progress` | `GET /guardian/students/{uuid}/progress` |
| `PATCH /api/profile` | `PATCH /client/auth/me` |
| `GET /api/guardian/purchases` | stub 501 |

## Como adicionar uma feature

1. Criar `features/<nome>/` com schemas, types, components
2. Adicionar `services/bff/<nome>.bff.ts`
3. Adicionar queries/mutations em `services/queries/`
4. Criar Route Handler em `app/api/`
5. Thin page em `app/(dashboard)/`
6. Registrar permissão em `lib/permissions/route-permissions.ts`

## Variáveis de ambiente

Ver `.env.example`. **Nunca** usar `NEXT_PUBLIC_API_URL`.

Guia completo de desenvolvimento: [development.md](./development.md).

## Pré-requisito API

O BFF de autenticação depende do prefixo Laravel `/client/auth/*` (`auth_device: client`). Sem essa rota, login e sessão não funcionam em ambiente integrado.

## Diferenças vs Admin

| Admin | Site (este app) |
|-------|-----------------|
| Escola, professor, admin | Somente responsável |
| Bearer em sessionStorage | Cookies HttpOnly via BFF |
| Axios direto ao Laravel | BFF obrigatório |
| TailAdmin | shadcn/ui |
