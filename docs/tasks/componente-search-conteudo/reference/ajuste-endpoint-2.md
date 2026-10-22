# Busca de materiais do aluno

**Data:** 2026-10-21  
**Repo da API:** `akili-api`  
**Destino:** campo de busca dos conteúdos que o aluno pode acessar  
**Contrato:** [../../../api/22-student-web-portal.md](../../../api/22-student-web-portal.md)

Este arquivo descreve os filtros que a API já aplica. O front passa o termo e a disciplina na query. A lista deixa de ser filtrada no cliente pelo nome do conteúdo ou pela disciplina.

## 1. O que mudou

`GET /api/v1/mobile/student/materials` aceita dois filtros opcionais, combináveis:

- `search` devolve só os materiais cujo **nome do conteúdo** contém o termo, sem distinguir maiúsculas de minúsculas.
- `subject_uuid` devolve só os materiais da disciplina com essa UUID. O valor é o mesmo `content.subject.uuid` de cada item.

O shape de cada item não mudou. Continua sendo pacote, entitlement e `content` (nome, tipo, disciplina, tópico e progresso).

A busca não olha nome de disciplina, tópico, pacote nem professor. `content.subject` segue `{ uuid, name }`, sem `color` e sem `icon`.

## 2. Rotas

| Quem chama | Rota |
| --- | --- |
| Site (BFF) | `GET /api/student/materials?search=&subject_uuid=` |
| API Laravel | `GET /api/v1/mobile/student/materials?search=&subject_uuid=` |

O hook do site é `useStudentMaterialsQuery` em `features/student/hooks/use-student-materials.ts`. O BFF precisa repassar `search` e `subject_uuid` para a API. Sem isso, o parâmetro não chega no Laravel.

Auth continua a do aluno (`Authorization: Bearer` na API; no site, cookie `akili_student_session`).

## 3. Regras de `search`

| Situação | Resultado |
| --- | --- |
| Parâmetro ausente | Lista completa dos materiais do aluno |
| `null`, vazio ou só espaços | Lista completa (a API faz `trim`) |
| Termo preenchido | `contents.name ILIKE '%termo%'` |
| Mais de 255 caracteres | 422 |

`fra` encontra `Fração` e `Frações`. Não encontra um conteúdo chamado `Equações` só porque a disciplina é Matemática. Para isso, use `subject_uuid`.

## 4. Regras de `subject_uuid`

| Situação | Resultado |
| --- | --- |
| Parâmetro ausente, `null` ou vazio | Não filtra disciplina |
| UUID de disciplina ativa | Só conteúdos dessa disciplina |
| UUID inválido | 422, `errors.subject_uuid`: `A disciplina deve ser um UUID válido.` |
| UUID válido de disciplina inexistente ou excluída | 422, `errors.subject_uuid`: `Disciplina não encontrada.` |

Os dois filtros juntos restringem nome **e** disciplina. `search=fra&subject_uuid=<uuid de Matemática>` devolve só conteúdos de Matemática cujo nome contém `fra`.

Dashboard, sessão, KPIs, playback, responsável, professor e plano de estudos não usam esses filtros. O detalhe `GET /api/student/contents/[uuid]` também não lista nem busca.

Não há paginação nova. A resposta continua o array inteiro já filtrado.

## 5. Exemplo de requisição

No site, o hook chama o BFF:

```http
GET /api/student/materials?search=fra&subject_uuid=a1b2c3d4-e5f6-7890-abcd-ef1234567890 HTTP/1.1
Accept: application/json
```

O BFF encaminha para:

```http
GET /api/v1/mobile/student/materials?search=fra&subject_uuid=a1b2c3d4-e5f6-7890-abcd-ef1234567890 HTTP/1.1
Authorization: Bearer <access_token>
Accept: application/json
```

Só a disciplina, sem termo de nome:

```http
GET /api/student/materials?subject_uuid=a1b2c3d4-e5f6-7890-abcd-ef1234567890 HTTP/1.1
Accept: application/json
```

`a1b2c3d4-e5f6-7890-abcd-ef1234567890` é o `content.subject.uuid` da Matemática no exemplo da resposta. O front usa a UUID real da disciplina escolhida.

Termo com espaço ou acento vai na query codificada. `fração equivalente` sai como `search=fra%C3%A7%C3%A3o%20equivalente`.

Sem busca e sem disciplina, omitir os dois parâmetros:

```http
GET /api/student/materials HTTP/1.1
Accept: application/json
```

## 6. Resposta

Envelope legado `{ data }`. `data` é o array de materiais que passaram nos filtros. Lista vazia é `data: []` com 200 — o aluno não tem conteúdo com aquele nome ou naquela disciplina, não é erro.

```json
{
  "data": [
    {
      "package": {
        "uuid": "8f1c2a40-1b2e-4c3d-9a11-0b6e5d4c3a21",
        "name": "Matemática 6º ano",
        "slug": "matematica-6-ano"
      },
      "entitlement_uuid": "c3a91e22-7d44-4b18-8f02-11aa22bb33cc",
      "content": {
        "uuid": "d4e5f6a7-b8c9-4012-8def-1234567890ab",
        "name": "Frações equivalentes",
        "activity_type": "default",
        "subject": {
          "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          "name": "Matemática"
        },
        "topic": {
          "uuid": "b2c3d4e5-f6a7-8901-bcde-f1234567890a",
          "name": "Números racionais"
        }
      },
      "content_version_uuid": "e5f6a7b8-c9d0-4123-9ef0-234567890abc",
      "position": 3,
      "is_required": true,
      "lesson_count": 4,
      "activity_count": 6,
      "progress": {
        "status": "not_started",
        "percent_complete": 0,
        "last_page_index": 0,
        "time_studied_seconds": 0,
        "last_activity_at": null,
        "completed_at": null
      },
      "school": { "uuid": "11111111-2222-4333-8444-555555555555", "name": "Escola Exemplo" },
      "classroom": { "uuid": "66666666-7777-4888-9999-aaaaaaaaaaaa", "name": "6º A" },
      "teacher": { "name": "Prof. Exemplo", "specialty": "Matemática" }
    }
  ]
}
```

`activity_type` é `default` ou `literacy`. `progress.status` é `not_started`, `in_progress` ou `completed`.

## 7. Erros de validação

`search` acima de 255 caracteres, UUID inválido ou disciplina inexistente responde **422**, `Content-Type: application/problem+json`.

Termo longo demais. Não há mensagem customizada nesse campo. O texto de `errors.search` é o padrão do Laravel:

```json
{
  "type": "https://akili.dev/problems/validation-error",
  "title": "Erro de validação",
  "status": 422,
  "detail": "Um ou mais campos são inválidos.",
  "instance": "/api/v1/mobile/student/materials?search=...",
  "errors": {
    "search": ["The search field must not be greater than 255 characters."]
  }
}
```

Disciplina inexistente:

```json
{
  "type": "https://akili.dev/problems/validation-error",
  "title": "Erro de validação",
  "status": 422,
  "detail": "Um ou mais campos são inválidos.",
  "instance": "/api/v1/mobile/student/materials?subject_uuid=a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "errors": {
    "subject_uuid": ["Disciplina não encontrada."]
  }
}
```

O campo de busca não precisa tratar o 422 de `search` se limitar o input a 255 caracteres. O seletor de disciplina deve enviar uma UUID do catálogo; UUID solta ou disciplina excluída cai em `errors.subject_uuid`.

## 8. O que o front faz

- Enviar `search` e `subject_uuid` na query do `useStudentMaterialsQuery`. Confirmar que o BFF repassa os dois nomes de parâmetro.
- Campo de texto vazio: omitir `search` (ou mandar string vazia). Disciplina "todas": omitir `subject_uuid`.
- Não filtrar de novo no cliente por `content.name` nem por `content.subject.uuid`. A API já devolveu só os que casam.
- Tratar `data: []` como estado vazio da busca.
- O detalhe do conteúdo continua em `GET /api/student/contents/[uuid]`. A busca não substitui essa rota.

## 9. Fora deste ajuste

- Busca por tópico ou pacote.
- Paginação da lista de materiais.
- `color` e `icon` em `content.subject` (ver [2026-10-20_base-frontend-cor-e-icone.md](2026-10-20_base-frontend-cor-e-icone.md)).
