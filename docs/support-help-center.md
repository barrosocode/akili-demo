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
| BFF | `app/api/support/faq/*` — força `portal=guardian` |
| Client BFF | `services/bff/support.bff.ts` |
| React Query | `services/queries/support.queries.ts` |
| UI | `features/support/` |
| Tipos | `types/domain/support-faq.ts` |

O frontend **não** filtra por portal. O BFF/API devolvem só conteúdo publicado para `guardian`.

## Modal

`SupportHelpModal` + estilos em `styles/marketing-overrides.css` (classe `.akili-support-modal`).

- Formato retangular: largura `min(760px, calc(100vw - 2rem))`, altura `min(560px, 82vh)`
- Scroll apenas no body; grid de tópicos 1 / 2 / 3 colunas conforme viewport
- CTA “Falar com suporte” desabilitado (chat/Tawk.to fora de escopo)

## Ações do FAQ

`features/support/lib/map-route-target.ts` mapeia `type=route` para paths do portal do responsável / aluno. Targets de professor/escola são omitidos. `external_url` só `https` / `mailto`.

## Fora de escopo

Chat, tickets, impersonation, paginação server-side no consume (lista completa).
