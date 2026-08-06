# SPEC-021 — Portal Web do Aluno (MVP integrado)

| Campo | Valor |
| --- | --- |
| ID | SPEC-021 |
| Status | Entregue (MVP) |
| Depende de | SPEC-013…018, `api/docs/api/22-student-web-portal.md` |

## Princípio

Um único domínio de aprendizagem. App mobile e portal web consomem **`/api/v1/mobile/*`**. Progresso em `student_content_progress`.

## Auth por perfil (site)

`POST /api/auth/login` identifica o destino via `user.type`, roles e permissions:

| Perfil | Destino |
| --- | --- |
| Student | `/aluno` (cookies `akili_student_*`) |
| Guardian | Portal responsável `/` |
| Teacher / School / Coordinator / Admin | `ADMIN_APP_URL` |

Login dedicado: `/aluno/entrar` → `POST /api/student/auth/login`.  
Alias: `/student/dashboard` → `/aluno`.

Alunos **não** passam pelo fluxo de termos LGPD.

## Rotas site

| Rota | Papel | Layout |
| --- | --- | --- |
| `/aluno/entrar` | Login aluno | fullBleed |
| `/aluno` | Dashboard | sidebar |
| `/aluno/materiais` | Lista de materiais | sidebar |
| `/aluno/materiais/[contentUuid]` | Player em abas | fullBleed (imersivo) |
| `/aluno/supervisao/[childRef]` | Guardian — ambiente read-only | sidebar |
| `/aluno/supervisao/[childRef]/materiais/...` | Materiais/conteúdo read-only | fullBleed na lição |

## Player (Kiddino)

- Organização pedagógica (igual Admin `DefaultPreviewPlayer`): **Conteúdo · Conferência · Revisão 1–3 · Desafio**
- Distribuição por `question_type` (`memorization` / `generalized`)
- Cores/contornos/CTAs do tema Kiddino (`vs-btn`, `--theme-color`)
- Navegação: **Anterior** / **Continuar** / **Concluir material**
- Progresso salvo só em Continuar/Concluir (`time_studied_seconds_delta` real)
- TTS via `actions` do playback (`speak.js`)
- Arquivos: `features/content-player/components/student-lesson-player.tsx`

## Guardian

Botão **Acessar Ambiente do Aluno** em lista e detalhe do filho → `/aluno/supervisao/[ref]`.  
Supervisão: mesmo player, banner read-only, sem mutação de progresso.

## Smoke test

1. `/signin` com `luiza@familia.dev` / `123123` → redirect `/aluno` (sem termos).
2. Dashboard com KPIs e material de Ciências.
3. Abrir material → abas Kiddino; Continuar bloqueia se questões pendentes.
4. Concluir material → progresso 100% (`POST progress`).
5. Login responsável → filho → **Acessar Ambiente do Aluno** → visualização sem editar.
6. Login `professor@escola-exemplo.dev` em `/signin` → redirect ao admin.

## Referências

- Contratos API: `api/docs/api/22-student-web-portal.md`
- Demo: `api/docs/akili-platform/16-demo-ambiente.md`
- Player: `features/content-player/`
- Aluno: `features/student/`
- Auth destino: `lib/auth/portal-destination.ts`
