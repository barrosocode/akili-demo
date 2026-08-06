# SPEC-016 — Navegação Portal Kiddino

> Ratificada sob [ADR-018](../adr/ADR-018-Marketing-Architecture-Reconciliation.md) / [SPEC-019](./SPEC-019-Architectural-Contract.md).  
> Paths canônicos: [`lib/auth/portal-paths.ts`](../../lib/auth/portal-paths.ts). Ver também [SPEC-021](./SPEC-021-Student-Web-Portal.md).

| Campo | Valor |
| --- | --- |
| ID | SPEC-016 |
| Status | Aprovado |

## Auth

| Label | Href |
| --- | --- |
| Login unificado | `/signin` |
| Login aluno | `/aluno/entrar` |
| Recuperar senha | `/forgot-password` |
| Cadastro | `/cadastro` |
| Painel escola | `ADMIN_APP_URL` |

Redirects já existentes: `/login`→`/signin`, `/recuperar-senha`→`/forgot-password`, `/student`→`/aluno`.

CTAs LOGIN/CADASTRE-SE no chrome marketing: TopBar, barra do `SiteHeader` (desktop) e `MobileMenu`.

Middleware: rotas auth sempre acessíveis (mesmo com cookie de sessão presente/inválido).

Pós-login (`resolveUnifiedLoginRedirect`):

| Portal | Default | `?next=` |
| --- | --- | --- |
| Guardian | `/` | Paths do portal responsável; `/aluno/supervisao/...` permitido; **`/aluno` puro bloqueado** |
| Student | `/aluno` | Só paths sob `/aluno` (exceto supervisão) |
| Admin | `ADMIN_APP_URL` | — |

## Responsável (sidebar)

| Label | Href |
| --- | --- |
| Início | `/` |
| Meus filhos | `/children` |
| Adicionar filho | `/children/new` |
| Compras | `/purchases` |
| Relatórios | `/relatorios` |
| Meus dados | `/profile` |
| Sair | logout BFF (`/api/auth/logout`) |

Logo do header → `/`.

## Aluno (sidebar)

| Label | Href |
| --- | --- |
| Início | `/aluno` |
| Materiais | `/aluno/materiais` |

Logo do header → `/aluno`. Logout → `/aluno/entrar`.

Aliases legados (`/aluno/disciplinas`, `/cadernos`, `/recentes`) redirecionam para `/aluno/materiais`.

## Supervisão (responsável no shell do aluno)

Sessão **guardian**; middleware exige cookie do responsável.

| Label | Href |
| --- | --- |
| Início | `/` (portal do responsável) |
| Ambiente do aluno | `/aluno/supervisao/{childRef}` |
| Materiais | `/aluno/supervisao/{childRef}/materiais` |

Nunca apontar Início/Materiais para `/aluno` ou `/aluno/materiais` (exigem sessão student).

## Public routes

Manter auth paths públicos; `/aluno/*` autenticado (student), exceto `/aluno/entrar` e `/aluno/supervisao/*` (guardian).
