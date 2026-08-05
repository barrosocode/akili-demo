# SPEC-009 — Performance

| Campo | Valor |
| --- | --- |
| ID | SPEC-009 |
| Título | Performance e Core Web Vitals — Marketing |
| Status | Draft |
| Depende de | SPEC-005, SPEC-006, SPEC-007 |

---

## Objetivo

Planejar a performance do site institucional no Next.js: imagens, fontes, JS, CSS, code splitting e metas de Core Web Vitals / Lighthouse — compatível com a meta de escala da plataforma, sem prometer números sem medição.

## Contexto

O legado carrega jQuery + >10 plugins + CSS de plugins mortos + Google Fonts blocking + hero em CSS background. A migração deve reduzir JS drasticamente e otimizar LCP.

Portal e marketing compartilham o mesmo deploy; regressões de bundle no portal devem ser evitadas (não importar tema no dashboard).

## Escopo

- `next/image`, `next/font`
- Lazy loading / dynamic import
- Script strategy
- Metas Lighthouse / CWV
- Orçamento de JS marketing

## Fora do escopo

- Testes de carga 14k usuários no front marketing (domínio ADR API)
- CDN multi-região (infra)
- Otimização offline de todas as 378 imagens do tema

## Dependências

- Assets SPEC-005
- Plugins SPEC-006
- CSS SPEC-007
- Hosting (Vercel ou equivalente) com Image Optimization

## Decisões arquiteturais

| ID | Decisão |
| --- | --- |
| PF-001 | Hero LCP: `next/image` priority ou CSS background com image preloaded — preferir `Image` fill + priority |
| PF-002 | Fonts só via `next/font` (Fredoka, Jost) |
| PF-003 | JS marketing runtime ≈ 0 legado; só React client islands |
| PF-004 | `dynamic(() => import(BlogCarousel), { ssr: false })` opcional se pesar hidratação |
| PF-005 | Sem `next/script` de plugins; EqualWeb only afterInteractive se aprovado |
| PF-006 | Medir antes/depois em staging com Lighthouse CI manual (QA) |
| PF-007 | Não afirmar scores em produção sem evidência |

## Alternativas consideradas

| Alternativa | Decisão |
| --- | --- |
| Manter bg CSS sem optimize | Pior LCP — rejeitado como default |
| AVIF forçado | next/image negocia automaticamente |
| Remover Bootstrap CSS | Quebra paridade — fase futura |

## Riscos

| Risco | Mitigação |
| --- | --- |
| `style.css` grande | Escopo marketing; compressão HTTP; critical path futuro |
| Hidratação MobileMenu | Island pequena |
| Image Optimization local Docker | Configurar remote/local patterns |
| Fonts subset | latin subset no next/font |

---

## Image Optimization / next/image

| Regra | Detalhe |
| --- | --- |
| Uso | Toda img de conteúdo (logo, seções, blog cards) |
| `alt` | Obrigatório, descritivo PT |
| Hero | `priority` + `sizes="100vw"` |
| Below fold | Default lazy |
| Formato | Deixar Next servir WebP/AVIF |
| Static | `/assets/...` local |

Backgrounds do tema: preferir converter para `<Image>` stacked; se inevitável CSS, usar `link rel=preload` da imagem LCP.

## next/font

```text
Fredoka: weights 400–700
Jost: weights 400–500
subsets: ["latin"]
display: swap
variable: --font-fredoka / --font-jost
```

Aplicar em `.marketing-root`. Remover links Google do legado.

## Lazy Loading

| Recurso | Estratégia |
| --- | --- |
| Imagens below-fold | nativo next/image |
| BlogCarousel | dynamic import se bundle > orçamento |
| FAQ accordion client | pequeno; import estático ok |
| EqualWeb | defer / afterInteractive |

## Dynamic Imports / Code Splitting

| Módulo | Dynamic? |
| --- | --- |
| `BlogCarousel` | Sim, se Embla/Swiper |
| `NewsletterForm` | Opcional |
| `MobileMenu` | Não (necessário cedo para UX) |
| Portal features | Nunca importar de marketing pages |

Route-based splitting: automático por `page.tsx`.

## Script Strategy

| Script | Strategy |
| --- | --- |
| Plugins legado | **Proibido** |
| EqualWeb (se sim) | `afterInteractive` ou `lazyOnload` |
| Analytics futuro | `lazyOnload` |

## Orçamento (diretrizes MVP)

| Métrica | Alvo interno staging | Nota |
| --- | --- | --- |
| JS blocking marketing | ≈ 0 além do Next runtime | Medir Coverage |
| LCP | < 2.5s (p75) mobile mid-tier | Evidência Lighthouse |
| CLS | < 0.1 | Dimensões imagens |
| INP | < 200ms | Menu/accordion |
| Lighthouse Performance | ≥ 80 mobile staging | Não gate cego |

## Lighthouse / Core Web Vitals

Checklist de medição (QA):

1. Home `/` mobile
2. `/faq`
3. `/preco-e-planos`
4. Comparar portal `/signin` sem regressão

Registrar links de reports no PR da Fase 6.

## Estratégia de implementação

1. Fonts + Image no Hero (maior ganho LCP).
2. Eliminar JS plugins (maior ganho TBT).
3. Carousel lazy.
4. Overrides CSS sem duplicar imports.
5. Medir e ajustar.

## Critérios de aceite

- [ ] Sem jQuery/plugins na rede
- [ ] Hero com imagem otimizada / priority
- [ ] Fonts sem request a fonts.googleapis.com
- [ ] Relatório Lighthouse staging anexado (Fase 6)
- [ ] CLS estável no header/logo

## Checklist técnico

- [ ] `sizes` corretos em grids blog
- [ ] Logos com width/height
- [ ] Dynamic import documentado se usado
- [ ] EqualWeb não no critical path
- [ ] Bundle analyzer opcional no Fase 6
