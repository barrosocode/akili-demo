# SPEC-006 — Estratégia dos Plugins

| Campo | Valor |
| --- | --- |
| ID | SPEC-006 |
| Título | Estratégia de Plugins e JavaScript Legado |
| Status | Draft |
| Depende de | SPEC-001, SPEC-005 |

---

## Objetivo

Definir, para cada biblioteca/plugin do legado, se será mantido, removido, substituído ou reescrito em React — com justificativa técnica e impacto na implementação.

## Contexto

`scriptsView.php` carrega um bundle completo do tema Kiddino. A home Akili **ativa** usa apenas uma fração (menu mobile, backgrounds, accordion Bootstrap, carousel Slick no blog). Demais plugins são dead weight.

Regra da missão: **nunca jQuery**; reescrever comportamentos em React; manter JS legado só se extremamente complexo e insubstituível.

## Escopo

Todos os plugins listados na auditoria + scripts inline (ViaCEP, EqualWeb, validações dashboard).

## Fora do escopo

- Plugins exclusivos do dashboard aluno (exceto menção)
- Substituição de FontAwesome por outra icon library (fase redesign)

## Dependências

- SPEC-003 (componentes client)
- SPEC-007 (CSS remanescente)
- SPEC-009 (impacto bundle)

## Decisões arquiteturais

| ID | Decisão |
| --- | --- |
| P-001 | Zero jQuery no runtime Next marketing |
| P-002 | Zero `main.js` / `bootstrap.min.js` no layout marketing |
| P-003 | Comportamentos → hooks/componentes React |
| P-004 | Novas libs carousel só se CSS puro for insuficiente |
| P-005 | EqualWeb: gate de produto antes de integrar |

## Alternativas consideradas

| Alternativa | Motivo |
| --- | --- |
| Carregar jQuery só no client com `next/script` | Hidratação frágil, XSS surface, dívida |
| Manter Slick via npm | Ainda acopla jQuery tipicamente |
| Headless UI / Radix accordion | Bom a11y; classes visuais adaptáveis — opção válida |

## Riscos

| Risco | Mitigação |
| --- | --- |
| Paridade carousel | Aceite visual + breakpoints documentados |
| Accordion a11y | Roles ARIA + teclado |
| EqualWeb vs WCAG própria | Decisão explícita stakeholder |

---

## Matriz mestre

| Plugin | Situação no legado | Uso real Akili | Estratégia | Ação |
| --- | --- | --- | --- | --- |
| Bootstrap CSS | Ativo | Layout/grid/util | **Manter** CSS | Import marketing |
| Bootstrap JS | Ativo | FAQ collapse | **Reescrever** | `FaqAccordion` React |
| jQuery 3.6 | Ativo | Base | **Remover** runtime | Não carregar |
| main.js | Ativo | Menu, sticky, bg, slick init | **Reescrever** | Hooks React |
| Slick | Ativo (blog) | Carousel posts | **Substituir** | `BlogCarousel` |
| Magnific Popup | Carregado | Videos dashboard | **Remover** marketing | Dialog se necessário depois |
| LayerSlider | Carregado | Não usado views ativas | **Remover** | Não migrar |
| Isotope | Carregado | Não usado | **Remover** | — |
| imagesLoaded | Carregado | Dependência Isotope | **Remover** | — |
| CounterUp | Carregado | Não usado ativo | **Remover** | — |
| Waypoints | Carregado | Counter | **Remover** | — |
| Fancybox | Carregado | Não usado ativo | **Remover** | — |
| jQuery UI | Carregado | Irrelevante marketing | **Remover** | — |
| datecounter | Carregado | mainView inativo | **Remover** | — |
| FontAwesome | Ativo | Ícones | **Manter** | CSS + fonts |
| Google Fonts | Ativo | Fredoka/Jost | **Substituir** carga | `next/font` |
| EqualWeb | Ativo | Widget a11y | **Pendente** | Ver seção |
| ViaCEP | Inline | Checkout legado | **Reescrever** se usado | Fora marketing MVP |
| Validação login aluno | Inline scripts | Dashboard | **Não migrar** | Portal próprio |

---

## Detalhamento técnico por plugin

### Bootstrap

- **Manter:** `bootstrap.min.css` para paridade de grid (`container`, `row`, `col-*`) e classes do tema.
- **Remover JS:** accordion FAQ usa `data-bs-toggle` hoje → React state + classes `collapse show` se necessário para CSS, ou markup acessível próprio mantendo visual.
- **Não** instalar `react-bootstrap` no MVP (evita segunda abstração); classes utilitárias bastam.

### jQuery + main.js

Funções a reescrever:

| Função main.js | Componente/Hook |
| --- | --- |
| Preloader | Omitir |
| `vsmobilemenu` | `MobileMenu` + `useMobileMenu` |
| Sticky header | Opcional CSS `position: sticky` (sticky JS estava comentado) |
| ScrollToTop | `ScrollToTop` |
| `data-bg-src` | `style` via CSS module / inline style controlado no Server Component **ou** classe + `backgroundImage` prop (único inline style permitido para bg dinâmico; preferir CSS) |
| Hero/Global Slick | `BlogCarousel` |
| Magnific / Isotope / etc. | Não portar |

### Slick

- Breakpoints legado blog: 3 / 3 / 2 / 2 / 1 slides.
- Opções de substituição (ordem de preferência):
  1. CSS scroll-snap + botões (zero dep)
  2. Embla Carousel (leve, sem jQuery)
  3. Swiper (mais pesado)
- **Decisão MVP:** (1) se suficiente visualmente; senão Embla.

### Magnific Popup

- Só videos tutorial dashboard → fora do escopo marketing.
- Se home ganhar vídeo: `<dialog>` ou modal React + iframe YouTube.

### LayerSlider / Isotope / CounterUp / Fancybox / jQuery UI / datecounter

- **Remover** do carregamento.
- Arquivos podem permanecer em `public/assets/js` até limpeza (SPEC-005).

### FontAwesome

- Manter CSS no marketing.
- Garantir que classes `fa`, `fas`, `fab`, `fal`, `far` continuem funcionando com webfonts locais.

### Google Fonts → next/font

- Eliminar `<link>` Google no runtime.
- Aplicar variáveis CSS no layout marketing para casar com `style.css` (`font-family` overrides se necessário).

### EqualWeb

```text
Situação: script CDN + sitekey no legado
Estratégia: PENDENTE produto/jurídico
```

| Opção | Prós | Contras |
| --- | --- | --- |
| Integrar via `next/script` afterInteractive | Paridade compliance | Terceiro, privacy, perf |
| Não integrar; WCAG própria | Controle, perf | Pode faltar requisito contratual |
| Integrar só produção | Menos ruído em dev | Config env |

**Gate:** sem aprovação, **não** incluir na Fase 1–5.

### ViaCEP / scripts dashboard

Fora do marketing. Portal checkout já tem fluxo próprio — não portar scripts PHP.

---

## Tabela resumida (formato pedido)

| Plugin | Situação | Estratégia |
| --- | --- | --- |
| Bootstrap | CSS necessário / JS substituível | Manter CSS · Reescrever JS |
| jQuery | Base legado | Remover · Reescrever em React |
| Slick | Blog carousel | Substituir (CSS/Embla) |
| Magnific | Dashboard video | Remover do marketing |
| LayerSlider | Dead | Remover |
| Counter | Dead | Remover |
| Isotope | Dead | Remover |
| EqualWeb | Compliance | Pendente produto |
| FontAwesome | Ícones | Manter |
| Google Fonts | Tipografia | Substituir por next/font |
| main.js | Orquestrador | Reescrever |
| Fancybox / jQuery UI / datecounter | Dead | Remover |

## Estratégia de implementação

1. Fase 1: nenhum script legado no layout.
2. Fase 2: MobileMenu + ScrollToTop.
3. Fase 4: FaqAccordion + BlogCarousel.
4. Fase 6: decisão EqualWeb + limpeza arquivos.

## Critérios de aceite

- [ ] Network tab marketing: sem jquery/slick/layerslider/bootstrap.js
- [ ] Menu mobile e FAQ funcionam só com React
- [ ] Carousel blog responsivo nos breakpoints alvo
- [ ] EqualWeb documentado como sim/não antes do go-live

## Checklist técnico

- [ ] Nenhum `next/script` apontando para `/assets/js/**` no marketing
- [ ] ESLint/code review bloqueia import jQuery
- [ ] SPEC-003 componentes client cobrem comportamentos
- [ ] Gate EqualWeb registrado como pendência aberta/fechada
