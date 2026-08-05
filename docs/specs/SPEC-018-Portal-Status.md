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

## Smoke test — demo Prioridade 1

### Persona escola

| Passo | Esperado |
| --- | --- |
| Login `responsavel@escola-exemplo.dev` / `password` | Dashboard com 3 filhos (João, Ana, Pedro) |
| Card do filho | Progresso %, streak, resumo; badge “Demonstração” |
| Plano na home | Plano Escola ativo |
| `/children/[ref]` → Visão geral | Escola, turma, professor, KPIs, evolução semanal, materiais, próximos conteúdos, notificações |
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
| `/purchases`, `/relatorios` | Purchases stub; relatórios apontam para filhos |
| `/aluno` | Shell aluno + placeholders API |

## Follow-ups

- [x] Auth + sessão agregada `/client/auth/me`
- [x] Progresso BFF completo (kpis, materials, reports, classrooms, gamification, notifications)
- [x] Dashboard sem mocks locais de relatório
- [x] Planos provisórios (`subscription` na sessão)
- [ ] BFF forgot-password / reset real
- [ ] Form adicionar filho real (API ainda 501)
- [ ] Checkout B2C completo
- [ ] API aluno (disciplinas, conteúdo, quiz)
- [ ] Domínio Learning/Gamification real (substituir metadata demo)
