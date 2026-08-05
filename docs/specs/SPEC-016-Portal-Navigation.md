# SPEC-016 — Navegação Portal Kiddino

> Ratificada sob [ADR-018](../adr/ADR-018-Marketing-Architecture-Reconciliation.md) / [SPEC-019](./SPEC-019-Architectural-Contract.md).

| Campo | Valor |
| --- | --- |
| ID | SPEC-016 |
| Status | Aprovado |

## Auth

| Label | Href |
| --- | --- |
| Login | `/signin` |
| Recuperar senha | `/forgot-password` |
| Cadastro | `/cadastro` |
| Painel escola | `ADMIN_APP_URL` |

Redirects já existentes: `/login`→`/signin`, `/recuperar-senha`→`/forgot-password`.

CTAs LOGIN/CADASTRE-SE no chrome marketing: TopBar, barra do `SiteHeader` (desktop) e `MobileMenu`.

Middleware: rotas auth sempre acessíveis (mesmo com cookie de sessão presente/inválido).

Pós-login: full navigation (`window.location.assign`) para **`/`** (dashboard do responsável — Meus filhos). Query `?next=` honrada se for path relativo interno seguro (ex.: `/signin?next=/profile`).

## Responsável (sidebar)

| Label | Href |
| --- | --- |
| Meus filhos | `/` |
| Adicionar filho | `/children/new` |
| Compras | `/purchases` |
| Relatórios | `/relatorios` |
| Meus dados | `/profile` |
| Sair | logout BFF |

## Aluno (sidebar)

| Label | Href |
| --- | --- |
| Início | `/aluno` |
| Disciplinas | `/aluno/disciplinas` |
| Cadernos | `/aluno/cadernos` |
| Conteúdos recentes | `/aluno/recentes` |

## Public routes

Manter auth paths públicos; `/aluno/*` autenticado.
