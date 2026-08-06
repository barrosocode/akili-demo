# Arquitetura — Portal do Responsável (Akili)

> **Atualização (2026-08-05):** o contrato visual e de route groups do repo `site` está em [ADR-018](./adr/ADR-018-Marketing-Architecture-Reconciliation.md) e [SPEC-019](./specs/SPEC-019-Architectural-Contract.md). Este documento permanece útil para BFF/auth/capabilities; trechos que citam shadcn/Tailwind como DS ativo estão **superseded**.

## Visão geral

Aplicação Next.js 16 para **responsáveis** (B2C e convidados pela escola), **marketing institucional** e área **aluno** (UI). Escolas operam no Admin (`../admin/`).

```
Browser → /api/* (BFF) → Laravel API (/client/auth/*, /guardian/*)
```

O browser **nunca** acessa a API Laravel diretamente.

**Design System oficial do `site`:** Kiddino (não Tailwind/shadcn). Ver SPEC-019.

## Estrutura de pastas

```
app/           # Rotas: (marketing), (auth), (dashboard), (aluno), (public), api/BFF
components/    # marketing/, portal/, theme/ (+ residual ui/ = dívida)
features/      # Domínios feature-first
services/      # bff/ (browser→/api) + queries/ (TanStack)
lib/           # api, auth, permissions, utils
types/         # Tipos compartilhados
providers/     # React providers
hooks/         # Hooks transversais
styles/        # marketing.css / overrides (tema Kiddino)
middleware.ts  # Proteção de rotas
```

## Autenticação

- Login unificado via `POST /api/auth/login` → Laravel `/client/auth/login`
- Destino por perfil (`lib/auth/portal-destination.ts`):
  - **Student** → cookies aluno + `/aluno`
  - **Guardian** → cookies portal + `/`
  - **Teacher / School / Admin / Coordinator** → `ADMIN_APP_URL` (sem cookies no site)
- Tokens em cookies **HttpOnly** (`lib/auth/cookies.ts` / `student-cookies.ts`)
- Guardian: `GET /api/auth/me` → Laravel `GET /client/auth/me` (sessão agregada)
- Aluno: `GET /api/student/auth/me` → Laravel `GET /mobile/auth/session`
- Sessão sanitizada (`SessionUser`) — sem UUID no browser; filhos usam `ref` opaco
- `account_origin`: `b2c` (tenant family) ou `school` (convidado pela escola) — define `canAddChildren`
- `subscription`: plano provisório (nome, limites, features) quando seedado na API
- First-access (status `invited`): OTP em `/first-access` → `POST /api/auth/otp/*` → Laravel `/auth/otp/*`
- Termos pendentes: gate em `GuardianGuard` → `/terms` (geolocalização **obrigatória**). **Alunos isentos** na API.

### Aceite de termos (forense)

- UI: `features/auth/components/terms-accept-form.tsx`
- Coletor: `lib/consent/forensics.ts` — prompt só no **clique** (“Permitir localização”)
- BFF `POST /api/consents/accept` exige lat/long e encaminha `X-Forwarded-For` / `User-Agent` / `Accept-Language`
- Header `Permissions-Policy: geolocation=(self)` em `next.config.ts`

## Capabilities

| Capability | B2C | Convite escola |
|------------|-----|----------------|
| `canAddChildren` | true | false |
| `canPurchase` | conforme permissão | conforme vínculo |

## Mapa BFF → Laravel

| BFF | Laravel |
|-----|---------|
| `POST /api/auth/login` | `POST /client/auth/login` |
| `GET /api/auth/me` | `GET /client/auth/me` (agregado portal) |
| `POST /api/auth/otp/request` | `POST /auth/otp/request` |
| `POST /api/auth/otp/verify` | `POST /auth/otp/verify` |
| `POST /api/auth/invite/accept` | `POST /guardian/invite/accept` |
| `GET /api/consents/pending` | `GET /consents/pending` |
| `GET /api/consents/documents/[key]` | `GET /consents/documents/{key}` |
| `POST /api/consents/accept` | `POST /consents/accept` |
| `GET /api/guardian/children` | `GET /guardian/students` |
| `GET /api/guardian/children/[ref]/progress` | `GET /guardian/students/{uuid}/progress` (kpis, materials, reports, school, classrooms, gamification, notifications, upcoming_content) |
| `GET /api/guardian/children/[ref]/learning` | `GET /guardian/students/{uuid}/learning` (ambiente do filho, read-only) |
| `GET /api/guardian/children/[ref]/contents/[uuid]` | `GET /guardian/students/{uuid}/contents/{uuid}` |
| `POST /api/student/auth/login` | `POST /mobile/auth/login` |
| `GET /api/student/auth/me` | `GET /mobile/auth/session` |
| `GET /api/student/dashboard` | `GET /mobile/student/dashboard` |
| `GET /api/student/materials` | `GET /mobile/student/materials` |
| `GET /api/student/contents/[uuid]` | `GET /mobile/contents/{uuid}` |
| `POST /api/student/contents/[uuid]/progress` | `POST /mobile/student/contents/{uuid}/progress` |
| `GET /api/profile` | `GET /guardian/me` |
| `PATCH /api/profile` | `PATCH /guardian/me` |
| `GET /api/guardian/purchases` | stub 501 |

### Features do dashboard (demo MVP)

| Feature | Pasta |
|---------|-------|
| Lista de filhos + plano | `features/children/` |
| Progresso (KPIs, disciplinas, evolução) | `features/progress/` |
| Gamificação (XP, medalhas, missões) | `features/gamification/` |
| Portal do aluno (dashboard, materiais, player em abas) | `features/student/`, `features/content-player/` (`StudentLessonPlayer`) |
| Redirect pós-login por perfil | `lib/auth/portal-destination.ts`, `lib/auth/establish-session.ts` |

Status guardian: [SPEC-018](./specs/SPEC-018-Portal-Status.md). Portal aluno: [SPEC-021](./specs/SPEC-021-Student-Web-Portal.md).

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
| TailAdmin | Kiddino (Bootstrap) |
