# KPIs de progresso no escopo da disciplina

**Data:** 2026-10-22  
**Repo da API:** `akili-api`  
**Spec:** [../specs/02-kpis-de-progresso-por-disciplina.md](../specs/02-kpis-de-progresso-por-disciplina.md)  
**Contrato:** [../../../api/22-student-web-portal.md](../../../api/22-student-web-portal.md)

A página de detalhe da disciplina reutiliza o dashboard e a frequência com `subject_uuid`. Sem o parâmetro, a resposta continua global.

Não há migration nesta entrega. Validação de schema via MCP não se aplica.

## 1. O que mudou

Três leituras aceitam `subject_uuid` opcional, validadas por `StudentSubjectScopeRequest`:

| Método | Path | Recorte |
| --- | --- | --- |
| GET | `/api/v1/mobile/student/dashboard` | `kpis`, `continue_studying`, `next_activity` e preview `materials` (até seis) |
| GET | `/api/v1/mobile/student/kpis/frequency` | contagem sem dedupe, só da disciplina |
| GET | `/api/v1/guardian/students/{uuid}/learning` | a parte que vem do dashboard; `materials` segue o catálogo completo |

`subject_progress`, `school`, `classroom` e `teacher` do dashboard permanecem globais, com ou sem a query. O progresso do professor (`GetTeacherStudentProgress`) não recebe o parâmetro e continua no catálogo inteiro.

## 2. Regras da query

| Entrada | Resultado |
| --- | --- |
| ausente, `null` ou `""` | sem filtro |
| UUID inválido | `422`, `errors.subject_uuid`: `A disciplina deve ser um UUID válido.` |
| disciplina inexistente ou com `deleted_at` | `422`, `errors.subject_uuid`: `Disciplina não encontrada.` |
| disciplina ativa sem material do aluno | KPIs zerados, `continue_studying` e `next_activity` nulos |

No dashboard, o filtro acontece depois do dedupe de `StudentSubjectProgressSummary::dedupedMaterials`, em `content.subject.uuid`. `overall_percent` é a média de `percent_complete` nesse recorte. `subject_progress[].percent` continua concluídos ÷ total no catálogo inteiro. `activities_completed` é o mesmo contador de `materials_completed`.

A frequência chama `StudentMaterialCatalog::listMaterials($student, null, $subjectUuid)` e não deduplica. Vista = `status != not_started`. Cache de 3 minutos: `learning_frequency:{studentId}` sem filtro e `learning_frequency:{studentId}:{subjectUuid}` com filtro.

`search` continua exclusivo de `GET /mobile/student/materials`. `kpis/learning` e `charts/learning` não mudaram.

## 3. Exemplo

`GET /api/v1/mobile/student/dashboard?subject_uuid=a1b2c3d4-e5f6-7890-abcd-ef1234567890`

Envelope legado `{ data }`. `subject_progress` na resposta real lista todas as disciplinas do aluno; o trecho abaixo mostra só a forma do recorte.

```json
{
  "data": {
    "kpis": {
      "overall_percent": 40,
      "materials_available": 5,
      "materials_completed": 2,
      "materials_in_progress": 1,
      "time_studied_seconds": 900,
      "activities_completed": 2
    },
    "continue_studying": {},
    "next_activity": {},
    "materials": []
  }
}
```

`GET /api/v1/mobile/student/kpis/frequency?subject_uuid=a1b2c3d4-e5f6-7890-abcd-ef1234567890`

```json
{
  "frequency": {
    "available_count": 5,
    "viewed_count": 3,
    "pending_count": 2,
    "viewed_percent": 60.0
  }
}
```

## 4. Ambiente

Nenhum passo manual de ambiente. Sem DDL e sem variável nova.

## 5. QA manual

- [ ] Sem `subject_uuid`, dashboard e frequência batem com o comportamento anterior.
- [ ] Com `subject_uuid` de Português, `materials_available` é o total deduplicado de Português, e `subject_progress` ainda lista as outras disciplinas.
- [ ] `overall_percent` do filtro é a média de `percent_complete` da disciplina, distinta de `subject_progress.percent` quando as contas divergem.
- [ ] `activities_completed` igual a `materials_completed` no recorte.
- [ ] `continue_studying` e `next_activity` pertencem à disciplina. Preview `materials` tem no máximo seis itens, todos dela.
- [ ] Mesmo conteúdo em dois pacotes da disciplina: dashboard conta uma vez; frequência pode contar duas.
- [ ] UUID inválido e disciplina excluída: `422` nos três endpoints, com as mensagens da seção 2.
- [ ] Disciplina ativa sem material do aluno: KPIs zerados, `continue_studying` e `next_activity` nulos, `frequency` com zeros. `subject_progress` do aluno intacto.
- [ ] Learning do responsável com o query recorta os KPIs do filho e mantém `materials` completo.
- [ ] Progresso do professor, sem o query, continua global.
- [ ] Cache de frequência de uma disciplina não devolve o número global, nem o de outra disciplina.
