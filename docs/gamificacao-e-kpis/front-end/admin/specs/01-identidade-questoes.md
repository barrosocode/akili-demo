# Spec 01 — Identidade estável de questão e alternativa (admin)

**Repo:** `akili-admin`  
**Depende de:** API já grava/devolve `questions[].uuid` e `options[].uuid` (backfill rodado no ambiente da API).  
**Desbloqueia:** round-trip do Content Studio; o player do site chaveia por esses UUIDs.

Não criar tabela `questions`. Continua JSONB. Não alterar o backend nesta pasta.

---

## Decisões fechadas

- `QuestionFormItem.id` / `OptionFormItem.id` **são** o uuid persistido. Não gerar UUID novo a cada keystroke nem a cada load se a API já trouxe um.
- Na criação: se o form ainda não tem uuid, `createId()` uma vez; o save envia; o backend aceita ou gera.
- Na edição: se `question.uuid` / `option.uuid` existirem no GET, reutilizar.
- Import: se o JSON colado tiver `uuid` válido, preservar; senão gerar uma vez no map e enviar no save.
- Sem testes automatizados.

---

## 1. Tipos

Arquivo: `src/types/content-studio.ts`

Hoje `ContentQuestion` e `ContentOption` **não** têm `uuid`.

Acrescentar:

```ts
export interface ContentOption {
  uuid?: string;
  text: string;
  is_correct: boolean;
  action?: string | null;
}

export interface ContentQuestion {
  uuid?: string;
  text: string;
  // ...campos atuais
  options: ContentOption[];
}
```

`uuid` opcional na leitura de dumps antigos ainda sem backfill; obrigatório no payload de save depois do map (o form sempre tem `id`).

---

## 2. Form utils

Arquivo: `src/components/content/content-form-utils.ts`

`QuestionFormItem` / `OptionFormItem` já têm `id: string`. Manter. A regra muda no map e no payload.

### `mapQuestionToForm`

Hoje:

```ts
id: createId(),
options: question.options.map((option) => ({ id: createId(), ... }))
```

Novo:

- `id: question.uuid` se string UUID válida; senão `createId()`.
- Idem `option.uuid` em cada alternativa.

Não ler outro campo inventado. Não regenerar porque o enunciado mudou.

### `buildVersionPayloadFromState`

Hoje o map de `questions` **omite** `uuid`. Enviar:

```ts
{
  uuid: question.id,
  text: question.text,
  // ...
  options: question.options.map((option) => ({
    uuid: option.id,
    text: option.text.trim(),
    is_correct: option.is_correct,
    action: option.action || null,
  })),
}
```

### Novas questões no form

`createEmptyQuestion` / `createEmptyOption` (ou equivalentes) já devem chamar `createId()` **uma vez**. Não chamar de novo no render.

---

## 3. Import

Arquivos:

- `src/lib/content/import-content-utils.ts`
- `src/components/content/ContentImportModal.tsx`

`mapImportQuestion` (ou o map que o modal usa):

- Se `question.uuid` for UUID válido → `id` do form = esse valor.
- Senão → `createId()` uma vez.
- Idem `options[].uuid`.

O schema de importação da API aceita `uuid` opcional (`questions_import_plan1`). Não quebrar JSON sem o campo.

---

## 4. Critério de aceite

- Abrir conteúdo publicado (já com uuid no GET) → salvar sem mudar questões → Network mostra os **mesmos** `questions[].uuid` e `options[].uuid`.
- Editar só o enunciado → uuid da questão inalterado.
- Adicionar questão nova → um uuid gerado no form, enviado no POST/PATCH.
- Importar JSON com uuid → o form e o save preservam.
- Importar JSON sem uuid → o form gera e o save envia.
- Sem testes automatizados.

## 5. Relatório

`front-end/admin/reports/YYYY-MM-DD_spec-01.md` (se o workspace for `akili-api`) **ou** `docs/tasks/gameficacao-e-kpis/reports/YYYY-MM-DD_spec-01.md` no repo `akili-admin`. Listar arquivos e um exemplo de payload de save.
