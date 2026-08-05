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
| `/signin` | Login form-style3 + **MarketingShell**; CTA LOGIN oculto no header; acessível com cookie residual |
| Pós-login | Full navigation para `/` (dashboard) ou `?next=` seguro; se termos pendentes → `/terms` |
| `/first-access` | OTP first-access (request + verify + senha) |
| `/terms` | Aceite com geo obrigatória (prompt no clique “Permitir localização”) |
| `/forgot-password` | Pedido de e-mail (feedback honesto) |
| `/` logado | Shell responsável + filhos + switcher de filho ativo |
| `/children/[ref]` | Relatórios mockados do filho (accordion Kiddino + seletor de mês) |
| `/profile` | Cadastro rico (nome, telefone, CPF via `GET/PATCH /guardian/me`); e-mail só leitura |
| `/purchases`, `/relatorios` | Páginas Kiddino (stubs honestos) |
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
- [x] `(auth)` via `MarketingShell`; LOGIN oculto nas páginas auth
- [x] Pós-login → dashboard `/` com full navigation; `/api/auth/me` não limpa cookie em 5xx
- [x] Sessão agregada `/client/auth/me` + gate de termos + OTP first-access (2026-08-05)
- [x] Aceite LGPD com evidências forenses (geo obrigatória no portal)
- [x] Relatórios mockados em `/children/[ref]` (2026-08-05)
- [x] Perfil rico do responsável via `/guardian/me` (nome, telefone, CPF) (2026-08-05)
- [ ] BFF forgot-password / reset real
- [ ] Form adicionar filho + progresso real (substituir mock de relatórios)
- [ ] Checkout B2C completo
- [ ] API aluno (disciplinas, conteúdo, quiz)
- [ ] Remover pasta `components/ui` órfã quando seguro
- [ ] Guard de sessão por tipo aluno vs responsável
