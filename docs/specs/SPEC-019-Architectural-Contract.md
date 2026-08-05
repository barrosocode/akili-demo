# SPEC-019 — Contrato Arquitetural Vigente (Site)

| Campo | Valor |
| --- | --- |
| ID | SPEC-019 |
| Título | Contrato Arquitetural Vigente — Repo `site` |
| Status | **Vigente** |
| Data | 2026-08-05 |
| Depende de | [ADR-018](../adr/ADR-018-Marketing-Architecture-Reconciliation.md) |
| Substitui (parcial) | Trechos dual-DS de SPEC-001, A-002 de SPEC-002, CSS-002/003/008 de SPEC-007 |

> Este documento é a **fonte operacional** da arquitetura atual. Histórico: SPEC-001…018 + ADR-018.

---

## Arquitetura oficial vigente

Monólito Next.js App Router no repo **`site`**, com:

- **Um Design System visual:** Kiddino (Bootstrap CSS + Font Awesome + `public/assets/css/style.css` + `styles/marketing-overrides.css`).
- **Sem jQuery / Bootstrap JS** nas superfícies de produto.
- **BFF** `/api/*` → Laravel; browser nunca chama a API Laravel diretamente.
- **Admin** (`admin/`) fora deste contrato (TailAdmin).

```text
app/
  layout.tsx                 # providers + globals mínimos (sem Tailwind ativo)
  page.tsx                   # D-008a: !session → marketing home; session → portal responsável
  (marketing)/               # páginas institucionais
  (auth)/                    # login, forgot, invite, first-access
  (dashboard)/               # responsável autenticado (children, profile, …)
  (aluno)/                   # área aluno (UI; API/BFF a evoluir)
  (public)/                  # checkout público
components/
  theme/                     # KiddinoRoot, KiddinoThemeStyles (kernel CSS)
  marketing/                 # shell e seções institucionais
  portal/                    # auth / guardian / aluno shells
```

---

## Route Groups — organização e fronteiras

| Group | Responsabilidade | Shell | Autenticação |
| --- | --- | --- | --- |
| `(marketing)` | Páginas institucionais (sobre, blog, faq, …) | `MarketingShell` | Pública |
| `(auth)` | Login / recuperar senha / invite / first-access | `MarketingShell` (`AuthShell` = wrapper fino) | Pública — **sempre acessível** no middleware (mesmo com cookie residual) |
| `(dashboard)` | Portal responsável (filhos, perfil, compras, relatórios) | `GuardianDashboardShell` | Guardian |
| `(aluno)` | Área de estudos do aluno | `AlunoDashboardShell` | Autenticada (guard a especializar) |
| `(public)` | Checkout e fluxos públicos auxiliares | Conforme página | Mista |
| `app/page.tsx` | Home `/` — **não** existe `(marketing)/page.tsx` (A-009) | Marketing **ou** Guardian | Bifurca sessão |

**Isolamento:** route groups isolam **rotas e composição de chrome**, não um segundo design system. CSS Kiddino é compartilhado pelas superfícies que usam o tema.

---

## Estratégia de CSS (vigente)

1. **Não** carregar o tema em `globals.css` (CSS-001 **mantida**).
2. Tema legado via **`<link href="/assets/css/…">`** em `KiddinoThemeStyles` (substitui CSS-002 `@import` bundlado — preserva `url(../img/…)`).
3. Overrides em `styles/marketing-overrides.css`, importados por `styles/marketing.css` (nome histórico; semanticamente = entry Kiddino).
4. Layouts/shells que usam o tema importam `marketing.css` e montam `KiddinoRoot` (classe `marketing-root layout4`).
5. Tailwind/shadcn **não** são DS ativo; residual `components/ui` = dívida de limpeza.

---

## Design System oficial

| Camada | Oficial |
| --- | --- |
| Visual / CSS | Kiddino + overrides |
| Componentes institucionais | `components/marketing/**` |
| Componentes portal | `components/portal/**` |
| Kernel tema | `components/theme/**` |
| CTAs tema | `vs-btn` (`components/marketing/common/Button`) |
| Proibido nas rotas ativas | Misturar `components/ui` shadcn com páginas Kiddino |

---

## Responsabilidades por módulo

| Módulo | Faz | Não faz |
| --- | --- | --- |
| `components/marketing` | Shell e seções do site institucional | Regras de sessão / BFF de filhos |
| `components/portal` | Shells auth/guardian/aluno | Conteúdo CMS |
| `components/theme` | Carregar CSS/fonts do tema | Navegação de produto |
| `features/*` | Domínio (auth, children, profile…) + forms | Estilo Tailwind/shadcn |
| `constants/*` | Copy e dados estáticos tipados | Secrets |
| `app/api/*` | BFF | UI |

---

## Fronteiras marketing × auth × dashboard × aluno

| De → Para | Permitido | Proibido |
| --- | --- | --- |
| Marketing → Auth | `Link` para `/signin`, `/cadastro` (header, TopBar e menu mobile) | Importar `GuardianDashboardShell` |
| Auth → Marketing | Header/footer via `MarketingShell` | Lógica de filhos/purchases na página de login |
| Dashboard → Marketing | Links de saída / branding | Misturar `MarketingHome` no shell logado |
| Aluno → Dashboard | Navegação futura por tipo de sessão | Assumir `GuardianGuard` como modelo final de authz |

### Sessão e middleware (auth)

- Rotas `isAuthPath` (`/signin`, `/forgot-password`, `/first-access`, `/invite`) **nunca** são redirecionadas pelo middleware com base só na presença de cookie.
- Cookie inválido: limpeza em Route Handler (`GET /api/auth/me` em **401**/sessão null, logout) — **não** em Server Components (`fetchAuthUser`) nem em 5xx do `/me`.
- Pós-login: full navigation para `/` (dashboard) ou `?next=` seguro.
- `hasSessionCookie` só bloqueia rotas **privadas** sem cookie → redirect para `/signin?next=…`.

---

## Relação com SPECs históricas

Contrato vivo: **ADR-018 + esta SPEC-019**.  
Histórico dual-DS: SPEC-001/002/007 (trechos marcados Superseded).  
Marketing backlog: SPEC-011/012.  
Portal backlog: SPEC-013…018.
