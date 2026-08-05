# SPEC-016 — Navegação Portal Kiddino

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
