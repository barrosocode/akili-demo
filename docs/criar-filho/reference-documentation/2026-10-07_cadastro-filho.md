# Cadastro do filho após a compra PIX

**Data:** 2026-10-07  
**Base local:** `http://localhost:8000`  
**Escopo:** portal do responsável, depois do primeiro acesso. Cada compra paga aceita um aluno novo. Três compras permitem três filhos, um em cada compra.

A API não pede escola, série nem matrícula. O aluno fica no lar familiar criado no pagamento. O front não envia `school_id`.

O papel `guardian` precisa da permissão `guardian.children.create`. Em um banco que já existia antes desta entrega:

```bash
docker compose -f docker/compose/docker-compose.yml exec app php artisan db:seed --class=RolesAndPermissionsSeeder
```

## Cabeçalhos

```http
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

O token é o do responsável que concluiu o primeiro acesso. A origem do portal precisa estar em `CORS_ALLOWED_ORIGINS`.

## Fluxo da tela

1. `GET /api/v1/guardian/purchases`.
2. Mostrar um card por compra. Onde `can_add_child` é `true`, abrir o formulário do filho.
3. `POST /api/v1/guardian/purchases/{uuid}/student` com o `uuid` daquela compra.
4. Com `201`, tirar o formulário daquele card e mostrar o filho. A lista `GET /api/v1/guardian/students` passa a incluir o vínculo.

## Listar compras

`GET /api/v1/guardian/purchases?page=1&page_size=15`

`page` começa em 1. `page_size` vai de 1 a 100. O padrão é 15.

Sucesso `200`. A coleção fica na chave `purchases`:

```json
{
  "status": 200,
  "message": "Compras consultadas com sucesso.",
  "errors": {},
  "purchases": [
    {
      "uuid": "07ee7bcf-bca4-4a14-bf89-d2be6484f044",
      "status": "paid",
      "amount_cents": 500,
      "currency": "BRL",
      "paid_at": "2026-10-07T18:45:00-03:00",
      "fulfilled_at": "2026-10-07T18:45:05-03:00",
      "can_add_child": true,
      "package": {
        "uuid": "3869c042-2123-4feb-955e-e5d6381bc5b3",
        "name": "teste pacote"
      },
      "student": null
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 15,
    "total_items": 1,
    "total_pages": 1
  },
  "error_code": null
}
```

`can_add_child` é `true` só quando a compra está `paid`, o cadastro do responsável já foi concluído (`fulfilled_at`) e ainda não há filho. Compra `pending`, `expired`, `failed` ou `refunded` fica com `can_add_child` `false`.

Quando o filho já existe, `student` traz `uuid` e `name`. Não chame o POST de novo para essa compra.

`amount_cents` é inteiro. `500` é R$ 5,00.

## Cadastrar o filho

`POST /api/v1/guardian/purchases/{uuid}/student`

O `{uuid}` é o `purchases[].uuid`, não o UUID do pacote.

```json
{
  "name": "Ana Silva",
  "preferred_name": "Ana",
  "birthdate": "2018-04-12",
  "cpf": "39053344705",
  "relationship": "mother"
}
```

| Campo | Regra |
|-------|--------|
| `name` | Obrigatório, até 255 caracteres |
| `preferred_name` | Opcional, até 255 caracteres |
| `birthdate` | Obrigatório, data anterior a hoje (`YYYY-MM-DD`) |
| `cpf` | Opcional. Máscara é aceita e reduzida a 11 dígitos. CPF válido e único no lar |
| `relationship` | Opcional. `mother`, `father`, `guardian` ou `other`. O padrão é `guardian` |

Sucesso `201`. O recurso fica na chave `student`. O CPF não volta:

```json
{
  "status": 201,
  "message": "Filho cadastrado com sucesso.",
  "errors": {},
  "student": {
    "uuid": "…",
    "name": "Ana Silva",
    "preferred_name": "Ana",
    "birthdate": "2018-04-12",
    "relationship": "mother",
    "purchase": {
      "uuid": "07ee7bcf-bca4-4a14-bf89-d2be6484f044",
      "package": {
        "uuid": "3869c042-2123-4feb-955e-e5d6381bc5b3",
        "name": "teste pacote"
      }
    },
    "entitlement": {
      "uuid": "…",
      "source_type": "guardian_purchase",
      "status": "active"
    }
  },
  "pagination": null,
  "error_code": null
}
```

O entitlement libera o pacote daquela compra para este aluno. Não é criada conta de login do filho.

## Erros

Falha sai em `application/problem+json`. Validação traz `errors` por campo.

| HTTP | Quando | O que o front faz |
|------|--------|-------------------|
| 401 | Sem Bearer ou token inválido | Voltar ao login |
| 403 | Token sem `guardian.children.create` | Esconder o formulário |
| 404 | UUID de compra inexistente ou de outro responsável | Encerrar o formulário |
| 422 | Campo inválido, compra sem pagamento, ou vaga já usada | Mostrar `errors[campo][0]` |

Mensagens de vaga e de compra:

| Campo | Mensagem |
|-------|----------|
| `purchase` | Esta compra já tem um filho vinculado. |
| `purchase` | Só é possível adicionar um filho a uma compra paga. |
| `purchase` | A compra ainda não concluiu o cadastro do responsável. |
| `name` | Informe o nome do filho. |
| `birthdate` | Informe a data de nascimento. / A data de nascimento deve ser anterior a hoje. |
| `cpf` | O CPF informado é inválido. / Este CPF já está cadastrado. |
| `relationship` | O parentesco informado é inválido. |

## O que não fazer

- Não enviar `school_id`, série, matrícula nem `package_uuid` neste POST.
- Não reutilizar o filho de uma compra em outra. Cada plano ganha um cadastro novo.
- Não guardar o CPF em `localStorage`.
