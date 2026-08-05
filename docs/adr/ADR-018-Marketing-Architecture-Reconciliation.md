# ADR-018 — Reconciliação da Arquitetura do Site (Marketing + Portal Kiddino)

| Campo | Valor |
| --- | --- |
| ID | ADR-018 |
| Título | Reconciliação da Arquitetura do Site Akili |
| Status | Aceito |
| Data | 2026-08-05 |
| Repo | `site` |
| Relaciona | SPEC-001…018; supersede decisões D-001/D-002 e CSS-001…003 (isolamento dual-DS) |

---

## Contexto

As SPECs **001–007** aprovaram um modelo de **dois design systems** no mesmo deploy Next.js:

- Marketing institucional: tema Kiddino (Bootstrap CSS + `style.css`), isolado no route group `(marketing)`.
- Portal do responsável: shadcn/ui + Tailwind v4, intacto em `(auth)` / `(dashboard)`.

Durante a implementação, o produto e a engenharia decidiram unificar a experiência visual do `site` no tema Kiddino (auth + dashboards responsável/aluno), formalizado depois nas SPECs **013–018**.

A auditoria arquitetural (2026-08-05) concluiu que:

1. O **código** está coerente com o modelo mono-DS (SPEC-013).
2. A **documentação 001–007** ainda descreve dual-DS e isolamento CSS por route group.
3. Seguir SPECs antigas sem reconciliação geraria PRs conflitantes e dívida documental.

Este ADR **não altera código**. Ele fecha o contrato documental.

---

## Etapa 1 — Inventário das divergências

| Documento / Decisão | Decisão original | Arquitetura atual | Status |
| --- | --- | --- | --- |
| SPEC-001 D-001 | CSS Bootstrap só no `(marketing)` | CSS Kiddino em marketing, auth, dashboard, aluno e `/` | **Substituída** |
| SPEC-001 D-002 | Portal shadcn intacto | Portal visual Kiddino (SPEC-013) | **Substituída** (revogada) |
| SPEC-001 D-003 | Sem jQuery / plugins mortos | Mantido (React islands) | **Mantida** |
| SPEC-001 D-004 | Bootstrap CSS only (sem JS Bootstrap) | Mantido | **Mantida** |
| SPEC-001 D-005 | Conteúdo MVP em `constants/` | Mantido | **Mantida** |
| SPEC-001 D-006 | Auth legado → rotas Next | Mantido (`/signin`, redirects) | **Mantida** |
| SPEC-001 D-007 | `layout_old/` como referência | Mantido | **Mantida** |
| SPEC-001 D-008 / D-008a | Home `/` bifura sessão; marketing se deslogado | Mantido | **Mantida** |
| SPEC-001 escopo “aluno fora” | Dashboard aluno fora do `site` | `app/(aluno)` existe (UI placeholder) | **Substituída** |
| SPEC-002 A-001 | Route group `(marketing)` | Mantido | **Mantida** |
| SPEC-002 A-002 | Layout marketing carrega CSS; root Tailwind/portal | Root sem Tailwind; CSS Kiddino compartilhado | **Substituída** |
| SPEC-002 A-003…A-008 | Pastas marketing, constants, thin pages, next/* | Mantidos no marketing | **Mantida** |
| SPEC-002 A-009 | Home só em `app/page.tsx`; sem `(marketing)/page.tsx` | Mantido | **Mantida** |
| SPEC-003 MainNav Server | Desktop Server; Client só mobile | `MainNav` Client inteiro | **Obsoleta** (meta; implementação diverge — dívida menor) |
| SPEC-007 CSS-001 | Tema não entra em `globals.css` | Mantido (globals mínimo) | **Mantida** |
| SPEC-007 CSS-002 | Entry `@import` dos assets CSS | Tema via `<link>` (`KiddinoThemeStyles`) | **Substituída** |
| SPEC-007 CSS-003 | Import só em `(marketing)` (+ home) | Import/`link` em todos os shells Kiddino | **Substituída** |
| SPEC-007 CSS-004 | `layout4` no marketing | `layout4` via `KiddinoRoot` em todas superfícies | **Consolidada** |
| SPEC-007 CSS-005…007 | Sem CSS Modules tema; classes legado; overrides | Mantidos | **Mantida** |
| SPEC-007 CSS-008 | Portal Preflight Tailwind + marketing Bootstrap | Tailwind removido do uso ativo do portal | **Substituída** |
| SPEC-013 / 014 | Mono-DS Kiddino; shells Auth/Guardian/Aluno | Implementado | **Consolidada** (contrato vigente) |
| SPEC-011 | Backlog marketing sob dual-DS | MVP marketing feito; 061 aberto | **Consolidada** (escopo marketing; ver continuidade) |
| SPEC-017 | Backlog portal Kiddino | MVP portal feito; follow-ups API | **Consolidada** |

---

## Decisão

Adota-se oficialmente o **modelo mono design system Kiddino** no repositório `site`:

1. **Design System oficial:** tema legado Kiddino (Bootstrap CSS + Font Awesome + `style.css` + overrides), carregado via `KiddinoThemeStyles` / `KiddinoRoot`.
2. **Route Groups** permanecem como **fronteiras de composição e rota**, não como fronteiras de isolamento de CSS dual-DS.
3. **shadcn/Tailwind** não são o DS ativo do portal; residual em `components/ui` é dívida de limpeza, não contrato.
4. **SPECs 001 (trechos dual-DS), 002 A-002, 007 CSS-002/003/008** passam a **Historical / Superseded** por este ADR e pela SPEC-019 (contrato vigente).
5. **SPEC-013 e SPEC-014** são ratificadas como visão/arquitetura do portal unificado, subordinadas a este ADR.

### Decisões explicitamente substituídas

| ID original | Substituída por |
| --- | --- |
| SPEC-001 D-001 | ADR-018 § Decisão (1–2) + SPEC-019 |
| SPEC-001 D-002 | ADR-018 + SPEC-013 |
| SPEC-001 “aluno fora do site” | ADR-018 + SPEC-013/016 (área `/aluno` no `site`, com guard a evoluir) |
| SPEC-002 A-002 | ADR-018 + SPEC-019 (estratégia CSS) |
| SPEC-007 CSS-002 | ADR-018 (tema via `<link>`, não `@import` bundlado) |
| SPEC-007 CSS-003 | ADR-018 (CSS Kiddino nos shells que usam o tema) |
| SPEC-007 CSS-008 | ADR-018 (sem Preflight Tailwind ativo no portal) |

### Decisões mantidas (não substituídas)

D-003, D-004, D-005, D-006, D-007, D-008a, A-001, A-003…A-009 (exceto A-002), CSS-001, CSS-004 (consolidada), CSS-005…007, princípios sem jQuery, BFF `/api/*`, Server Components por padrão.

---

## Alternativas consideradas

| Alternativa | Motivo da rejeição |
| --- | --- |
| Restaurar dual-DS (voltar portal para shadcn) | Contraria produto já implementado (SPEC-013); alto custo de retrabalho |
| Manter 001–007 “como estão” e ignorar 013 | Documentação contraditória; risco de PRs conflitantes |
| Apagar SPECs 001–007 | Perde histórico de decisão; rejeitado — marcar Historical |
| Isolar CSS por microfrontends | Fora do escopo; overhead operacional |

---

## Consequências

### Positivas

- Uma fonte de verdade visual no `site`.
- SPECs deixam de contradizer o código e umas às outras.
- Backlogs MARKETING-* e PORTAL-* podem seguir sem reverter isolamento dual-DS.

### Negativas / trade-offs

- CSS do tema pode carregar em mais superfícies (peso e regressões cruzadas).
- Nome `marketing.css` / classe `marketing-root` fica semanticamente amplo (renomeação futura recomendada, não bloqueante).
- Área aluno no `site` exige evolução de autorização (não usar indefinidamente `GuardianGuard` como proxy).

### Não-consequências

- Admin TailAdmin permanece fora deste ADR.
- Laravel/API e BFF não mudam por este documento.

---

## Impacto nas SPECs

| SPEC | Ação documental |
| --- | --- |
| 001, 002 (A-002), 007 | Banner **Historical / Superseded by ADR-018** nos trechos dual-DS |
| 003–006, 008–010 | Permanecem vigentes; nota de contexto mono-DS onde CSS/portal for citado |
| 011 | Continuidade: 061 válido; não restaurar isolamento shadcn |
| 012 | Nota: status marketing sob contrato ADR-018 |
| 013–018 | Ratificadas; apontam para ADR-018 |
| **019** | Novo contrato arquitetural vigente (resumo operacional) |

---

## Critérios de aceite deste ADR

- [x] Inventário de divergências publicado
- [x] Decisões substituídas listadas explicitamente
- [x] SPECs atualizadas com status Historical/Superseded onde cabível
- [x] Contrato vigente (SPEC-019) sem contradições internas
- [x] Plano de continuidade do SPEC-011 documentado (sem implementar código)

---

## Referências

- Auditoria de arquitetura (canvas `architecture-audit`, 2026-08-05)
- [SPEC-013-Portal-Kiddino.md](../specs/SPEC-013-Portal-Kiddino.md)
- [SPEC-019-Architectural-Contract.md](../specs/SPEC-019-Architectural-Contract.md)
