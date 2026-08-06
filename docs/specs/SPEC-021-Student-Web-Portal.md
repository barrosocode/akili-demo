# SPEC-021 — Portal Web do Aluno (MVP integrado)

| Campo | Valor |
| --- | --- |
| ID | SPEC-021 |
| Status | Entregue (MVP) |
| Depende de | SPEC-013…018, `api/docs/api/22-student-web-portal.md` |

## Princípio

Um único domínio de aprendizagem. App mobile e portal web consomem **`/api/v1/mobile/*`**. Progresso em `student_content_progress`.

## Rotas site

| Rota | Papel |
| --- | --- |
| `/aluno/entrar` | Login aluno (cookies separados) |
| `/aluno` | Dashboard |
| `/aluno/materiais` | Lista de materiais |
| `/aluno/materiais/[contentUuid]` | Player Kiddino |
| `/aluno/supervisao/[childRef]` | Guardian — ambiente read-only |
| `/aluno/supervisao/[childRef]/materiais/...` | Materiais/conteúdo read-only |

## Guardian

Botão **Acessar Ambiente do Aluno** em lista e detalhe do filho → `/aluno/supervisao/[ref]`.

## Smoke test

1. Login aluno demo (`aluno@escola-exemplo.dev` / senha do seed).
2. Dashboard com KPIs e materiais dos entitlements.
3. Abrir material → páginas/questões renderizadas.
4. Avançar lição → progresso persiste (`POST progress`).
5. Login responsável → filho → **Acessar Ambiente do Aluno** → visualização sem editar.

## Referências

- Contratos API: `api/docs/api/22-student-web-portal.md`
- Player: `features/content-player/`
- Aluno: `features/student/`
