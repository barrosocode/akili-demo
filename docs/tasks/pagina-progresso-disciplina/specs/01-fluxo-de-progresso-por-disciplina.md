# Spec 01 — Fluxo de progresso por disciplina

**Repo:** `akili-site`  
**Contrato da API:** [relatorio-api.md](../reference/relatorio-api.md)  
**Lista com percentuais:** [01-progresso-por-disciplina-no-dashboard.md](../../componente-progresso-disciplina/specs/01-progresso-por-disciplina-no-dashboard.md)  
**Entrega:** **Meu progresso** deixa de ser uma página única com números de todas as disciplinas. A listagem abre o detalhe da disciplina escolhida, com os mesmos blocos de hoje no recorte dessa disciplina.

O desenho da lista é o card que já existe: círculo colorido, nome, percentual, barra e fração `concluídos / total`. O detalhe reaproveita os indicadores, a frequência, a aprendizagem, a próxima atividade, continuar estudando e os materiais.

Esta spec substitui, na spec da lista, a decisão de manter os indicadores globais em `/aluno/progresso`. A prévia de três itens na home do aluno permanece.

---

## Decisões fechadas

- Índice do aluno em `/aluno/progresso`. Detalhe em `/aluno/progresso/disciplina/[subjectUuid]`.
- No responsável, o índice é a home do ambiente do filho (`/aluno/supervisao/[childRef]`). O detalhe é `/aluno/supervisao/[childRef]/progresso/disciplina/[subjectUuid]`. Não há item **Meu progresso** na sidebar da supervisão; essa home é a superfície de progresso.
- `subjectUuid` é a UUID de `subject_progress[].subject`. Ela vai na URL e em `subject_uuid`. A tela mostra o nome.
- Na listagem, a linha inteira é o link do detalhe. Na prévia da home do aluno, a linha continua sem link; **Ver detalhes** segue para o índice.
- O índice pede o dashboard **sem** `subject_uuid`. O detalhe pede **com** `subject_uuid` em todo pedido de indicador, frequência e aprendizagem.
- O cliente não recalcula percentual, tempo, frequência nem acerto. Mostra o número que a API devolveu naquele pedido.
- `kpis.overall_percent` do detalhe é a média de `percent_complete` da disciplina. A barra da lista continua `subject_progress.percent` (concluídos ÷ total). Os dois números podem divergir. Nenhum substitui o outro.
- `subject_progress`, escola, turma e professor vêm globais mesmo no pedido filtrado. Servem para achar nome, cor e ícone da disciplina e para a linha de contexto. A lista de disciplinas não é desenhada de novo no detalhe.
- No responsável, `materials` do learning continua o catálogo inteiro. O detalhe filtra essa lista no cliente por `content.subject.uuid`. KPIs, continuar estudando e próxima atividade já vêm recortados.
- Aprendizagem (`kpis/learning` e `charts/learning`) já aceita `subject_uuid` na API. Esta entrega da API não alterou essas rotas. O site passa a encaminhar o parâmetro.
- Frequência existe só para o aluno. A supervisão não pede esse endpoint.
- UUID inválida ou disciplina excluída: a mensagem de `errors.subject_uuid`. A tela não cai nos cards zerados.
- Visual Kiddino. Sem Tailwind e sem `components/ui`. A tela não mostra UUID.

---

## 1. Rotas

| Quem | Índice | Detalhe |
| --- | --- | --- |
| Aluno | `/aluno/progresso` | `/aluno/progresso/disciplina/[subjectUuid]` |
| Responsável | `/aluno/supervisao/[childRef]` | `/aluno/supervisao/[childRef]/progresso/disciplina/[subjectUuid]` |

O segmento estático `disciplina` separa o detalhe de um eventual filho futuro de `/progresso`. O player de materiais não usa esse caminho.

A sidebar do aluno mantém **Meu progresso** em `/aluno/progresso`. O detalhe continua com esse item ativo: `resolveStudentShellActiveHref` já trata o prefixo `/aluno/progresso/`. Na supervisão, o detalhe não começa em `materiais`, então o item ativo continua **Ambiente do aluno**. Sem item novo de menu e sem mudança no resolvedor.

A prévia da home (`/aluno`) não muda de rota. **Ver detalhes** abre o índice.

---

## 2. O que entra nesta entrega

| Peça | Papel |
| --- | --- |
| `app/(aluno)/aluno/(estudante)/progresso/page.tsx` | Shell do índice. Sem indicadores. |
| `app/(aluno)/aluno/(estudante)/progresso/disciplina/[subjectUuid]/page.tsx` | Shell do detalhe. Lê `subjectUuid` e repassa. |
| `app/(aluno)/aluno/supervisao/[childRef]/progresso/disciplina/[subjectUuid]/page.tsx` | Shell do detalhe do filho. |
| `features/student/components/student-progress-subjects.tsx` | Índice do aluno: dashboard sem filtro e lista com link. |
| `features/student/components/supervision-progress-subjects.tsx` | Índice do filho, no lugar do dashboard global. |
| `features/student/components/student-dashboard-view.tsx` | Detalhe. Passa a aceitar `subjectUuid` e pedir o recorte. |
| `features/subjects/components/subject-progress-list.tsx` | `hrefFor` opcional. A prévia não usa. |
| `features/progress/components/learning-overview.tsx` | Envia `subject_uuid` nos filtros quando o detalhe informa a disciplina. |
| `app/api/student/dashboard/route.ts` | Repassa `subject_uuid`. |
| `app/api/student/kpis/frequency/route.ts` | Repassa `subject_uuid`. |
| `app/api/guardian/children/[ref]/learning/route.ts` | Repassa `subject_uuid`. |
| `app/api/student/kpis/learning/route.ts` | Inclui `subject_uuid` nos parâmetros encaminhados. |
| `app/api/student/charts/learning/route.ts` | O mesmo. |
| `app/api/guardian/children/[ref]/kpis/learning/route.ts` | O mesmo. |
| `app/api/guardian/children/[ref]/charts/learning/route.ts` | O mesmo. |
| `types/domain/learning.ts` | `subject_uuid` opcional em `LearningQueryFilters`. |
| `services/bff/children.bff.ts` | `learningSearchParams` inclui `subject_uuid` quando preenchido. |
| `features/student/hooks/use-student-dashboard.ts` | Query do dashboard e do learning do filho aceitam a disciplina. Chave separada do pedido global. |
| `features/student/hooks/use-student-frequency.ts` | O mesmo para a frequência. |
| `features/student/lib/student-progress-scope.ts` | Monta a query. Sem I/O. |
| `lib/auth/portal-paths.ts` | `studentProgressSubjectPath` e `supervisionProgressSubjectPath`. |
| `styles/marketing-overrides.css` | A linha-link ocupa a linha, com alvo de toque e foco. |

Fora desta entrega:

- Prévia da home: corte em três, **Ver detalhes** e linha sem link.
- Página de materiais da disciplina e o player.
- Lista plana de materiais da supervisão.
- Progresso do professor.
- Recalcular KPI no cliente a partir de `subject_progress` ou da lista de materiais.
- Paginação.
- Item novo na sidebar.

---

## 3. Contrato que a tela usa

| Quem | Pedido no browser | Laravel | Quando |
| --- | --- | --- | --- |
| Aluno | `GET /api/student/dashboard` | `GET /mobile/student/dashboard` | Índice e prévia |
| Aluno | `GET /api/student/dashboard?subject_uuid=` | o mesmo com a query | Detalhe |
| Aluno | `GET /api/student/kpis/frequency?subject_uuid=` | `GET /mobile/student/kpis/frequency?subject_uuid=` | Detalhe |
| Aluno | `GET /api/student/kpis/learning?…&subject_uuid=` | `GET /mobile/student/kpis/learning` | Detalhe |
| Aluno | `GET /api/student/charts/learning?…&subject_uuid=` | `GET /mobile/student/charts/learning` | Detalhe |
| Responsável | `GET /api/guardian/children/[ref]/learning` | `GET /guardian/students/{uuid}/learning` | Índice e materiais da supervisão |
| Responsável | `GET /api/guardian/children/[ref]/learning?subject_uuid=` | o mesmo com a query | Detalhe |
| Responsável | `GET /api/guardian/children/[ref]/kpis/learning?…&subject_uuid=` | `GET /guardian/students/{uuid}/kpis/learning` | Detalhe |
| Responsável | `GET /api/guardian/children/[ref]/charts/learning?…&subject_uuid=` | `GET /guardian/students/{uuid}/charts/learning` | Detalhe |

`subject_uuid` ausente no browser não é repassado. O comportamento global de hoje permanece para a home, o índice, a frequência da tela de materiais e o learning sem filtro.

Regras da query, iguais nas rotas novas e nas que já aceitavam o parâmetro:

| Entrada | Resultado |
| --- | --- |
| ausente, `null` ou `""` | sem filtro |
| UUID inválido | `422`, `errors.subject_uuid`: `A disciplina deve ser um UUID válido.` |
| disciplina inexistente ou excluída | `422`, `errors.subject_uuid`: `Disciplina não encontrada.` |
| disciplina ativa sem material do aluno | KPIs zerados, `continue_studying` e `next_activity` nulos, frequência zerada |

No dashboard filtrado, `materials` do aluno traz no máximo seis itens, todos da disciplina. `activities_completed` é o mesmo contador de `materials_completed`. A frequência não deduplica: o mesmo conteúdo em dois pacotes pode contar duas vezes. O dashboard deduplica. A tela não reconcilia os dois.

---

## 4. Índice

Client component. A página server só o renderiza.

Cabeçalho:

- Aluno: `h2` **Meu progresso**.
- Responsável: o link **Voltar aos filhos** que já existe (`/children`, `vs-btn style3`) e o `h2` **Meu progresso**. Uma linha com o nome do filho quando o learning já trouxe `student.name`. Sem o alerta longo de acompanhamento: nesta página não há ação de estudo.

`SubjectProgressList` entra com `mode="full"`, `title=""` e `hrefFor`:

- Aluno: `studentProgressSubjectPath(item.subject.uuid)`.
- Responsável: `supervisionProgressSubjectPath(childRef, item.subject.uuid)`.

Dados: o dashboard ou o learning **sem** `subject_uuid`, o mesmo pedido que a prévia e a tela de materiais da supervisão já fazem. A ordem é a de `subject_progress`. O cliente não reordena.

Estados, com as frases que a prévia já usa:

- Carregando, sem dado anterior: **Carregando seu progresso...**
- Erro de rede, sem dado anterior: **Não foi possível carregar o progresso.**
- Lista vazia: **Nenhuma disciplina com conteúdo ainda.**
- Sucesso: as linhas. Sem **Ver detalhes** no card (`mode="full"` já esconde o link).

A linha com `hrefFor` é um `Link` em volta do conteúdo atual (ícone, nome, barra, percentual e fração). Altura mínima de 44px. Sem sublinhado. Foco com anel `2px solid #16a34a` e `outline-offset: 2px`, o mesmo do **Ver detalhes**. O nome acessível do link é o nome da disciplina e o percentual já arredondado, por exemplo `Português, 80%`. A barra continua `role="progressbar"`. Sem `hrefFor`, a linha permanece como está na prévia.

---

## 5. Detalhe

A página server lê `subjectUuid` e repassa ao client. `StudentDashboardView` ganha `subjectUuid?: string`. Sem esse prop, o componente não é mais a página de progresso: o índice não o usa. O detalhe sempre envia o prop.

Ordem, de cima para baixo, igual à página de hoje, com o recorte:

1. Link **Voltar**, `vs-btn style3`, para o índice (aluno: `/aluno/progresso`; responsável: a home do filho).
2. No responsável, o alerta **Modo acompanhamento** permanece.
3. `h2` com o nome da disciplina. A fonte é o item de `subject_progress` cujo `subject.uuid` é o da URL, no payload do próprio detalhe (a lista vem global). Enquanto esse payload carrega, o título não usa a UUID; o texto é **Carregando...**. Se a resposta chegou e a UUID não está em `subject_progress`, o título é **Disciplina**.
4. Linha de contexto que já existe: escola, turma e, no aluno, o rótulo da série. Esses campos continuam globais.
5. Quatro cards de `kpis`: **Progresso geral** (`overall_percent`), **Atividades concluídas**, **Materiais concluídos**, **Tempo estudado**.
6. **Frequência das aulas**, só no aluno, com os quatro cards de hoje. `available_count === 0` mostra **Não há aulas disponíveis nesta disciplina.** A frase da matrícula inteira fica na tela de materiais, que continua pedindo a frequência sem filtro.
7. `LearningOverview` (**Como você está indo** no aluno, **Aprendizagem** no responsável), com os filtros de período, resultado e momento que já existem, mais `subject_uuid`.
8. **Próxima atividade** e **Continuar estudando**, quando o campo não é nulo. Os links de estudo seguem os destinos de hoje (`/aluno/materiais/[contentUuid]` ou a supervisão).
9. **Seus materiais.**

Materiais no detalhe:

- Aluno: os `materials` do dashboard filtrado (no máximo seis, já da disciplina). **Ver todos** vai para `/aluno/materiais/disciplina/[subjectUuid]`.
- Responsável: filtra `materials` por `content.subject.uuid === subjectUuid`. A API não recorta essa chave. Mostra todos os itens da disciplina que sobraram. **Ver todos** continua em `/aluno/supervisao/[childRef]/materiais`, a lista plana. A supervisão não ganha página de disciplina nesta entrega.

`continue_studying` e `next_activity` nulos: o bloco some, como hoje. Não escolher outro item na lista de materiais.

Disciplina ativa sem material (200 com zeros): os quatro cards aparecem zerados, frequência zerada com a frase desta disciplina, aprendizagem no vazio que já existe (**Ainda não há respostas neste período.**), sem próxima atividade e sem continuar estudando. Materiais vazios não ganham frase nova: a grade fica vazia.

422 de `subject_uuid` no dashboard ou no learning do filho ocupa a página: **Voltar** e a mensagem do campo. Sem essa chave, vale o bloco vermelho atual (`detail` ou `title`). Os cards não aparecem. Exemplos estáveis: **A disciplina deve ser um UUID válido.** e **Disciplina não encontrada.** A mesma leitura de `errors.subject_uuid` que `studentMaterialsErrorMessage`.

Erro só da frequência ou só de um gráfico fica no bloco correspondente, como hoje. Não apaga os KPIs que já chegaram.

---

## 6. Pedidos e cache

`student-progress-scope` expõe uma função pura. Recebe a UUID opcional e devolve a query pronta para concatenar, ou string vazia.

| `subjectUuid` trimado | Resultado |
| --- | --- |
| ausente ou vazio | `""` |
| preenchido | `?subject_uuid=` com o valor em `URLSearchParams` |

Quem já tem query (aprendizagem) não usa o `?` dessa função: acrescenta `subject_uuid` no `URLSearchParams` existente só quando o trim não é vazio.

Assinaturas. O argumento novo é opcional e vem depois dos que já existem. Chamada antiga permanece global.

```ts
useStudentDashboardQuery(enabled?: boolean, subjectUuid?: string)
useStudentFrequencyQuery(enabled?: boolean, subjectUuid?: string)
useGuardianSupervisionDashboardQuery(childRef: string, enabled?: boolean, subjectUuid?: string)
```

Chaves:

- Dashboard do aluno: `["student", "dashboard"]` sem filtro; `["student", "dashboard", subjectUuid]` com filtro.
- Frequência: `["student", "kpis", "frequency"]` sem filtro; o terceiro segmento é a UUID quando há filtro. `StudentMaterialsList` continua na chave sem filtro.
- Learning do filho: a chave atual sem filtro. Com filtro, a UUID entra como segmento a mais. A tela de materiais da supervisão continua no pedido sem filtro, para não ler o cache do detalhe.

`LearningQueryFilters` ganha `subject_uuid?: string`. `LearningOverview` recebe `subjectUuid?: string` e o coloca nos filtros. O detalhe sempre passa. Período, resultado e momento não mudam.

Os route handlers leem `subject_uuid`, aplicam `trim` e só então repassam. Valor vazio não segue para o Laravel. Nenhum outro parâmetro novo entra no dashboard nem na frequência. `search` continua exclusivo de materiais.

---

## 7. Critério de aceite

- `/aluno/progresso` mostra todas as disciplinas de `subject_progress`, na ordem da API, sem os quatro indicadores, sem frequência, sem gráficos e sem materiais.
- Cada linha abre `/aluno/progresso/disciplina/[subjectUuid]`. A UUID não aparece no texto.
- A home do aluno mantém no máximo três disciplinas. **Ver detalhes** abre o índice. A linha da prévia não navega.
- O detalhe do aluno pede dashboard, frequência, KPI e os cinco gráficos com o mesmo `subject_uuid`. Sem o parâmetro, esses pedidos não acontecem nessa página.
- **Progresso geral** é `kpis.overall_percent` do pedido filtrado. A barra da lista não é reescrita com esse número, nem o card com `subject_progress.percent`.
- **Atividades concluídas** e **Materiais concluídos** mostram os dois campos, mesmo quando os valores coincidem.
- Continuar estudando e a próxima atividade, quando existem, são da disciplina. **Ver todos** do aluno abre a página de materiais daquela disciplina.
- Frequência zerada no detalhe: **Não há aulas disponíveis nesta disciplina.** A tela de materiais segue com a frase da matrícula e com a frequência sem filtro.
- Ambiente do filho: a home é a lista completa, com **Voltar aos filhos**. O detalhe recorta KPIs, continuar, próxima e aprendizagem. Os cards de materiais são só da disciplina, filtrados no cliente. Não há frequência.
- UUID inválida ou disciplina excluída mostra a mensagem de `errors.subject_uuid`, com **Voltar**, sem cards zerados.
- Disciplina ativa sem material do aluno: cards zerados e blocos nulos omitidos.
- `subject_progress` no detalhe não vira uma segunda lista.
- Sidebar: **Meu progresso** ativo no índice e no detalhe do aluno. **Ambiente do aluno** ativo no índice e no detalhe do filho.
- Teste de `student-progress-scope`: UUID vazia omite a query; UUID preenchida envia `subject_uuid`. Teste de `learningSearchParams`: sem `subject_uuid` o param não entra; com ele, entra junto de período, resultado e momento.
