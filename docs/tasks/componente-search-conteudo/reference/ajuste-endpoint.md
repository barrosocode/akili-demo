# Busca de materiais do aluno

**Data:** 2026-10-21
**Repo da API:** `akili-api`
**Destino:** campo de busca dos conteúdos que o aluno pode acessar
**Contrato:** [../../../api/22-student-web-portal.md](../../../api/22-student-web-portal.md)

Este arquivo descreve o filtro que a API já aplica. O front passa o termo na query. A lista deixa de ser filtrada no cliente pelo nome do conteúdo.

## 1. O que mudou

`GET /api/v1/mobile/student/materials` aceita `search` opcional e devolve só os materiais cujo **nome do conteúdo** contém o termo, sem distinguir maiúsculas de minúsculas.

O shape de cada item não mudou. Continua sendo pacote, entitlement e `content` (nome, tipo, disciplina, tópico e progresso).

A busca não olha nome de disciplina, tópico, pacote nem professor. `content.subject` segue `{ uuid, name }`, sem `color` e sem `icon`.

## 2. Rotas

| Quem chama  | Rota                                           |
| ----------- | ---------------------------------------------- |
| Site (BFF)  | `GET /api/student/materials?search=`           |
| API Laravel | `GET /api/v1/mobile/student/materials?search=` |

O hook do site é `useStudentMaterialsQuery` em `features/student/hooks/use-student-materials.ts`. O BFF precisa repassar a query `search` para a API. Sem isso, o parâmetro não chega no Laravel.

Auth continua a do aluno (`Authorization: Bearer` na API; no site, cookie `akili_student_session`).

## 3. Regras de `search`

| Situação                    | Resultado                             |
| --------------------------- | ------------------------------------- |
| Parâmetro ausente           | Lista completa dos materiais do aluno |
| `null`, vazio ou só espaços | Lista completa (a API faz `trim`)     |
| Termo preenchido            | `contents.name ILIKE '%termo%'`       |
| Mais de 255 caracteres      | 422                                   |

`fra` encontra `Fração` e `Frações`. Não encontra um conteúdo chamado `Equações` só porque a disciplina é Matemática.

Dashboard, sessão, KPIs, playback, responsável, professor e plano de estudos não usam esse filtro. O detalhe `GET /api/student/contents/[uuid]` também não lista nem busca.

Não há paginação nova. A resposta continua o array inteiro já filtrado.

## 4. Exemplo de requisição

No site, o hook chama o BFF:

```http
GET /api/student/materials?search=fra HTTP/1.1
Accept: application/json
```

O BFF encaminha para:

```http
GET /api/v1/mobile/student/materials?search=fra HTTP/1.1
Authorization: Bearer <access_token>
Accept: application/json
```

Termo com espaço ou acento vai na query codificada. `fração equivalente` sai como `search=fra%C3%A7%C3%A3o%20equivalente`.

Sem busca, omitir o parâmetro:

```http
GET /api/student/materials HTTP/1.1
Accept: application/json
```

## 5. Resposta

Envelope legado `{ data }`. `data` é o array de materiais que passaram no filtro. Lista vazia é `data: []` com 200 — o aluno não tem conteúdo com aquele nome, não é erro.

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
            "school": {"uuid": "11111111-2222-4333-8444-555555555555", "name": "Escola Exemplo"},
            "classroom": {"uuid": "66666666-7777-4888-9999-aaaaaaaaaaaa", "name": "6º A"},
            "teacher": {"name": "Prof. Exemplo", "specialty": "Matemática"}
        }
    ]
}
```

`activity_type` é `default` ou `literacy`. `progress.status` é `not_started`, `in_progress` ou `completed`.

## 6. Termo longo demais

`search` acima de 255 caracteres responde **422**, `Content-Type: application/problem+json`:

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

Não há mensagem customizada nesse campo. O texto de `errors.search` é o padrão do Laravel. O campo de busca do aluno não precisa tratar esse 422 se limitar o input a 255 caracteres.

## 7. O que o front faz

- Enviar `search` na query do `useStudentMaterialsQuery`. Confirmar que o BFF repassa o mesmo nome de parâmetro.
- Campo vazio: omitir `search` (ou mandar string vazia). Os dois devolvem a lista completa.
- Não filtrar de novo no cliente por `content.name`. A API já devolveu só os que casam.
- Tratar `data: []` como estado vazio da busca.
- O detalhe do conteúdo continua em `GET /api/student/contents/[uuid]`. A busca não substitui essa rota.

## 8. Fora deste ajuste

- Busca por disciplina, tópico ou pacote.
- Paginação da lista de materiais.
- `color` e `icon` em `content.subject` (ver [2026-10-20_base-frontend-cor-e-icone.md](2026-10-20_base-frontend-cor-e-icone.md)).
