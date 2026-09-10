# Relatório: seletor de personas do ambiente demo (Site)

**Data:** 2026-09-09  
**Projeto:** `akili-site`  
**Referência:** [`../reference-documentation/01-seletor-personas-demo.md`](../reference-documentation/01-seletor-personas-demo.md) e [`../reference-documentation/16-demo-ambiente.md`](../reference-documentation/16-demo-ambiente.md)

---

## 1. Resumo

O portal do responsável passou a reconhecer a sessão comercial de demonstração e a exibir, na faixa superior do header autenticado, um seletor das três personas (professora, responsável, coordenação). A troca emite um novo token Sanctum pela API via BFF.

- Camila permanece neste app (cookie HttpOnly).
- Helena e Ricardo saem para o admin com `#demo_token=`.
- O site consome o mesmo hash quando o admin envia Camila de volta.

Não foi adicionado `NEXT_PUBLIC_DEMO_ENABLED`. A fonte da verdade é o backend (`users.is_demo` / rotas `/api/v1/demo/*`).

O browser **nunca** grava o token: cookies HttpOnly são definidos só no Route Handler.

---

## 2. Como o front identifica que o usuário é demo

1. **Primária:** `GET /api/auth/me` com `isDemo: true`. `demoPersonaKey` marca a opção atual.
2. **Fallback:** se `/me` omitir `is_demo`, o front chama `GET /api/demo/personas`.
   - `200` com itens → mostra o seletor
   - `403` ou `404` → esconde
3. Se `isDemo === false`, **não** chama `/demo/personas`.

Não infere demo por e-mail, slug ou senha.

---

## 3. Variável de ambiente

| Variável | Obrigatória? | Uso |
|----------|--------------|-----|
| `NEXT_PUBLIC_ADMIN_APP_URL` | Sim, para professora/coordenação | Destino do handoff. Ex.: `http://localhost:3001` |

Fallback server-side: `ADMIN_APP_URL`. Sem as duas, a troca para persona institucional **não** emite token e mostra *"O endereço do painel da escola não está configurado."*

Handoff:

```text
{NEXT_PUBLIC_ADMIN_APP_URL}/#demo_token={token}
```

Reiniciar o `npm run dev` depois de definir a variável.

**Dependência:** o admin precisa consumir `#demo_token=` ao receber Helena/Ricardo.

---

## 4. Artefatos

### Novos

| Arquivo | Função |
|---------|--------|
| `types/demo.ts` | `DemoPersonaKey`, `DemoPersona`, respostas de token/troca |
| `lib/demo/personas.ts` | Labels PT, destino admin vs site, normalização do payload |
| `lib/demo/token-hash.ts` | Lê e limpa `#demo_token=` |
| `features/demo/schemas/demo.schema.ts` | Zod do adopt e da chave |
| `features/demo/components/DemoPersonaSwitcher.tsx` | Seletor no header |
| `features/demo/components/DemoTokenBootstrap.tsx` | Boot do hash |
| `services/bff/demo.bff.ts` | Client BFF |
| `services/queries/demo.queries.ts` | Lista só quando a sessão deve ser sondada |
| `services/queries/demo.mutations.ts` | Troca de persona |
| `app/api/demo/personas/route.ts` | Proxy `GET /demo/personas` |
| `app/api/demo/personas/[key]/token/route.ts` | Troca + destino |
| `app/api/demo/adopt/route.ts` | Adota token do hash (cookie HttpOnly) |

### Alterados

| Arquivo | Mudança |
|---------|---------|
| `.env.example` | `NEXT_PUBLIC_ADMIN_APP_URL` + contrato do hash |
| `lib/auth/config.ts` | `resolveAdminHandoffUrl()` |
| `lib/auth/portal-destination.ts` | tipo `coordinator` |
| `types/auth.ts`, `types/portal-session.ts`, `types/session.ts` | `is_demo` / `isDemo` |
| `lib/permissions/guardian-capabilities.ts` | mapeamento dos campos demo |
| `components/portal/guardian/GuardianHeader.tsx` | seletor em `header-top4` |
| `providers/app-providers.tsx` | `DemoTokenBootstrap` |
| `styles/marketing-overrides.css` | seletor visível no mobile |

### Fora de escopo

- `POST /api/v1/demo/reset`
- Seletor no `/signin` ou no portal do aluno
- Flag `NEXT_PUBLIC_DEMO_ENABLED`

---

## 5. Contrato BFF

| Método | Path no browser | Laravel |
|--------|-----------------|---------|
| GET | `/api/demo/personas` | `GET /demo/personas` |
| POST | `/api/demo/personas/{key}/token` | `POST /demo/personas/{key}/token` |
| POST | `/api/demo/adopt` | cookie + `GET /client/auth/me` |

`key`: `teacher` \| `guardian` \| `coordinator`.

---

## 6. Fluxo de troca

```
Seletor → POST /api/demo/personas/{key}/token
       → destino
```

| Persona | Label na UI | Destino |
|---------|-------------|---------|
| `guardian` | Camila · Responsável | permanece no site |
| `teacher` | Helena · Professora | admin `#demo_token=` |
| `coordinator` | Ricardo · Coordenação | admin `#demo_token=` |

---

## 7. Checklist de aceite manual

- [ ] Login com `responsavel@demo.akili.dev` (ou hash vindo do admin) → seletor visível no header
- [ ] Seletor permanece ao navegar (filhos, perfil, compras) e no mobile
- [ ] Trocar para professora/coordenação com `NEXT_PUBLIC_ADMIN_APP_URL` → sai para o admin com `#demo_token=`
- [ ] Trocar de volta para responsável a partir do admin → site lê o hash, grava cookie, limpa a URL
- [ ] Usuário não-demo (`isDemo: false` ou 403 em `/demo/personas`) → seletor ausente
- [ ] Sem URL do admin → mensagem clara; sessão de Camila intacta
- [ ] Token nunca aparece na UI, em query string, `localStorage` ou `sessionStorage`

---

## 8. Dependências externas

1. Backend com `AKILI_DEMO_ENABLED=true`, tenant demo e rotas `/api/v1/demo/*`.
2. `GET /client/auth/me` preferencialmente incluindo `is_demo` e `demo_persona_key`.
3. Admin consumindo `#demo_token=` no handoff inverso.
