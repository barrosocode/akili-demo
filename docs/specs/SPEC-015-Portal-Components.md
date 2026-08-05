# SPEC-015 — Componentes Portal Kiddino

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
| `AuthShell` | `components/portal/auth/` | Server |
| `LoginForm` | `features/auth/components/` | Client |
| `ForgotPasswordForm` | `features/auth/components/` | Client |
| `GuardianDashboardShell` | `components/portal/guardian/` | Server |
| `GuardianHeader` | `components/portal/guardian/` | Server/Client (logout) |
| `GuardianSidebar` | `components/portal/guardian/` | Server |
| `FooterClean` | `components/portal/shared/` | Server |
| `ChildrenHomeKiddino` | `features/children/` | Client/Server |
| `AlunoDashboardShell` | `components/portal/aluno/` | Server |
| `AlunoHeader` / `AlunoSidebar` | `components/portal/aluno/` | Server |

## Reuso marketing

Header/Footer/MobileMenu/ScrollToTop do marketing em `AuthShell`.

Button marketing (`vs-btn`) para CTAs.
