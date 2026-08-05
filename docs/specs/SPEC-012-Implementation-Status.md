# SPEC-012 — Status de Implementação (Marketing)

> Contrato vigente após reconciliação: [ADR-018](../adr/ADR-018-Marketing-Architecture-Reconciliation.md) + [SPEC-019](./SPEC-019-Architectural-Contract.md). O resumo abaixo descreve o MVP marketing; a menção a “isolamento do portal Tailwind/shadcn” é **Historical** (portal unificado em Kiddino via SPEC-013).

| Campo | Valor |
| --- | --- |
| ID | SPEC-012 |
| Título | Status de Implementação — Site Institucional |
| Status | Entregue (MVP) |
| Depende de | SPEC-001 … SPEC-011 |
| Repo | `site` |
| Data | 2026-08-05 |

---

## Resumo

Migração do site institucional legado (`layout_old`) para Next.js App Router no monorepo `site`, com route group `(marketing)` e shell institucional.

- Home pública em `/` (branch `!session`) com seções Hero → CTA
- Páginas institucionais, SEO (metadata, sitemap, robots, JSON-LD)
- Rotas públicas no middleware + redirects legado
- **Pós-MVP portal:** mesmo DS Kiddino no auth/dashboard (ADR-018) — não reabrir dual-DS

## Como testar localmente

```bash
cd site && npm run dev
```

| URL | Esperado |
| --- | --- |
| `/` (deslogado) | Home marketing + shell |
| `/faq`, `/sobre-nos`, `/blog`, … | Páginas com breadcrumb |
| `/blogs`, `/login` | Redirect 308 → `/blog`, `/signin` |
| `/sitemap.xml`, `/robots.txt` | Gerados |

Logado em `/` continua o portal do responsável (sem CSS Bootstrap).

## Inventário por épico

### Foundation / infra

| ID | Item | Status |
| --- | --- | --- |
| 001–003 | Route group, MarketingRoot, marketing.css | Feito |
| 004 | Bootstrap CSS only + overrides | Feito (`MarketingThemeStyles` + overrides) |
| 005 / 058 | `next/font` Fredoka/Jost | Feito |
| 006–009 | site / nav / seo / home-content | Feito |
| 010 | ScrollToTop | Feito |
| 011 | `public-routes` | Feito |
| 012 | Redirects legado | Feito |
| 013–015 | faq / blog / types | Feito |

### Layout / common

| ID | Item | Status |
| --- | --- | --- |
| 016–029 | Logo … SectionTitle, Shell, Breadcrumb | Feito |
| 023 | MobileMenu + hook | Feito |

### Home

| ID | Item | Status |
| --- | --- | --- |
| 030–035 | Hero … FaqSection | Feito |
| 036–040 | Blog* / HomeCta / MarketingHome | Feito |
| 041–042 | `app/page.tsx` + PublicMarketingHome | Feito |

### Páginas

| ID | Rota | Status |
| --- | --- | --- |
| 043 | `/sobre-nos` | Feito |
| 044 | `/series` | Feito (MVP editorial) |
| 045 | `/blog` | Feito (lista estática) |
| 046 | `/faq` | Feito |
| 047 | `/contato` | Feito (mailto/tel; sem backend) |
| 048 | `/cadastro` | Feito (CTA → `/checkout`) |
| 049 | `/newsletter` | Feito (form stub) |
| 050 | `/preco-e-planos` | Feito (planos placeholder) |

### SEO / Performance

| ID | Item | Status |
| --- | --- | --- |
| 051, 055, 056 | Metadata / OG / canonical | Feito |
| 052–053 | Sitemap / robots | Feito |
| 054 | JSON-LD | Feito |
| 057 | `next/image` nas seções | Feito |
| 059–060 | Lazy below-fold / dynamic carousel | Feito (default Image + dynamic BlogCarousel) |
| 061 | Lighthouse staging | **Pendente (QA)** |

## Decisões técnicas relevantes

1. **CSS do tema:** Bootstrap / FontAwesome / `style.css` via `<link href="/assets/css/…">` (`MarketingThemeStyles`), não via `@import` bundlado — preserva `url(../img/…)`.
2. **Home `/`:** sem `(marketing)/page.tsx` (A-009). Branch `!session` faz dynamic import de `PublicMarketingHome` (inclui `marketing.css` + shell).
3. **Carousel:** CSS scroll-snap (sem Slick/jQuery/Embla).
4. **FAQ accordion:** Client Component acessível (sem Bootstrap JS).
5. **N-006:** “Cadastre-se” → `/cadastro`; conversão → `/checkout`.

## Pendências / follow-ups

- [ ] **MARKETING-061** — Lighthouse em staging + relatório
- [ ] Copy/produto: contato, redes, planos, séries (`TODO(produto)` nos constants)
- [ ] Páginas de detalhe de post (`/blog/[slug]`)
- [ ] Newsletter: integração BFF real
- [ ] Remover ou arquivar `layout_old/` quando referência não for mais necessária
- [ ] Deprecar definitivamente `components/layout/public-home.tsx` (stub)

## Árvore principal

```
app/(marketing)/          # páginas institucionais + layout
app/page.tsx              # bifurca sessão → marketing | portal
components/marketing/     # UI institucional
constants/                # conteúdo tipado
styles/marketing*.css     # entry overrides
public/assets/            # tema + imagens
docs/specs/               # SPEC-001…012
```

## Critérios de aceite deste documento

- [x] Status alinhado ao código entregue
- [x] Pendências explícitas (061, produto, CMS)
- [x] Instruções de smoke test
