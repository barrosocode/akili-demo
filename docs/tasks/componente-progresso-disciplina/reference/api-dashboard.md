# Progresso por disciplina no dashboard

**Data:** 2026-10-21
**Repo da API:** `akili-api`
**Spec:** [../specs/01-progresso-por-disciplina-no-dashboard.md](../specs/01-progresso-por-disciplina-no-dashboard.md)
**Contrato:** [../../../api/22-student-web-portal.md](../../../api/22-student-web-portal.md)

O card **Meu progresso** lê `data.subject_progress` do dashboard. O front não recalcula percentual a partir da lista de materiais.

## 1. O que mudou

`GET /api/v1/mobile/student/dashboard` (BFF `GET /api/student/dashboard`) ganhou `subject_progress`. Cada item é uma disciplina do catálogo do aluno, com cor, ícone, concluídos, total e percentual.

A métrica é contagem: `materials_completed / materials_total`. Só entra material com `progress.status === completed`. `in_progress` fica de fora do numerador. O mesmo `content.uuid` em dois pacotes conta uma vez. Conteúdo sem disciplina não aparece na lista.

Ordenação: maior `percent` primeiro; empate por `subject.name` ascendente (`strcasecmp`). A lista traz todas as disciplinas com material. O card pode mostrar só as três primeiras; **Ver detalhes** usa o array inteiro. Não há `page` nem `subject_progress_limit`.

`GET /guardian/students/{uuid}/learning` devolve o mesmo `subject_progress` do filho, com `read_only: true` e a lista completa em `materials`. O progresso do professor que reutiliza o dashboard também recebe o campo. O dashboard escolar (`by_subject` por média entre alunos) não mudou.

Não há migration nesta entrega.

## 2. KPIs globais

Os contadores do dashboard passaram a usar o catálogo deduplicado, o mesmo universo de `subject_progress`:

- `materials_available` é a quantidade de conteúdos distintos.
- `materials_completed` e `activities_completed` são os concluídos nesse universo. Progresso de conteúdo fora do catálogo atual (entitlement revogado) deixa de contar.
- `materials_in_progress` e `time_studied_seconds` seguem o mesmo recorte.
- `overall_percent` continua a média de `percent_complete`, agora sem duplicar o mesmo conteúdo.

`GET /mobile/student/kpis/frequency` e `materials_count` da sessão não mudaram. Frequência ainda conta `status != not_started` e pode incluir o mesmo conteúdo mais de uma vez se ele estiver em dois pacotes.

## 3. Materiais

`content.subject` no catálogo do aluno passou a `{ uuid, name, color, icon }`. Vale para `GET /mobile/student/materials`, para o preview `materials` do dashboard e para a lista do responsável. Filtros `search` e `subject_uuid` permanecem.

Cores e ícones do seed (`ContentCatalogSeeder`):

| Disciplina | color     | icon            |
| ---------- | --------- | --------------- |
| Português  | `#16a34a` | `book-open`     |
| Matemática | `#2563eb` | `layout-grid`   |
| História   | `#b45309` | `landmark`      |
| Geografia  | `#0891b2` | `globe`         |
| Ciências   | `#7c3aed` | `flask-conical` |

Se `color` ou `icon` vierem vazios só na agregação do dashboard, a API devolve `#64748b` e `book-open`. O GET de materiais devolve o valor gravado, sem esse fallback.

## 4. Exemplo

Envelope legado `{ data }`. Trecho novo:

```json
{
    "data": {
        "kpis": {
            "overall_percent": 40,
            "materials_available": 10,
            "materials_completed": 4,
            "materials_in_progress": 2,
            "time_studied_seconds": 900,
            "activities_completed": 4
        },
        "subject_progress": [
            {
                "subject": {
                    "uuid": "uuid-de-portugues",
                    "name": "Português",
                    "color": "#16a34a",
                    "icon": "book-open"
                },
                "materials_total": 5,
                "materials_completed": 4,
                "percent": 80
            },
            {
                "subject": {
                    "uuid": "uuid-de-matematica",
                    "name": "Matemática",
                    "color": "#2563eb",
                    "icon": "layout-grid"
                },
                "materials_total": 5,
                "materials_completed": 0,
                "percent": 0
            }
        ]
    }
}
```

Cinco materiais de Português, quatro com `completed`, dão `percent: 80`. Cinco de Matemática só em `not_started` ou `in_progress` dão `percent: 0`.

## 5. O que o front faz

- Card **Meu progresso**: `data.subject_progress.slice(0, 3)`.
- Barra: largura = `percent`; cor = `subject.color`.
- Texto `4 / 5`: `materials_completed / materials_total`.
- Ícone: mapa lucide pela chave `subject.icon`.
- O BFF de `GET /api/student/dashboard` e de `GET /api/guardian/children/[ref]/learning` precisa repassar `subject_progress` sem remover a chave.
- **Ver detalhes** pode chamar `GET /api/student/materials?subject_uuid=` e usar `content.subject.color` / `content.subject.icon`.

## 6. QA manual

- [ ] Aluno com um pacote: totais por disciplina batem com a contagem manual deduplicada.
- [ ] Mesmo conteúdo em dois pacotes: o total da disciplina não duplica.
- [ ] Material `completed` incrementa `materials_completed`; `in_progress` não.
- [ ] Disciplina só com `not_started`: `percent: 0`, `materials_completed: 0`.
- [ ] Ordenação: maior `percent` primeiro; empate por nome.
- [ ] Dashboard do responsável espelha `subject_progress` do filho.
- [ ] `subject.color` e `subject.icon` presentes no dashboard e no GET materiais.
