# SPEC-008 — SEO

| Campo | Valor |
| --- | --- |
| ID | SPEC-008 |
| Título | SEO do Site Institucional |
| Status | Draft |
| Depende de | SPEC-001, SPEC-002, SPEC-004 |

---

## Objetivo

Definir a estratégia de SEO técnico da área marketing no Next.js App Router: Metadata API, Open Graph, Twitter Cards, sitemap, robots, canonical, JSON-LD e relação com performance.

## Contexto

O legado (`headView.php`) usa title genérico, description/keywords do template Kiddino (“Children School…”), e `robots INDEX,FOLLOW`. Isso é **inadequado** para produção Akili e deve ser corrigido na migração — não replicar meta do template.

Portal atual: metadata default “Akili — Portal do Responsável”. Marketing precisa de identity própria sem quebrar titles do dashboard.

## Escopo

- Metadata por página marketing
- OG/Twitter
- Sitemap/robots
- Canonical
- Schema.org (Organization, WebSite, FAQPage, BreadcrumbList)
- Boas práticas de performance SEO

## Fora do escopo

- Conteúdo editorial/blog CMS completo
- Campanhas SEM/SEO off-page
- Internacionalização hreflang

## Dependências

- `constants/site.ts` (`siteUrl`, brand, contact)
- Rotas SPEC-004
- `next/image` alt texts (SPEC-009)
- Domínio de produção (env `NEXT_PUBLIC_SITE_URL` ou similar **sem** expor API)

## Decisões arquiteturais

| ID | Decisão |
| --- | --- |
| SEO-001 | Metadata API (`export const metadata` / `generateMetadata`) obrigatória |
| SEO-002 | Template title marketing: `%s \| Akili Educ` |
| SEO-003 | Canonical absoluto por página |
| SEO-004 | `app/sitemap.ts` e `app/robots.ts` cobrindo rotas marketing |
| SEO-005 | JSON-LD via componentes Server (SPEC-003) |
| SEO-006 | Não usar keywords meta stuffing |
| SEO-007 | Páginas stub podem usar description honesta; evitar thin content indexável sem valor — `robots: { index: false }` temporário se produto pedir |

## Alternativas consideradas

| Alternativa | Decisão |
| --- | --- |
| `next-seo` package | Desnecessário no App Router |
| Só OG no root | Insuficiente — por página |
| SSR HTML snapshot legado | Rejeitado |

## Riscos

| Risco | Mitigação |
| --- | --- |
| Title portal vaza em marketing | Layout marketing sobrescreve metadata |
| Domínio errado em canonical | Env único `SITE_URL` |
| Duplicata `/` vs `/home` | Redirect 308 (SPEC-004) |
| FAQ sem schema | `FAQPageJsonLd` na home e `/faq` |

---

## Metadata API

### Root vs Marketing

| Superfície | Title default | Description |
| --- | --- | --- |
| Portal (auth/dashboard) | Portal do Responsável | Mantém atual |
| Marketing | Akili Educ — aprendizado com neurociência | Copy aprovado produto |

Exemplo contrato por página:

| Rota | Title | Description (diretriz) |
| --- | --- | --- |
| `/` | Aprendizado eficiente para crianças \| Akili Educ | Plataforma… |
| `/sobre-nos` | Sobre Nós \| Akili Educ | Quem somos… |
| `/series` | Séries \| Akili Educ | … |
| `/blog` | Blog \| Akili Educ | … |
| `/preco-e-planos` | Preço e Planos \| Akili Educ | … |
| `/faq` | FAQ \| Akili Educ | … |
| `/cadastro` | Cadastre-se \| Akili Educ | … |
| `/contato` | Contato \| Akili Educ | … |
| `/newsletter` | Newsletter \| Akili Educ | … |

Campos obrigatórios: `title`, `description`, `alternates.canonical`, `openGraph`, `twitter`, `robots`.

Ícones: mapear `public/assets/favicons/*`.

## Open Graph

| Propriedade | Valor |
| --- | --- |
| `og:type` | `website` (article no post futuro) |
| `og:locale` | `pt_BR` |
| `og:site_name` | Akili Educ |
| `og:title` / `og:description` | Espelham metadata |
| `og:url` | Canonical |
| `og:image` | Asset marca aprovado (ex. logo ou hero) ≥ 1200×630 recomendado |

## Twitter Cards

| Campo | Valor |
| --- | --- |
| `card` | `summary_large_image` |
| `title` / `description` / `images` | Alinhados ao OG |

## Sitemap

`app/sitemap.ts` inclui todas rotas marketing públicas + `/` + `/checkout` (se indexável).

Excluir: `/signin`, `/forgot-password`, `/invite`, áreas autenticadas.

`changeFrequency` / `priority` sugeridos:

| Rota | priority |
| --- | --- |
| `/` | 1.0 |
| `/preco-e-planos`, `/cadastro` | 0.9 |
| `/sobre-nos`, `/faq` | 0.8 |
| `/blog`, `/series` | 0.7 |
| `/contato`, `/newsletter` | 0.5 |

## Robots

`app/robots.ts`:

- Allow marketing e estáticos
- Disallow `/api/`, áreas dashboard se aplicável
- `sitemap: ${SITE_URL}/sitemap.xml`

## Canonical

Toda página marketing define `alternates.canonical = `${SITE_URL}${pathname}``.  
Trailing slash: seguir padrão Next config (sem slash, consistente).

## JSON-LD / Schema.org

| Tipo | Onde | Conteúdo |
| --- | --- | --- |
| `Organization` | Layout marketing | name, url, logo, sameAs redes |
| `WebSite` | Home | name, url, potentialAction SearchAction opcional (se busca existir) |
| `FAQPage` | Home FAQ + `/faq` | Perguntas/respostas texto puro |
| `BreadcrumbList` | Páginas internas | Home → Página |
| `ContactPage` | `/contato` | Opcional |

Não expor e-mails de forma que incentive scraping além do já público no footer.

## Breadcrumb SEO

Visual (SPEC-003) + `BreadcrumbJsonLd` + HTML semântico `<nav aria-label="Breadcrumb">`.

## Performance SEO

| Prática | Spec |
| --- | --- |
| LCP hero otimizado | SPEC-009 `priority` na imagem hero |
| CLS | width/height images |
| Indexação JS | Conteúdo principal em RSC (HTML no first paint) |
| Links internos | `next/link` crawlable anchors |
| Heading hierarchy | Um `h1` por página |

## Estratégia de implementação

1. `constants/site.ts` com `siteUrl`.
2. Metadata no `(marketing)/layout.tsx` + por `page.tsx`.
3. JSON-Ld componentes.
4. `sitemap.ts` / `robots.ts`.
5. Validar com Rich Results / OG debugger em staging.

## Critérios de aceite

- [ ] Nenhuma página marketing com meta Kiddino/template
- [ ] View-source contém title/description corretos (RSC)
- [ ] `/sitemap.xml` lista rotas marketing
- [ ] `/robots.txt` aponta sitemap
- [ ] FAQPage JSON-LD válido (quando FAQ renderizado)
- [ ] OG image resolve 200

## Checklist técnico

- [ ] Copy meta aprovado por produto
- [ ] `SITE_URL` configurado por ambiente
- [ ] Favicons no metadata
- [ ] Redirects anti-duplicata ativos
- [ ] Auditoria Lighthouse SEO ≥ meta acordada (SPEC-009)
