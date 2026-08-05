# SPEC-005 — Assets

> Vigente. CSS do tema via `<link>` (ADR-018) — inventário de arquivos permanece.

| Campo | Valor |
| --- | --- |
| ID | SPEC-005 |
| Título | Inventário e Estratégia de Assets |
| Status | Draft · alinhada ADR-018 |
| Depende de | SPEC-001 |

---

## Objetivo

Mapear todos os assets do site institucional em `public/assets`, classificar utilização real vs legado morto, e definir o que manter, remover do carregamento crítico, ou substituir na migração Next.js.

## Contexto

Assets já estão em `site/public/assets/` (não recopiar). O legado referencia via `ASSETS_SITE`. No Next, paths públicos são `/assets/...`.

Contagens (auditoria): CSS 6 · JS 16 · Fonts FA 25 · Favicons 27 · `images/` 27 · `img/` 378.

## Escopo

CSS, JS, imagens, ícones, fontes, favicons, plugins estáticos.

## Fora do escopo

- Otimização binária massiva de 378 imagens do tema (fase performance seletiva)
- CDN/S3 (futuro infra)
- Remoção física imediata de arquivos não usados (pode ser fase de limpeza pós-aceite)

## Dependências

- SPEC-006 (plugins)
- SPEC-007 (CSS)
- SPEC-009 (imagens/`next/image`)

## Decisões arquiteturais

| ID | Decisão |
| --- | --- |
| AS-001 | Base path `/assets/` imutável nesta migração |
| AS-002 | Carregar no marketing apenas CSS/fontes necessários |
| AS-003 | JS de plugins: não carregar via layout; substituir por React |
| AS-004 | Imagens Akili em `images/` são prioritárias; `img/` sob demanda |
| AS-005 | Favicons migrar via Metadata API + arquivos existentes |
| AS-006 | Limpeza física de assets mortos só após aceite visual |

## Alternativas consideradas

| Alternativa | Decisão |
| --- | --- |
| Mover tudo para `public/marketing/` | Desnecessário; quebra paths |
| SVG system no lugar de FA | Fase redesign futura |
| Self-host apenas subset FA | Desejável depois; MVP usa `fontawesome.min.css` |

## Riscos

| Risco | Mitigação |
| --- | --- |
| 404 por path PHP diferente | Padronizar `/assets/...` |
| CSS FA + paths `../fonts` | Validar URLs relativas no browser |
| `style.css` gigante | Aceitar no MVP; tree-clean depois |
| Imagens sem dimensões | Sempre width/height ou `fill` + sizes |

---

## CSS

| Arquivo | Localização | Utilização | Páginas | Manter? | Remover do load? | Substituir? |
| --- | --- | --- | --- | --- | --- | --- |
| `bootstrap.min.css` | `public/assets/css/` | Grid, utilitários, accordion classes | Marketing | Sim (load) | Não | Não no MVP |
| `style.css` | idem | Tema Kiddino/Akili | Marketing | Sim (load) | Não | Redesign futuro |
| `fontawesome.min.css` | idem | Ícones | Marketing | Sim (load) | Não | Lucide futuro opcional |
| `slick.min.css` | idem | Carousel | Blog | Não no layout | **Sim** | CSS do carousel React |
| `magnific-popup.min.css` | idem | Lightbox | Dashboard legado | Não | **Sim** | Dialog React se necessário |
| `layerslider.min.css` | idem | Slider | Nenhum ativo | Não | **Sim** | — |

**Ordem de load (marketing):** ver SPEC-007.

---

## JavaScript

| Arquivo | Localização | Utilização legado | Manter arquivo? | Carregar no Next? | Substituir? |
| --- | --- | --- | --- | --- | --- |
| `vendor/jquery-3.6.0.min.js` | `js/vendor/` | Base plugins | Arquivo ok | **Não** | React |
| `main.js` | `js/` | Menu, sticky, slick wrapper, bg | Arquivo ok | **Não** | Hooks React |
| `main.js.old` | `js/` | Backup | Irrelevante | **Não** | Deletar na limpeza |
| `bootstrap.min.js` | `js/` | Collapse | Arquivo ok | **Não** | `FaqAccordion` |
| `slick.min.js` | `js/` | Carousel | Arquivo ok | **Não** | `BlogCarousel` |
| `jquery.magnific-popup.min.js` | `js/` | Video popup | Arquivo ok | **Não** | Dialog |
| `layerslider.*.js` (3) | `js/` | Não usado ativo | Arquivo ok | **Não** | Remover load |
| `isotope.pkgd.min.js` | `js/` | Não usado ativo | Arquivo ok | **Não** | — |
| `imagesloaded.pkgd.min.js` | `js/` | Isotope | Arquivo ok | **Não** | — |
| `jquery.counterup.min.js` | `js/` | Não usado ativo | Arquivo ok | **Não** | — |
| `jquery.waypoints.min.js` | `js/` | Counter | Arquivo ok | **Não** | — |
| `jquery.fancybox.js` | `js/` | Não usado ativo | Arquivo ok | **Não** | — |
| `jquery-ui.min.js` | `js/` | Pouco/nenhum | Arquivo ok | **Não** | — |
| `datecounter.js` | `js/` | mainView inativo | Arquivo ok | **Não** | — |

---

## Imagens — Akili (`public/assets/images/`)

| Asset / pasta | Utilização | Páginas | Manter | Substituir |
| --- | --- | --- | --- | --- |
| `logo-akili-positivo.png` | Header, mobile | Todas marketing | Sim | `next/image` |
| `logo-akilieduc-negativo.png` | Footer | Todas | Sim | `next/image` |
| `logo-akilieduc.png` | Variante | Sob demanda | Sim | — |
| `sobre/a-plataforma.png` | AboutPlatform | Home / sobre | Sim | — |
| `sobre/sobre-nos.png` | AboutUs | Home / sobre | Sim | — |
| `faq/faq.png` | FAQ | Home / faq | Sim | — |
| `etapas-do-metodo/*.png` (6) | Método | Home | Sim | Structured cards |
| `icones/*.png` | Progresso (dashboard) | Fora marketing MVP | Manter arquivo | Portal futuro |
| `dashboard/*` | Login/dashboard legado | Auth visual opcional | Manter | — |
| `loader.gif` | Preloader | Não migrar preloader | Arquivo ok | Não usar |

---

## Imagens — Tema (`public/assets/img/`)

| Subpasta / arquivo | Utilização marketing | Manter load | Notas |
| --- | --- | --- | --- |
| `bg/slide-01.jpg` | Hero background | Sim | Home |
| `bg/bg-con-1-1.png` | Login/contato legado | Sob demanda | |
| `breadcumb/title-img.png` | SectionTitle ornament | Sim | |
| `breadcumb/breadcumb-bg.jpg` | Breadcrumb bg | Páginas internas | |
| `blog/*` | Cards blog / placeholders | Sob demanda | |
| Demais (`about`, `class`, `team`, …) | Template inativo | Não carregar | Manter no disco até limpeza |

---

## Ícones

| Tipo | Localização | Uso | Estratégia |
| --- | --- | --- | --- |
| Font Awesome (CSS + webfonts) | `css/fontawesome.min.css` + `fonts/fa-*` | Header, footer, FAQ chrome | **Manter** no marketing |
| PNGs etapas/icones | `images/` | Conteúdo | `next/image` |
| Favicon set | `favicons/` | Browser chrome | Metadata API |

---

## Fontes

| Fonte | Localização | Uso | Estratégia |
| --- | --- | --- | --- |
| Fredoka | Google Fonts (legado) | Display | **`next/font/google`** self-host |
| Jost | Google Fonts | Body | **`next/font/google`** |
| FA webfonts | `public/assets/fonts/` | Ícones | Manter com CSS FA |

---

## Favicons

Local: `public/assets/favicons/` (android, apple, ms, favicon.ico, manifest.json, browserconfig.xml).

| Ação | Detalhe |
| --- | --- |
| Manter arquivos | Sim |
| Wire-up | `metadata.icons` + `manifest` no layout marketing/root |
| `app/favicon.ico` atual | Unificar com marca Akili (evitar conflito) |

---

## Plugins (arquivos estáticos)

Ver matriz completa em SPEC-006. Resumo de assets:

| Plugin | CSS | JS | Carregar no Next marketing? |
| --- | --- | --- | --- |
| Bootstrap | Sim | Não | CSS sim |
| Slick | Não | Não | Substituído |
| Magnific | Não | Não | Não |
| LayerSlider | Não | Não | Não |
| Isotope | — | Não | Não |
| EqualWeb | CDN externo | Decisão produto | SPEC-006 |

---

## Matriz resumo — política de carregamento marketing

| Categoria | Carregar | Não carregar |
| --- | --- | --- |
| CSS | bootstrap, fontawesome, style | slick, magnific, layerslider |
| JS | nenhum legado | todos `public/assets/js/**` |
| Fonts | FA + next/font | — |
| Images | usadas nas seções ativas | resto sob demanda / limpeza |

## Estratégia de implementação

1. `styles/marketing.css` importa apenas CSS aprovados.
2. Componentes referenciam `/assets/images/...` e `/assets/img/...` via constants `ASSETS`.
3. Inventário de imagens usadas por página em PR de cada fase.
4. Fase 6: script de auditoria de assets órfãos (opcional).

## Critérios de aceite

- [ ] Nenhuma página marketing importa JS jQuery/plugins
- [ ] CSS carregado ⊆ lista aprovada
- [ ] Logos e hero renderizam sem 404
- [ ] Favicons corretos na aba do browser
- [ ] Documentado quais pastas `img/` ainda não usadas

## Checklist técnico

- [ ] `constants/assets.ts` (paths) criado na implementação
- [ ] `next/image` remotePatterns se necessário (local `/assets` ok)
- [ ] Verificar `fontawesome` font-face paths após deploy
- [ ] Não duplicar assets em `/public` root sem necessidade
