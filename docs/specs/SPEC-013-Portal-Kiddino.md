# SPEC-013 — Portal Auth + Dashboard Kiddino

| Campo | Valor |
| --- | --- |
| ID | SPEC-013 |
| Título | Visão — Auth e Dashboards no visual Kiddino |
| Status | Aprovado |
| Repo | `site` |
| Revoga | SPEC-001 D-002 (portal shadcn intacto) **no repo `site`** |

## Decisão

O `site` usa **um único design system visual**: tema legado Kiddino (Bootstrap + `style.css` + Font Awesome), compartilhado entre marketing, auth e dashboards (responsável e aluno).

- **Sem Tailwind / shadcn** nas superfícies auth e dashboard.
- **Sem jQuery / Bootstrap JS** — interações em React.
- **BFF** permanece (`/api/*`); browser não chama Laravel.
- Admin (`admin/`) permanece TailAdmin (fora deste escopo).

## Superfícies

| Superfície | Shell | Rotas |
| --- | --- | --- |
| Marketing | `MarketingShell` | `(marketing)/*`, home pública |
| Auth | `AuthShell` (= chrome marketing) | `/signin`, `/forgot-password`, `/first-access`, `/invite` |
| Responsável | `GuardianDashboardShell` | `/` logado, `/children/*`, `/profile`, `/purchases`, `/checkout`, `/relatorios` |
| Aluno | `AlunoDashboardShell` | `/aluno/*` |

## Critérios de aceite

- [ ] Login e forgot-password com paridade visual Kiddino
- [ ] Dashboard responsável com header clean + sidebar + footer clean
- [ ] Dashboard aluno com shell próprio (UI mesmo se API parcial)
- [ ] Zero `components/ui` nas rotas migradas
