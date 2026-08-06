# SPEC-018 — Status Portal Kiddino

> Ratificado sob [ADR-018](../adr/ADR-018-Marketing-Architecture-Reconciliation.md). Contrato: [SPEC-019](./SPEC-019-Architectural-Contract.md).

| Campo | Valor |
| --- | --- |
| ID | SPEC-018 |
| Título | Status de Implementação — Auth + Dashboards Kiddino |
| Status | Entregue (MVP demo) |
| Data | 2026-08-05 |
| Depende de | SPEC-013…017 |

## Resumo

Portal auth e dashboards migrados para visual Kiddino. Dashboard do responsável consome progresso demo da API (KPIs, materiais, relatórios, gamificação, notificações) via BFF.

## Layout do dashboard (UX Kiddino)

O tema legado redefine `.badge` com `position: absolute` (selo sobre imagem). No portal **não** usar `className="badge"`.

| Classe | Uso |
| --- | --- |
| `portal-chip` + `portal-chip--muted` / `--theme` | Status (“Demonstração”, desempenho) |
| `vs-btn` / `vs-btn style3` | CTA primário / outline (sempre legível, sem depender de hover) |
| `portal-page-header` | Título da página + chip |
| `portal-child-card` | Card da lista de filhos (tipografia/padding compactos) |
| `portal-child-tabs` | Abas Visão geral / Relatórios / Conquistas |
| `portal-block-heading` | Título de bloco + chip (ex.: relatório) |

Overrides em `styles/marketing-overrides.css` (escopo `.marketing-root`). Lista canônica: `/children` (sidebar “Meus filhos”); `/` logado continua mostrando a mesma lista.

## Smoke test — demo Prioridade 1

### Persona escola

| Passo | Esperado |
| --- | --- |
| Login `responsavel@escola-exemplo.dev` / `password` | Dashboard com 3 filhos (João, Ana, Pedro) |
| `/children` ou `/` logado | Lista de filhos; sidebar “Meus filhos” ativo |
| Card do filho | Progresso %, streak, resumo; chip “Demonstração” **ao lado do fluxo** (não sobre o nome); CTAs “Ver detalhes” / “Selecionar” legíveis sem hover |
| Plano na home | Plano Escola ativo |
| `/children/[ref]` → Visão geral | Escola, turma, professor, KPIs, evolução semanal, materiais, próximos conteúdos, notificações |
| Abas | Visão geral / Relatórios / Conquistas legíveis sem hover (ativa sólida, inativa `style3`) |
| Aba Relatórios | Relatório pedagógico do seeder (sem mock local) |
| Aba Conquistas | XP, nível, medalhas, missões, streak, recompensas |

### Persona B2C

| Passo | Esperado |
| --- | --- |
| Login `responsavel@familia.dev` / `password` | Dashboard com Luiza e Miguel |
| Plano na home | Premium · limite de filhos · CTA upgrade se aplicável |
| `canAddChildren` | true · `/children/new` acessível (CTA honesto se API 501) |
| Detalhe do filho | Progresso + gamificação familiar (sem turma escolar obrigatória) |

### Admin — upgrade de plano

```bash
PATCH /api/v1/admin/tenants/{uuid}/subscription
{ "plan_key": "premium" }
```

## Smoke test — auth (base)

| URL | Esperado |
| --- | --- |
| `/signin` | Login form-style3 + **MarketingShell** |
| Pós-login | Full navigation para `/` (dashboard) ou `?next=` seguro; se termos pendentes → `/terms` |
| `/first-access` | OTP first-access |
| `/terms` | Aceite com geo obrigatória |
| `/profile` | Cadastro rico via `GET/PATCH /guardian/me` |
| `/children` | Lista de filhos (mesma UX da home logada) |
| `/purchases`, `/relatorios` | Purchases stub; relatórios apontam para filhos |
| `/aluno/entrar` | Login aluno (cookies `akili_student_*`) |
| `/aluno` | Dashboard aluno com materiais e progresso |
| `/aluno/supervisao/[ref]` | Guardian — ambiente read-only do filho |

## Site institucional (Prioridade 3)

Páginas marketing em `(marketing)` — status em [SPEC-012](./SPEC-012-Implementation-Status.md). Para demo: `/`, `/sobre-nos`, `/series`, `/faq`, `/blog` (+ posts), `/preco-e-planos` (Starter/Essencial/Premium/Escola), `/contato`.

## Ambiente de demo (Prioridade 4)

Roteiro completo (Docker + seeds + personas): `api/docs/akili-platform/16-demo-ambiente.md`.

## Follow-ups

- [x] Auth + sessão agregada `/client/auth/me`
- [x] Progresso BFF completo (kpis, materials, reports, classrooms, gamification, notifications)
- [x] Dashboard sem mocks locais de relatório
- [x] Planos provisórios (`subscription` na sessão)
- [x] Blog com posts clicáveis + planos alinhados ao catálogo
- [x] UX dashboard: CTAs/abas legíveis + chips `portal-chip` (evitar `.badge` Kiddino)
- [x] Rota explícita `/children` + sidebar alinhada
- [x] Portal web do aluno MVP ([SPEC-021](./SPEC-021-Student-Web-Portal.md))
- [ ] BFF forgot-password / reset real
- [ ] Form adicionar filho real (API ainda 501)
- [ ] Checkout B2C completo (billing)
- [ ] Domínio Learning/Gamification formal (ranking, sync offline, sessions avançadas)
