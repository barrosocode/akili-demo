# 16. Ambiente de demo

Este documento cobre dois ambientes distintos:

- **Ambiente comercial** (seção abaixo): tenant `is_demo` que roda **junto com a produção**, usado pelo time comercial em apresentações a clientes. Governado pela [ADR-018](13-decisoes-tecnicas-fechadas.md).
- **Ambiente de desenvolvimento** (a partir de "Pré-requisitos"): seeds locais para validar features.

---

# Ambiente comercial

Um tenant isolado com uma escola, uma turma e três personas — professora, responsável e coordenador — sobre **os mesmos dados**. O apresentador loga uma vez e troca de persona sem senha, o que permite contar a história do mesmo aluno em três pontos de vista.

## Configuração

O ambiente é inerte enquanto `AKILI_DEMO_ENABLED=false`: as rotas recusam, o comando falha e o rebuild não é agendado.

```env
AKILI_DEMO_ENABLED=true
AKILI_DEMO_TENANT_ID=            # UUID impresso pelo seeder; sem ele os endpoints respondem 403
AKILI_DEMO_PASSWORD=             # senha das personas — trate como credencial de produção
AKILI_DEMO_TOKEN_TTL_MINUTES=480
AKILI_DEMO_RESET_ROW_LIMIT=5000
```

Provisionamento inicial:

```bash
# Pré-requisito: pacote e conteúdo de alfabetização publicados
docker compose exec app php artisan db:seed \
  --class='Database\Seeders\Demo\DemoEnvironmentSeeder' --force
```

O seeder imprime o `AKILI_DEMO_TENANT_ID`. Copie-o para o `.env` e reinicie a aplicação. O UUID é determinístico (UUIDv5): ele **não muda** entre rebuilds, então só precisa ser configurado uma vez.

## Personas

Todas no tenant `demo-colegio-aurora`, escola "Colégio Aurora — Unidade Centro", turma "1º Ano A — Alfabetização (Manhã)".

| Persona | Chave | Login | Painel |
|---------|-------|-------|--------|
| Profa. Helena Ribeiro | `teacher` | `professora@demo.akili.dev` | Admin — painel do professor |
| Camila Duarte | `guardian` | `responsavel@demo.akili.dev` | Site — portal do responsável |
| Ricardo Tavares | `coordinator` | `coordenacao@demo.akili.dev` | Admin — painel do coordenador |

Senha: valor de `AKILI_DEMO_PASSWORD`.

O que costura a narrativa: Camila é mãe de **Theo Duarte** (desempenho excelente) e **Lívia Duarte** (precisa de apoio), ambos alunos da turma que Helena rege e que Ricardo acompanha de forma agregada. A turma tem 20 alunos com cenários variados e atividade distribuída nos últimos 30 dias, de modo que os KPIs de 7/30/90 dias nunca aparecem zerados.

## Troca de persona sem senha

```http
GET  /api/v1/demo/personas                    # lista as personas disponíveis
POST /api/v1/demo/personas/{key}/token        # emite token Sanctum da persona
POST /api/v1/demo/reset                       # reset rápido do ambiente
```

Todas exigem `auth:sanctum` e um ator que seja usuário demo do tenant demo. O token retornado tem TTL de `AKILI_DEMO_TOKEN_TTL_MINUTES` e substitui o token atual no cliente.

```json
{
  "data": {
    "token": "42|...",
    "token_type": "Bearer",
    "expires_at": "2026-09-10T02:35:54+00:00",
    "user": { "...": "..." }
  }
}
```

## Roteiro comercial

1. **AIVI** — demonstração externa, fora da Akili.
2. **Painel do professor** — login com `professora@demo.akili.dev`. Mostrar a turma, os 20 alunos, os KPIs e a aula de alfabetização registrada.
3. **Portal do responsável** — trocar para a persona `guardian`. Mostrar Theo e Lívia, o relatório pedagógico, o progresso e as conquistas. É a mesma aula do passo 2, vista pela família.
4. **Painel do coordenador** — trocar para a persona `coordinator`. Mostrar a visão agregada da escola: turmas, professores, responsáveis e engajamento.

## Reset

**Reset rápido** (`POST /api/v1/demo/reset`) — segundos, entre apresentações. Apaga progresso, sessões de alfabetização, mensagens e as chaves `demo_*` de metadata, depois reexecuta os seeders de progresso e relatórios. Estrutura, pessoas e aceites LGPD permanecem intactos, e os caches de dashboard são invalidados na hora.

**Rebuild completo** (`php artisan demo:rebuild --force`) — destrutivo, agendado diariamente às 04:00. Apaga o tenant inteiro e recria do zero. É a rede de segurança para estado que o reset rápido não conhece; rode manualmente apenas fora de horário comercial.

Não há reset automático no login: zerar o ambiente quando alguém loga derrubaria a sessão de outro apresentador no meio de uma fala.

## Operação

- **Métricas internas:** tenants `is_demo` são excluídos das agregações do dashboard Akili. Para inspecionar o ambiente demo, filtre explicitamente pelo tenant.
- **Auditoria:** toda emissão de token (`demo.persona_token_issued`) e todo reset (`demo.environment_reset`) são registrados com ator, alvo e horário.
- **Limites:** um usuário demo nunca recebe role de escopo global — `EnsureRoleAssignment` rejeita. É isso que o mantém confinado ao tenant demo.
- **Circuit breaker:** o reset aborta se for apagar mais linhas que `AKILI_DEMO_RESET_ROW_LIMIT`.

---

# Ambiente de desenvolvimento

Roteiro único para demonstração (Prioridade 4): API seedada + portal `site` + marketing institucional.

## Pré-requisitos

```bash
# API (Docker)
cd api/docker/compose
docker compose up -d
docker compose exec app php artisan migrate --force
docker compose exec app php artisan db:seed --force

# Site
cd site
npm run dev   # http://localhost:3000
```

OpenAPI: `http://localhost:8000/docs/api`

## Personas

| Persona | Login | Senha | O que mostrar |
|---------|-------|-------|---------------|
| Responsável escola | `responsavel@escola-exemplo.dev` | `password` | 3 filhos, plano Escola, progresso, relatórios, gamificação |
| Responsável B2C | `responsavel@familia.dev` | `password` | 2 filhos, plano Premium, `canAddChildren` |
| Professor | `professor@escola-exemplo.dev` | `password` | Admin TailAdmin — turmas |
| Admin escola | `admin@escola-exemplo.dev` | `password` | Roster / licenças |
| Master | `admin@akili.dev` | `password` | Tenants / subscription |
| Aluno (escola) | `aluno@escola-exemplo.dev` | `123123` | Portal web `/aluno` — João (4º) |
| Aluno (escola) | `ana@escola-exemplo.dev` / `pedro@escola-exemplo.dev` | `123123` | Ana (1º) / Pedro (2º) |
| Aluno (B2C) | `luiza@familia.dev` / `miguel@familia.dev` | `123123` | Família Premium — Luiza com pacote **Ciências** (não alfabetização) |

Canal do aluno (app + web): `POST /api/v1/mobile/auth/login` ou login unificado em `/signin` (redirect por perfil). Contratos: [22-student-web-portal.md](../api/22-student-web-portal.md).

### Redirect pós-login no site (`/signin`)

| Perfil (`user.type` / roles) | Destino |
|---|---|
| `student` | `/aluno` (cookies aluno) |
| `guardian` | Portal responsável `/` |
| Teacher / School Admin / Master / Coordinator | `ADMIN_APP_URL` (ex.: `http://localhost:3001`) |

## Roteiro sugerido (15–20 min)

### 1. Site institucional (deslogado)

Abrir `/` → navegar:

- `/sobre-nos`, `/series`, `/faq`, `/blog` (+ 1 post), `/preco-e-planos`, `/contato`

CTAs “Assinar” / “Cadastro” → `/checkout` ou `/cadastro` (fluxo de assinatura ainda stub — planos alinhados ao catálogo provisório).

### 2. Portal escola

1. `/signin` com `responsavel@escola-exemplo.dev`
2. Home: card de plano **Escola** + 3 filhos com progresso
3. Abrir **João** → Visão geral (escola, turma, professor, KPIs, materiais)
4. Aba Relatórios → relatório pedagógico
5. Aba Conquistas → XP, medalhas, missões
6. Trocar para Ana / Pedro (cenários evolving / needs_support)
7. **Acessar Ambiente do Aluno** (modo acompanhamento read-only) em um filho

### 2b. Portal do aluno (web)

1. Logout do responsável (ou aba anônima)
2. `/signin` ou `/aluno/entrar` com `luiza@familia.dev` / `123123` (ou `aluno@escola-exemplo.dev`)
3. Redirect automático para `/aluno` — **sem** aceite de termos LGPD
4. Dashboard: KPIs, materiais dos entitlements (Luiza: **O mundo microscópico**)
5. Abrir material → player em abas (Conteúdo / Conferência / Revisões / Desafio), tema Kiddino
6. **Continuar** / **Concluir material** → progresso persiste (`student_content_progress`)

### 3. Portal B2C

1. Logout → login `responsavel@familia.dev`
2. Plano **Premium**, Luiza e Miguel
3. `/children/new` (CTA honesto / limite do plano)
4. Upgrade: no Admin master, `PATCH /admin/tenants/{uuid}/subscription` com `{ "plan_key": "essencial" }` (validar bloqueio se alunos > limite)

### 4. Assinatura (demo)

| Passo | Onde |
|-------|------|
| Ver planos | `/preco-e-planos` |
| CTA checkout | `/checkout` (501 até billing) |
| Plano ativo | sessão `/api/auth/me` → `subscription` |
| Mudança admin | `PATCH .../subscription` |

## Checklist de aceite

- [ ] Guardian autenticado (escola e B2C)
- [ ] 2–3 alunos com materiais e relatórios
- [ ] Escola + professor visíveis no progresso
- [ ] Gamificação no detalhe do filho
- [ ] Dashboard completo sem mocks locais
- [ ] Site institucional sem 404 no blog
- [ ] Fluxo de assinatura explicado (planos + subscription na sessão)
- [ ] Aluno estuda na web (`/aluno`) com progresso persistido
- [ ] Guardian acompanha ambiente do filho (read-only)

## Referências

- Seeds: [03-seed-dashboard-guardian.md](../tasks/guardians/reports/03-seed-dashboard-guardian.md)
- Planos: [14-planos-provisorios-demo.md](14-planos-provisorios-demo.md)
- Portal aluno (API): [22-student-web-portal.md](../api/22-student-web-portal.md)
- Portal status: `site/docs/specs/SPEC-018-Portal-Status.md`
- Portal aluno (site): `site/docs/specs/SPEC-021-Student-Web-Portal.md`
