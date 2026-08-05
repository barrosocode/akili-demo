# SPEC-014 — Arquitetura Portal Kiddino

| Campo | Valor |
| --- | --- |
| ID | SPEC-014 |
| Título | Arquitetura FE — Auth e Dashboards Kiddino |
| Status | Aprovado |
| Depende de | SPEC-013 |

## Tema compartilhado

```
components/theme/
  KiddinoThemeStyles.tsx   # <link> bootstrap + fa + style.css
  KiddinoRoot.tsx          # .marketing-root.layout4 + next/font
```

Marketing reexporta ou passa a usar `KiddinoRoot` / `KiddinoThemeStyles`.

CSS overrides: `styles/marketing-overrides.css` (escopo `.marketing-root`).

## Shells

| Shell | Composição |
| --- | --- |
| `AuthShell` | KiddinoRoot → MobileMenu → SiteHeader → main → SiteFooter → ScrollToTop |
| `GuardianDashboardShell` | KiddinoRoot → GuardianHeader → section sidebar+main → FooterClean |
| `AlunoDashboardShell` | KiddinoRoot → AlunoHeader → section sidebar+main → FooterClean |

## Routing

- Auth: `app/(auth)/layout.tsx` → `AuthShell` + import `marketing.css`
- Dashboard guardian: `app/(dashboard)/layout.tsx` → shell Kiddino (não shadcn)
- Home logada: `app/page.tsx` branch session → `GuardianDashboardShell`
- Aluno: `app/(aluno)/layout.tsx` + páginas sob `/aluno`

## Sessão / guard

- Guardian: `dashboards.guardian.view` (existente)
- Aluno: quando sessão indicar student dashboard, redirect para `/aluno`; caso contrário placeholders + link

## Isolamento Tailwind

Meta: remover uso de Tailwind nas rotas portal. `globals.css` mínimo ou sem `@import "tailwindcss"` após migração.
