# Central de Ajuda — Portal do Responsável (`site`)

Consumo da FAQ publicada no portal `guardian`. CMS e regras de publicação ficam no Admin/API; este app só renderiza.

Contrato: `GET /api/v1/support/faq/*?portal=guardian` (via BFF Next).

## Entrada

- FAB flutuante no shell do responsável (`SupportFloatingButton`)
- Item de navegação **Central de Ajuda** → `/ajuda`

## Rotas

| Rota | Descrição |
|------|-----------|
| `/ajuda` | Home (busca + tópicos) |
| `/ajuda/topicos/[topicUuid]` | Tópico + lista de FAQs |
| `/ajuda/topicos/[topicUuid]/faqs/[faqUuid]` | Artigo + ações |

## Camadas

| Camada | Path |
|--------|------|
| BFF | `app/api/support/faq/*` — força `portal=guardian`; `app/api/support/tawk/identity` |
| Client BFF | `services/bff/support.bff.ts` |
| React Query | `services/queries/support.queries.ts` |
| UI | `features/support/` |
| Tawk | `features/support/tawk/` (`TawkProvider`, `useTawk`) |
| Tipos | `types/domain/support-faq.ts`, `features/support/tawk/tawk.types.ts` |

O frontend **não** filtra por portal. O BFF/API devolvem só conteúdo publicado para `guardian`.

## Modal

`SupportHelpModal` + estilos em `styles/marketing-overrides.css` (classe `.akili-support-modal`).

- Formato retangular: largura `min(760px, calc(100vw - 2rem))`, altura `min(560px, 82vh)`
- Scroll apenas no body; grid de tópicos 1 / 2 / 3 colunas conforme viewport
- CTA “Falar com suporte” → `useTawk().openChat()` (identidade já sincronizada pelo `TawkProvider`)

## Ações do FAQ

Os botões de ação aparecem **somente no artigo** (`/ajuda/topicos/.../faqs/...`), não no FAB/modal nem na lista de tópicos.

`features/support/lib/map-route-target.ts` mapeia `type=route` para o portal do responsável / aluno:

- `guardian_signin` → `/signin`
- `guardian_first_access` → `/first-access`
- `guardian_forgot_password` → `/forgot-password`
- `guardian_children` → `/children`
- `guardian_profile` → `/profile`
- `guardian_reports` → `/relatorios`
- `student_login` → `/aluno/entrar`
- `student_materials` → `/aluno/materiais`

Targets de Admin / professor / escola são omitidos. `external_url` só `https` / `mailto`. Lista ausente ou vazia após o filtro: a seção “Ações” não é renderizada.

No CMS Admin, o destino deve ser de responsável/aluno quando o tópico está no portal `guardian`; caso contrário o botão não aparece aqui.

A base de conteúdo (tópicos/FAQs) é seedada na API (`FaqSeeder`) e filtrada por `portal=guardian`. Os tópicos Acesso, Minha conta, Meus filhos, Acompanhamento e Acesso do aluno saem com botão de ação em cada artigo; republicar com `php artisan db:seed --class=FaqSeeder`.

## Chat (Tawk.to)

Integração centralizada em `features/support/tawk/`:

1. Sessão autenticada no portal → `GuardianDashboardShell` (Server Component) lê `TAWK_PROPERTY_ID` / `TAWK_WIDGET_ID` inline e passa `config` ao `TawkProvider`
2. Client registra a config (`setTawkPublicConfig`), carrega o embed e só maximiza após identity/login — sem `NEXT_PUBLIC_`
3. BFF `GET /api/support/tawk/identity` → Laravel (única fonte de `user_id` / `hash`)
4. `Tawk_API.login` apenas com o payload da Identity API
5. Logout / troca de usuário / 401 da sessão → `endAuthenticatedTawkSession()` (controller + widget)
6. `openChat` revalida Identity API (`staleTime: 0` + forceRefresh) para não manter identidade após expiração

No painel Tawk, desative Pre-Chat / Lead Capture Form neste widget autenticado (visitante já vem identificado). Logs internos `[Tawk/Form]` / `getForm` podem aparecer como ruído mesmo com o chat ok.

CTA: `isConfigured` (IDs injetados) ≠ `isAvailable` (sync ok). “Chat não configurado” só sem `TAWK_*`; falha de identity/login → “Não foi possível abrir o chat.”

O Tawk pode responder `INVALID_EMAIL` no Secure Mode para e-mails placeholder (ex. `teste@teste.com`). O valor vem do usuário autenticado na Identity API.

Sem sessão Akili: não chama Identity API nem login autenticado. Falhas de API/Tawk fazem logout do visitante autenticado no widget e degradam sem derrubar o portal.

## Fora de escopo

Tickets, impersonation, paginação server-side no consume (lista completa), widget no portal do aluno.
