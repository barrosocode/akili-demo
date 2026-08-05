# SPEC-015 — Componentes Portal Kiddino

> Ratificada sob [ADR-018](../adr/ADR-018-Marketing-Architecture-Reconciliation.md) / [SPEC-019](./SPEC-019-Architectural-Contract.md).

| Campo | Valor |
| --- | --- |
| ID | SPEC-015 |
| Status | Aprovado |
| Depende de | SPEC-014 |

## Catálogo

| Componente | Path | Server/Client |
| --- | --- | --- |
| `KiddinoThemeStyles` | `components/theme/` | Server |
| `KiddinoRoot` | `components/theme/` | Server |
| `AuthShell` | `components/portal/auth/` | Server — thin wrapper de `MarketingShell` |
| `LoginForm` | `features/auth/components/` | Client |
| `ForgotPasswordForm` | `features/auth/components/` | Client |
| `GuardianDashboardShell` | `components/portal/guardian/` | Server |
| `GuardianHeader` | `components/portal/guardian/` | Server/Client (logout) |
| `GuardianSidebar` | `components/portal/guardian/` | Client (pathname → item ativo; “Meus filhos” → `/children`) |
| `FooterClean` | `components/portal/shared/` | Server |
| `ChildrenHome` | `features/children/` | Client — lista em `/` e `/children` |
| `ChildDetail` | `features/children/` | Client — detalhe `/children/[ref]` |
| `PerformanceBadge` | `features/progress/` | Server — chip `portal-chip` (não `.badge`) |
| `AlunoDashboardShell` | `components/portal/aluno/` | Server |
| `AlunoHeader` / `AlunoSidebar` | `components/portal/aluno/` | Server |

## Tokens de UI do portal

Em `styles/marketing-overrides.css` (escopo `.marketing-root`): `portal-chip`, `portal-page-header`, `portal-child-card`, `portal-child-tabs`, `portal-block-heading`, contraste de `vs-btn` / `style3`. Detalhe e smoke: [SPEC-018](./SPEC-018-Portal-Status.md).

## Reuso marketing

`(auth)/layout` e `AuthShell` usam **`MarketingShell`** (mesmo chrome: TopBar, SiteHeader, MobileMenu, footer).

CTAs de auth no chrome: `authLinks.login` / `authLinks.register` no TopBar, barra principal do `SiteHeader` (desktop) e `MobileMenu`.
