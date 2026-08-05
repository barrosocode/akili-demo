# SPEC-018 — Status Portal Kiddino

> Ratificado sob [ADR-018](../adr/ADR-018-Marketing-Architecture-Reconciliation.md). Contrato: [SPEC-019](./SPEC-019-Architectural-Contract.md).

| Campo | Valor |
| --- | --- |
| ID | SPEC-018 |
| Título | Status de Implementação — Auth + Dashboards Kiddino |
| Status | Entregue (MVP) |
| Data | 2026-08-05 |
| Depende de | SPEC-013…017 |

## Resumo

Portal auth e dashboards migrados para visual Kiddino (mesmo pipeline CSS do marketing). Tailwind/shadcn removidos das rotas ativas do portal.

## Smoke test

| URL | Esperado |
| --- | --- |
| `/signin` | Login form-style3 + **MarketingShell** (header/footer); acessível mesmo com cookie residual |
| Pós-login | Full navigation para `/` (dashboard responsável) ou `?next=` seguro |
| `/forgot-password` | Pedido de e-mail (feedback honesto) |
| `/` logado | Shell responsável + filhos |
| `/profile`, `/purchases`, `/relatorios` | Páginas Kiddino |
| `/aluno` | Shell aluno + placeholders API |

## Backlog PORTAL-*

| ID | Status |
| --- | --- |
| 001–006 | Feito |
| 007–011 | Feito (stubs honestos onde API ausente) |
| 012–013 | Feito (placeholders aluno) |
| 014 | Feito (globals sem Tailwind; ui legado no disco não usado nas rotas) |
| 015 | Este documento |

## Follow-ups

- [x] Auth sempre acessível no middleware + limpeza de cookie em `/api/auth/me` (2026-08-05)
- [x] `(auth)` via `MarketingShell`; LOGIN no header e menu mobile
- [x] Pós-login → dashboard `/` com full navigation; `/api/auth/me` não limpa cookie em 5xx
- [ ] BFF forgot-password / reset real
- [ ] Form adicionar filho + detalhe progresso
- [ ] Checkout B2C completo
- [ ] API aluno (disciplinas, conteúdo, quiz)
- [ ] Remover pasta `components/ui` órfã quando seguro
- [ ] Guard de sessão por tipo aluno vs responsável
