# Regras Cursor — Portal do Responsável

Guia das regras em `.cursor/rules/` e como se complementam.

## Divisão de responsabilidade

| Regra | Responsabilidade |
|-------|------------------|
| `frontend-product-experience.mdc` | **Como pensar** — papéis da IA, processo pré-tela, CRO B2C, mobile first, personas, barra de qualidade |
| `akili-client-ux.mdc` | **Como implementar** — anti-UUID, B2C vs escola, empty states |
| `akili-client-ui-forms.mdc` | Formulários RHF + Zod, componentes shadcn |
| `akili-client-core.mdc` | Governança, BFF, feature-first, checklist |

Fluxo recomendado: `frontend-product-experience` → `akili-client-ux` na implementação.

## Personas (portal)

| Persona | Contexto |
|---------|----------|
| **Responsável (pai/mãe)** | Primária — filhos, planos, progresso, pagamento |
| **Aluno** | Quando exposto no portal |

## CRO B2C

- Compra e ativação de planos
- Onboarding de filhos (`canAddChildren`)
- Retenção e renovação
- Redução de abandono no funil

## Referências

- [development.md](./development.md) — setup e fluxo de dados
- [architecture.md](./architecture.md) — visão arquitetural
