# PROMPT — Orquestrar front-end admin (Kanban do professor)

## PERSONA

Atue como engenheiro de software no `akili-admin` (TailAdmin / portal do professor). Implemente código de produção. Não crie testes automatizados. Não faça commit a menos que o usuário peça.

## CONTEXTO

A API v1 já expõe GET board, tasks e plano atual no prefixo `/api/v1/teacher`. Este recorte é **só o admin**.

Leia **nesta ordem**:

1. [../00-roadmap.md](../00-roadmap.md)
2. Contrato **v1**: [../contratos-api-v1.md](../contratos-api-v1.md)
3. [../specs/01-quadro-do-professor.md](../specs/01-quadro-do-professor.md)
4. `docs/modules/teacher-study-board/schema/` e `prompts/main.md`

Se a versão da API não estiver explícita, **aborte**.

Envelope: chaves `board` / `tasks` / `study_plan`. **Não** usar `apiClientData` que espera `{data}`. Erros: padrão já usado no admin (Problem Details ou envelope — não misturar).

Workspace pode ser só `akili-admin`. Specs no `akili-api` → leia de lá, **escreva no admin**. Sem `akili-site`, sem migration na API.

## DECISÕES FECHADAS

- Read-only. Professor da turma vê; não gera; não edita inputs.
- Colunas iguais ao site. Sem PATCH.
- Sem DPS na UI.
- Sem testes, sem commit em `main`.

## TAREFA

Espírito de `/sdd-module teacher-study-board`: plano → OK → código → relatório.

## FORA DE ESCOPO

- Endpoints novos.
- Player / sessão.
- Formulário de TDAH.
- Commit em `main`.

## CRITÉRIO DE PRONTO

- Ficha do aluno da turma mostra Kanban e plano atual (ou empty state).
- Aluno de outra turma: 403.
- Relatório em `docs/modules/teacher-study-board/reports/` e `docs/tasks/kanban/reports/YYYY-MM-DD_spec-01.md`.
