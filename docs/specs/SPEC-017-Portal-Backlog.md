# SPEC-017 — Backlog Portal Kiddino

> Continuidade sob [ADR-018](../adr/ADR-018-Marketing-Architecture-Reconciliation.md) / [SPEC-019](./SPEC-019-Architectural-Contract.md). MVP entregue (SPEC-018); follow-ups (StudentGuard, BFF forgot-password, limpeza `components/ui`) permanecem válidos.

| Campo | Valor |
| --- | --- |
| ID | SPEC-017 |
| Status | MVP entregue — follow-ups abertos |
| Prefixo | `PORTAL-NNN` |

## Tarefas

| ID | Título | Prioridade |
| --- | --- | --- |
| PORTAL-001 | `KiddinoThemeStyles` + `KiddinoRoot` compartilhados | P0 |
| PORTAL-002 | `AuthShell` + layout `(auth)` | P0 |
| PORTAL-003 | Login Kiddino (`LoginForm`) | P0 |
| PORTAL-004 | Forgot-password Kiddino (pedir e-mail + reset token UI) | P0 |
| PORTAL-005 | First-access + Invite chrome Kiddino | P1 |
| PORTAL-006 | `GuardianDashboardShell` + header + sidebar + footer clean | P0 |
| PORTAL-007 | Home filhos Kiddino | P0 |
| PORTAL-008 | Children new / detail Kiddino | P0 |
| PORTAL-009 | Profile Kiddino | P1 |
| PORTAL-010 | Purchases + checkout Kiddino | P1 |
| PORTAL-011 | Relatórios responsável | P2 |
| PORTAL-012 | `AlunoDashboardShell` + home | P0 |
| PORTAL-013 | Páginas aluno (disciplinas, cadernos, placeholders) | P1 |
| PORTAL-014 | Purge Tailwind/shadcn das rotas portal | P0 |
| PORTAL-015 | SPEC-018 status + commits | P0 |

## DoD global

- Sem `any`; sem UUID na UI
- Loading/error/empty
- Sem jQuery
- Sem testes automatizados (salvo pedido)
