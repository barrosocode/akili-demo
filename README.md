# Akili — Portal do Responsável
  
Frontend Next.js para responsáveis (famílias B2C e convidados pela escola).
 
## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

App: http://localhost:3000  
API Laravel: http://localhost:8000/api/v1 (server-only, via BFF)

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | ESLint |

## Documentação

| Documento | Conteúdo |
|-----------|----------|
| [docs/architecture.md](docs/architecture.md) | Visão arquitetural, BFF, mapa de endpoints |
| [docs/development.md](docs/development.md) | Setup local, variáveis, rotas, como adicionar features |
| [.cursor/rules/](.cursor/rules/) | Regras Cursor para manter padrões no desenvolvimento |

## Escopo

- **Este app:** responsáveis (login, filhos, compras, perfil)
- **Admin (`../admin/`):** escolas e operação interna

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · TanStack Query · Zod · BFF com cookies HttpOnly
