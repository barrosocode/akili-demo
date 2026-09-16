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
| Portal (site) | http://localhost:3001 |
| Admin (escolas) | http://localhost:3000 |
| API Laravel | http://localhost:8000/api/v1 |

Convite de responsável (e-mail): a API usa `AKILI_GUARDIAN_INVITE_URL` apontando para
`http://localhost:3001/guardian/invite` — o aceite é no **site**, não no admin.

## Variáveis de ambiente

| Variável | Escopo | Descrição |
|----------|--------|-----------|
| `LARAVEL_API_URL` | server | Base da API (inclui `/api/v1`) |
| `AUTH_COOKIE_NAME` | server | Cookie HttpOnly do access token |
| `AUTH_REFRESH_COOKIE_NAME` | server | Cookie HttpOnly do refresh |
| `AUTH_ASSISTANCE_COOKIE_NAME` | server | Cookie HttpOnly do PAT `client-assistance` |
| `AUTH_SUPPORT_COOKIE_NAME` | server | Cookie HttpOnly do PAT `client-support` (mesa) |
| `AUTH_SUPPORT_REFRESH_COOKIE_NAME` | server | Refresh da mesa de suporte |
| `COOKIE_SECURE` | server | `false` em HTTP local; **`true` obrigatório em staging/produção HTTPS** (guardião, aluno, assistência e mesa) |
| `COOKIE_SAME_SITE` | server | Padrão `lax` |
| `ADMIN_APP_URL` | server | Link para escolas no layout de auth / retorno pós-assistência |
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
| `/` | Landing (visitante) ou home dos filhos (logado); sem marketing se cookie de assistência |
| `/checkout` | Contratação B2C (stub) |
| `/signin` | Login unificado (redirect por perfil: aluno → `/aluno`, responsável → `/`, escola → admin) |
| `/forgot-password` | Recuperação de senha (stub) |
| `/first-access` | Primeiro acesso (stub) |
| `/invite` | Aceitar convite da escola (stub) |
| `/assistance/adopt` | Handoff one-time (`?code=`) → cookie assistência → `/assistance/entrar` |
| `/assistance/entrar` | Bridge: espera sessão de assistência e entra no dashboard |
| `/suporte/entrar` | Login da mesa de atendimento (`client-support`) |

### Mesa de atendimento (operador)

| Rota | Descrição |
|------|-----------|
| `/suporte` | Busca de responsáveis (cookie mesa) |
| `/suporte/usuarios/[uuid]` | Detalhe + iniciar assistência (start+adopt via BFF) |

Assistance read-only e mesa: [support-assistance.md](./support-assistance.md).

### Autenticadas (responsável)

| Rota | Descrição |
|------|-----------|
| `/children` | Lista de filhos (mesma experiência da home logada em `/`) |
| `/children/new` | Cadastrar filho (somente B2C) |
| `/children/[ref]` | Progresso, relatórios e conquistas via API demo (BFF `/api/guardian/children/[ref]/progress`) |
| `/purchases` | Compras e assinaturas |
| `/profile` | Perfil do responsável (nome, telefone, CPF → `GET/PATCH /api/profile` → `/guardian/me`) |
| `/relatorios` | Atalho para relatórios do filho ativo / lista |

### Autenticadas (aluno)

| Rota | Descrição |
|------|-----------|
| `/aluno/entrar` | Login do aluno (cookies separados do responsável) |
| `/aluno` | Dashboard — KPIs, continuar estudando, materiais |
| `/aluno/materiais` | Lista de materiais via entitlements |
| `/aluno/materiais/[contentUuid]` | Player em abas (Conteúdo / Conferência / Revisões / Desafio), fullBleed |
| `/aluno/supervisao/[childRef]` | Guardian — ambiente do filho (somente leitura; sessão responsável) |
| `/aluno/supervisao/[childRef]/materiais` | Materiais do filho na supervisão |
| `/aluno/supervisao/[childRef]/materiais/[contentUuid]` | Player read-only na supervisão |

Navegação por portal: `lib/auth/portal-paths.ts`. Na supervisão, **Início** volta ao dashboard do responsável (`/`), não para `/aluno`.

Credenciais demo: `luiza@familia.dev` / `123123` (Ciências) ou `aluno@escola-exemplo.dev` / `123123`. Ver [SPEC-021](./specs/SPEC-021-Student-Web-Portal.md).

**Layout Kiddino no portal:** não usar a classe `.badge` do tema (é `position: absolute`). Preferir `portal-chip` e CTAs `vs-btn` / `vs-btn style3` — ver [SPEC-018](./specs/SPEC-018-Portal-Status.md).

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
