# PROMPT — Orquestrar Kanban de estudos do aluno

## PERSONA

Atue como engenheiro de software no monólito Laravel da Akili. Implemente código de produção, migrations e contratos. Não crie testes automatizados (Pest/PHPUnit). Não faça commit a menos que o usuário peça.

## CONTEXTO

O personal-planner é só referência de UX/Kanban. A Akili precisa de **um board por aluno**, cards gerados por regras determinísticas e status puxado de `learning_sessions`.

Leia **nesta ordem**:

1. [../00-roadmap.md](../00-roadmap.md)
2. Specs `01` → `04` em [../specs/](../specs/)
3. Schemas SDD em `docs/modules/<modulo>/schema/` e `docs/modules/<modulo>/prompts/main.md`

ADRs 012, 013, 014. Envelope HTTP padrão. Backend só via Docker/Makefile. MCP `user-postgres-akili`: validar schema **antes** de DDL, só leitura; não DROP/DELETE destrutivo.

## DECISÕES FECHADAS

Estão no roadmap §2. Não reabrir: 1A, 2B, card=tópico/revisão, responsável gera, regen 5B, sem task manual, progresso 7A, card só com conteúdo+entitlement 8C, settings DPS novos, motor sem LLM, colunas backlog/todo/doing/done.

## TAREFA

Orquestre **uma spec por vez**, na ordem 01 → 02 → 03 → 04.

Para cada spec:

1. Relê-la por completo e o schema SDD correspondente.
2. Execute o espírito de `/sdd-module <nome>`: migrations, models, Actions, Policies, rotas, envelope, paginação.
3. Não gere suíte Pest.
4. Escreva `docs/tasks/kanban/reports/YYYY-MM-DD_spec-0N.md`.
5. Pare. Só avance se o usuário pedir a próxima (ou “segue tudo”).

| Spec | `/sdd-module` | Schema |
|---|---|---|
| 01 | `student-boards` | `docs/modules/student-boards/` |
| 02 | `study-plan-inputs` | `docs/modules/study-plan-inputs/` |
| 03 | `study-plans` | `docs/modules/study-plans/` |
| 04 | `study-tasks` | `docs/modules/study-tasks/` |

Workspace pode ser só `akili-api`. Não invente arquivos em `akili-site` / `akili-admin` nesta pasta, salvo a spec pedir contrato/BFF mínimo documentado no relatório.

## FORA DE ESCOPO

- LLM / motor adaptativo
- Comentários, anexos, share por e-mail, vários boards
- Cards manuais / `task_children`
- KPI de atraso (é o Kanban, não o recorte de gamificação)
- Commit em `main`
- `make migrate-fresh` sem pedido explícito

## CRITÉRIO DE PRONTO

- Specs 01–04 no código (ou bloqueio registrado).
- Relatório por spec.
- Cadastro de aluno cria board; responsável verificado entra como membro; geração cria cards só 8C; status anda com sessão.
- Envelope padrão nas rotas novas.
