# Base front-end — cor e ícone da disciplina

**Data:** 2026-10-20
**Repo da API:** `akili-api`
**Destino:** spec e implementação no **admin** e no **painel do aluno**
**Spec da API:** [../specs/01-cor-e-icone-da-disciplina.md](../specs/01-cor-e-icone-da-disciplina.md)

Este arquivo descreve o contrato que a API já entrega e o que o front precisa fazer com ele. Não é a spec de tela. A spec de cada app deve sair daqui.

## 1. O que o card mostra

O card de curso usa uma cor de destaque e um ícone de traço.

- O círculo usa `color` como fundo e o ícone em branco.
- O fundo claro do card é a mesma `color` com alpha ≈ 0,12. O front calcula esse pastel. A API não envia `surface_color` nem segunda cor.
- O botão **Continuar** permanece o verde do componente. Essa cor não vem do banco.
- A frase cinza do card não entra neste ajuste. Não há campo `description`.

## 2. Contrato já entregue pela API

Dois campos em `subjects`, sempre presentes na resposta do `SubjectResource`:

| Campo   | Formato                          | Regra                                                                                                   |
| ------- | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `color` | `#RRGGBB` em minúsculas          | Obrigatório na criação. Único entre disciplinas não excluídas.                                          |
| `icon`  | chave kebab-case da lucide-react | Obrigatório na criação. Único entre disciplinas não excluídas. A API não aceita chave fora do catálogo. |

Não existe URL, SVG, arquivo nem nome livre de ícone. Não existe endpoint de catálogo. A lista da seção 4 é o contrato.

A API normaliza antes de validar: `trim` + minúsculas. `#16A34A` vira `#16a34a`. `Book-Open` vira `book-open`. O front pode enviar já normalizado.

### Obrigatório e opcional

| Operação                              | `color` e `icon`                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| `POST /api/v1/admin/subjects`         | Obrigatórios, junto com `code` e `name`.                                                   |
| `PATCH /api/v1/admin/subjects/{uuid}` | Opcionais. Campo ausente não altera o valor. Campo presente não pode ser `null` nem vazio. |
| Leitura                               | Sempre vêm preenchidos. A coluna é `NOT NULL`.                                             |

Um formulário de criação que hoje manda só `code` e `name` passa a receber 422.

### Onde `color` e `icon` já aparecem

O ponto único de saída é `SubjectResource`. Quem aninha esse resource já recebe os dois campos, sem shape novo:

| Método   | Rota                                             | Onde                |
| -------- | ------------------------------------------------ | ------------------- |
| `GET`    | `/api/v1/admin/subjects`                         | cada item de `data` |
| `GET`    | `/api/v1/admin/subjects/{uuid}`                  | `data`              |
| `POST`   | `/api/v1/admin/subjects`                         | `data` (201)        |
| `PATCH`  | `/api/v1/admin/subjects/{uuid}`                  | `data`              |
| aninhado | conteúdo, módulo, capítulo flat, habilidade BNCC | objeto `subject`    |

`GET /api/v1/admin/subjects` exige usuário autenticado. Qualquer usuário autenticado pode listar e ver. Criar, editar e excluir continuam restritos a `akili_admin` ou `master`.

Paginação da listagem não mudou: query `search` e `per_page`; `meta` com `current_page`, `last_page`, `per_page`, `total`.

### Onde a disciplina ainda vem só com `uuid` e `name`

Estes payloads **não** trazem `color` nem `icon`. A spec da API deixou esses presenters de fora. O card não deve esperar os campos aqui:

- `GET /api/v1/mobile/student/materials` — `content.subject` é `{ uuid, name }`
- `GET /api/v1/mobile/contents/{uuid}` — playback, mesmo recorte
- kanban, dashboard e sessão de alfabetização

Para pintar o card, o front resolve a disciplina pelo catálogo (`GET /api/v1/admin/subjects`) e junta pela `subject.uuid`.

### Resposta

```json
{
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "code": "MAT",
    "name": "Matemática",
    "color": "#2563eb",
    "icon": "layout-grid",
    "created_at": "2026-06-24T19:00:00+00:00",
    "updated_at": "2026-06-24T19:00:00+00:00"
}
```

### Criar

```json
{
    "code": "ART",
    "name": "Artes",
    "color": "#db2777",
    "icon": "palette"
}
```

### Editar só a cor

```json
{
    "color": "#be185d"
}
```

### Erros de validação

Envelope atual (422, `errors`). Mensagens estáveis:

| Campo   | Situação                                         | Mensagem                                 |
| ------- | ------------------------------------------------ | ---------------------------------------- |
| `color` | ausente ou vazio                                 | Informe a cor da disciplina.             |
| `color` | fora de `#RRGGBB` (`#RGB`, `#RRGGBBAA`, sem `#`) | A cor deve estar no formato #RRGGBB.     |
| `color` | já usada por outra disciplina ativa              | Já existe uma disciplina com esta cor.   |
| `icon`  | ausente ou vazio                                 | Selecione o ícone da disciplina.         |
| `icon`  | fora do catálogo                                 | Selecione um ícone válido.               |
| `icon`  | já usado por outra disciplina ativa              | Já existe uma disciplina com este ícone. |

Editar uma disciplina mantendo a própria cor ou o próprio ícone é válido. Disciplina excluída (soft delete) libera a cor e o ícone.

## 3. Peça compartilhada entre admin e aluno

Os dois apps usam a mesma lucide-react do shadcn. A spec deve prever um mapa único, com as mesmas chaves da API:

```ts
const subjectIcons: Record<string, LucideIcon> = {
    "book-open": BookOpen,
    // ...as 26 chaves da seção 4
};
```

Regras de render, iguais nos dois apps:

- Ícone desconhecido ou ausente no mapa cai em `book-open`. A API não devolve chave fora do catálogo; o fallback cobre dado antigo ou resposta inesperada.
- Cor ausente ou inválida no cliente cai em `#64748b` (o default da migration).
- Círculo: fundo `color`, ícone branco, traço (não preenchido).
- Superfície do card: `color` com alpha ≈ 0,12.
- Não calcular pastel no servidor e não persistir a cor clara.

## 4. Catálogo de ícones

Chaves estáveis. O seletor do admin lista exatamente estas. O aluno só renderiza a chave que veio da API.

`book-open`, `book`, `library`, `languages`, `pen-line`, `layout-grid`, `calculator`, `sigma`, `flask-conical`, `microscope`, `atom`, `leaf`, `test-tube`, `landmark`, `globe`, `map`, `brain`, `users`, `scale`, `music`, `palette`, `dumbbell`, `clipboard-list`, `graduation-cap`, `puzzle`, `lightbulb`.

### Catálogo já semeado

| code  | name       | color     | icon             |
| ----- | ---------- | --------- | ---------------- |
| `POR` | Português  | `#16a34a` | `book-open`      |
| `MAT` | Matemática | `#2563eb` | `layout-grid`    |
| `CIE` | Ciências   | `#7c3aed` | `flask-conical`  |
| `HIS` | História   | `#b45309` | `landmark`       |
| `GEO` | Geografia  | `#0891b2` | `globe`          |
| `FIS` | Física     | `#4f46e5` | `atom`           |
| `BIO` | Biologia   | `#059669` | `leaf`           |
| `QUI` | Química    | `#db2777` | `test-tube`      |
| `ING` | Inglês     | `#0284c7` | `languages`      |
| `FIL` | Filosofia  | `#6d28d9` | `brain`          |
| `SOC` | Sociologia | `#c026d3` | `users`          |
| `SAE` | SAEB       | `#64748b` | `clipboard-list` |

Disciplina fora dessa tabela permanece `#64748b` / `book-open` até alguém editar no admin. Duas disciplinas ativas não podem compartilhar cor nem ícone.

## 5. Admin

Telas de disciplina (criar, editar, detalhe, listagem).

- **Criar:** `color` e `icon` obrigatórios no formulário. Cor em seletor que grave `#RRGGBB`. Ícone em lista fechada das 26 chaves, com o desenho da lucide ao lado do nome. Não aceitar texto livre.
- **Editar:** pré-preencher com o valor atual. Salvar sem mexer na cor ou no ícone pode omitir os campos no `PATCH`. Trocar um deles envia só o que mudou, ou o formulário inteiro; os dois jeitos são válidos.
- **Listagem e detalhe:** mostrar a cor e o ícone. A listagem já devolve os campos em cada item; não fazer um `GET` por linha para isso.
- **Erros:** mapear `errors.color` e `errors.icon` para os campos. Unicidade é erro de formulário, não toast genérico.
- Conteúdo, módulo e BNCC que já exibem a disciplina aninhada passam a ter `subject.color` e `subject.icon` quando o resource da API é o `SubjectResource`. Usar o mesmo componente visual.

## 6. Painel do aluno

Card **Meus cursos**.

- A lista de materiais (`GET /api/v1/mobile/student/materials`, no site via BFF `GET /api/student/materials`) traz o nome da disciplina, sem cor e sem ícone.
- A spec do aluno deve buscar o catálogo `GET /api/v1/admin/subjects` (qualquer sessão autenticada) e juntar `content.subject.uuid` com `uuid` do catálogo.
- Com o par resolvido, pintar círculo, ícone branco e fundo pastel como na seção 3.
- O botão **Continuar** não usa `color`.
- Playback, kanban e dashboard continuam sem esses campos. Se alguma dessas telas repetir o mesmo selo visual, reutiliza o mapa do catálogo. Não assumir que o payload dessas rotas vai crescer.

## 7. Fora deste ajuste

- Cor secundária, upload de SVG, URL de ícone e frase cinza do card.
- Endpoint novo de listagem de ícones.
- Incluir `color` e `icon` nos presenters de materiais, playback, kanban, dashboard e alfabetização.
- Testes automatizados na API. A validação visual fica com QA.

## 8. Checklist para a spec de tela

- [ ] Mapa `Record<string, LucideIcon>` com as 26 chaves, compartilhado ou duplicado de forma idêntica no admin e no aluno.
- [ ] Função de pastel: mesma `color`, alpha ≈ 0,12.
- [ ] Admin: criar exige cor e ícone; editar preserva o valor omitido; erros 422 caem no campo.
- [ ] Admin: seletor só oferece chaves do catálogo; cor sai como `#RRGGBB`.
- [ ] Aluno: card junta materiais + catálogo pela `uuid` da disciplina.
- [ ] Aluno: ícone desconhecido cai em `book-open`; cor inválida cai em `#64748b`.
- [ ] Botão **Continuar** permanece verde do componente.
