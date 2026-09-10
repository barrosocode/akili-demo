# Relatório: seletor de personas do ambiente demo (Admin)

**Data:** 2026-09-09  
**Projeto:** `akili-admin`  
**Referência:** [`../reference-documentation/16-demo-ambiente.md`](../reference-documentation/16-demo-ambiente.md)

---

## 1. Resumo

O admin passou a reconhecer a sessão comercial de demonstração e a exibir, na barra superior de **todas as telas autenticadas**, um seletor permanente das três personas (professora, responsável, coordenação). A troca emite um novo token Sanctum pela API; professora e coordenação permanecem neste app; o responsável redireciona ao site.

Não foi adicionado `NEXT_PUBLIC_DEMO_ENABLED`. A fonte da verdade é o backend (`users.is_demo` / rotas `/api/v1/demo/*`).

---

## 2. Objetivo da tela

Permitir que o time comercial, após um único login, troque de ponto de vista sem senha — a mesma turma e os mesmos alunos (Theo e Lívia) vistos pela professora, pela família e pela coordenação.

---

## 3. Como o front identifica que o usuário é demo

Ordem de decisão:

1. **Primária:** `GET /admin/auth/me` com `is_demo: true`. O campo opcional `demo_persona_key` marca a opção atual no seletor.
2. **Fallback:** se `/me` omitir `is_demo`, o front chama `GET /demo/personas` com `skipForbiddenNotify: true`.
   - `200` com itens → mostra o seletor
   - `403` ou `404` → esconde (usuário comum ou demo desligada no backend)
3. Se `is_demo === false`, **não** chama `/demo/personas`.

O front **não** infere demo por e-mail, slug `demo-colegio-aurora` ou senha.

O tipo `User` ganhou campos opcionais alinhados ao banco (`users.is_demo`, `users.demo_persona_key`). O ideal na API é devolver esses campos no resource de `/admin/auth/me`; o fallback cobre enquanto isso não ocorrer.

---

## 4. Variável de ambiente

**Não** usar flag de “demo ligada”.

| Variável | Obrigatória? | Uso |
|----------|--------------|-----|
| `NEXT_PUBLIC_SITE_URL` | Sim, para a persona responsável | Destino do handoff. Ex.: `http://localhost:3000` |

Documentada em [`.env.example`](../../../../.env.example). O admin redireciona para:

```text
{NEXT_PUBLIC_SITE_URL}/#demo_token={token}
```

O hash evita o token em access log do servidor. **O site precisa** ler `#demo_token=`, gravar a sessão e limpar a URL. Sem isso, Camila abre o portal deslogada. Reiniciar o `npm run dev` depois de definir a variável.

---

## 5. Artefatos

### Novos

| Arquivo | Função |
|---------|--------|
| `src/types/demo.ts` | `DemoPersonaKey`, `DemoPersona`, `DemoPersonaTokenResponse`, `DemoSwitchDestination` |
| `src/services/demo.service.ts` | `listPersonas()`, `issuePersonaToken(key)` |
| `src/lib/demo/personas.ts` | Detecção, labels PT, destino admin vs site, normalização do payload |
| `src/lib/demo/personas.test.ts` | 14 testes dos helpers |
| `src/services/demo.service.test.ts` | Paths `/demo/personas` e `/demo/personas/{key}/token` |
| `src/hooks/useDemoPersonas.ts` | Carrega a lista só quando a sessão deve ser sondada |
| `src/components/demo/DemoPersonaSwitcher.tsx` | Seletor compacto no header |

### Alterados

| Arquivo | Mudança |
|---------|---------|
| `src/types/auth.ts` | `is_demo?`, `demo_persona_key?` |
| `src/lib/api/config.ts` | `demoPath()` — prefixo `/demo`, **sem** `/admin` |
| `src/context/AuthContext.tsx` | `adoptSession(token)`: persiste token, `fetchMe()`, sincroniza escola ativa |
| `src/layout/AppHeader.tsx` | Seletor na primeira linha (visível no mobile e no desktop) |
| `.env.example` | `NEXT_PUBLIC_SITE_URL` + contrato do hash |

### Fora de escopo (não implementado)

- `POST /api/v1/demo/reset` (reset rápido entre apresentações)
- Seletor no `/signin` (as rotas demo exigem `auth:sanctum`)
- Consumo do `#demo_token=` no repositório do site
- Flag `NEXT_PUBLIC_DEMO_ENABLED`

---

## 6. Contrato da API consumido

Base: `NEXT_PUBLIC_API_URL` (já `/api/v1`).

| Método | Path no client | Quando |
|--------|----------------|--------|
| `GET` | `/demo/personas` | Boot autenticado, se `is_demo !== false` |
| `POST` | `/demo/personas/{key}/token` | Troca de persona |

`key`: `teacher` \| `guardian` \| `coordinator`.

Resposta do token (envelope `data`):

```json
{
  "token": "42|...",
  "token_type": "Bearer",
  "expires_at": "2026-09-10T02:35:54+00:00",
  "user": { "...": "..." }
}
```

O token **substitui** o atual no cliente (`sessionStorage` / `adoptSession`).

A lista de personas não tem shape fechado no doc de referência. O service aceita:

- array em `data`
- `{ personas: [...] }`
- `{ data: [...] }` (aninhado)

Itens sem `key` conhecida ou sem `name` são descartados. E-mail, se vier, serve só para marcar a opção atual — a UI mostra labels humanas.

---

## 7. Fluxo de troca

```
Seletor → POST /demo/personas/{key}/token
       → adoptSession(token)
       → destino
```

| Persona | Label na UI | Destino |
|---------|-------------|---------|
| `teacher` | Helena · Professora | `resolvePostLoginPath` neste admin (painel do professor) |
| `coordinator` | Ricardo · Coordenação | `resolvePostLoginPath` neste admin (hub da escola) |
| `guardian` | Camila · Responsável | `window.location.assign` para o site (`#demo_token=`) |

Se `NEXT_PUBLIC_SITE_URL` estiver vazia, a troca para Camila **não** emite token: o seletor mostra *“O endereço do portal da família não está configurado.”*

Ao ir para o site, o seletor deste admin some. Voltar para professora/coordenação exige o mesmo seletor no site **ou** novo login no admin. A troca ocorre na mesma aba (roteiro comercial contínuo).

Login inicial do apresentador: `professora@demo.akili.dev` (ou outra persona) + `AKILI_DEMO_PASSWORD`.

---

## 8. UI

- Só renderiza se `GET /demo/personas` devolver ao menos uma persona.
- Posição: primeira linha do [`AppHeader`](../../../../src/layout/AppHeader.tsx) — a que não some no mobile (não fica no menu `⌘`).
- Badge **Demo** + rótulo **Ver como** + `<select>` com a persona atual (`demo_persona_key` ou match de e-mail).
- Select desabilitado durante o carregamento e a troca.
- Erro curto (`role="alert"`) com `getUserFacingApiMessage`. Sem toast externo.
- Não é seletor de escola nem de contratante.

---

## 9. Testes

```bash
npm test -- src/lib/demo/personas.test.ts src/services/demo.service.test.ts
```

Cobertura:

- `isDemoUser` / `shouldProbeDemoPersonas`
- labels comerciais (nunca a chave crua)
- persona atual por `demo_persona_key` ou e-mail
- normalização do payload da lista
- handoff do responsável no hash (não na query)
- destino admin vs site vs URL ausente
- paths do service sem prefixo `/admin`

---

## 10. Checklist de aceite manual

- [ ] Login com `professora@demo.akili.dev` → seletor visível no header
- [ ] Seletor permanece ao navegar (turmas, alunos, dashboards)
- [ ] Trocar para coordenação → permanece no admin, painel muda
- [ ] Trocar de volta para professora → painel do professor
- [ ] Trocar para responsável com `NEXT_PUBLIC_SITE_URL` → sai para o site com `#demo_token=`
- [ ] Usuário não-demo (`is_demo: false` ou 403 em `/demo/personas`) → seletor ausente
- [ ] Sem `NEXT_PUBLIC_SITE_URL` → mensagem clara ao escolher Camila; sessão atual intacta

---

## 11. Dependências externas

1. Backend com `AKILI_DEMO_ENABLED=true`, tenant demo provisionado e rotas `/api/v1/demo/*` no ar.
2. `GET /admin/auth/me` preferencialmente incluindo `is_demo` e `demo_persona_key`.
3. Site consumindo `#demo_token=` (outro repositório).
