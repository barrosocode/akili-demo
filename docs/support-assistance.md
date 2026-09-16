# Support Assistance — Portal

Visualização read-only do Portal do Responsável durante atendimento (ADR-023).

Contrato API: repositório `api` → `docs/api/28-support-admin-users.md` e ADR-023.

## Rotas

| Rota | Auth | Função |
|------|------|--------|
| `/suporte/entrar` | público | Login da mesa (`client-support`) |
| `/suporte` | cookie mesa | Busca de responsáveis |
| `/suporte/usuarios/[uuid]` | cookie mesa | Detalhe + iniciar assistência |
| `/assistance/adopt` | público | Consome `?code=` (handoff Admin/mesa) |
| `/assistance/entrar` | cookie assistência (ou retry `/me`) | Bridge pós-start/adopt → dashboard |

`/assistance/*` usa o mesmo `MarketingShell` de `/signin` e `/suporte` (header + footer).

## Cookies

| Cookie | PAT | Escopo |
|--------|-----|--------|
| `akili_support_session` (+ refresh) | `client-support` | Mesa (busca / start) |
| `akili_assistance_session` | `client-assistance` | Visualização read-only |

Durante assistência a mesa **não** é apagada: após `end`, se a mesa existir, o retorno é `/suporte`.

## Fluxo mesa → portal

```text
/suporte/entrar
  → POST /api/support/auth/login (BFF)
  → /suporte (busca)
  → detalhe → BFF start + adopt
  → /assistance/entrar (poll /me)
  → / (dashboard read-only + banner)
  → Encerrar → /suporte
```

## Bridge `/assistance/entrar`

Após start/adopt o BFF redireciona para `ASSISTANCE_ENTER_PATH` (`/assistance/entrar`), não direto para `/`.

`AssistanceEnterClient` tenta `/me` algumas vezes até `assistance.active`, então `router.replace` no dashboard. Evita flash da landing marketing quando o cookie ainda não reflete a sessão.

Home (`app/page.tsx`): `shouldShowMarketingHome` — marketing só sem sessão **e** sem cookie de assistência.

## Banner sticky

`AssistanceBanner` (montado em `GuardianDashboardShell` / `AlunoDashboardShell`):

- CSS: `.assistance-banner` → `position: sticky; top: 0; z-index: 50`
- No mount: `html[data-assistance-banner="true"]` + `--assistance-banner-height` via `ResizeObserver`
- Header sticky do tema: `top: var(--assistance-banner-height)` enquanto o atributo existir
- Cleanup no unmount (encerra atendimento)

Constantes de contrato: `ASSISTANCE_BANNER_HTML_ATTR`, `ASSISTANCE_BANNER_HEIGHT_VAR` em `features/assistance/assistance-chrome.ts`.

## Testes

```bash
npm run test:assistance
```

## Variáveis

Ver [development.md](./development.md) (`AUTH_SUPPORT_*`, `AUTH_ASSISTANCE_*`, `COOKIE_SECURE`).
