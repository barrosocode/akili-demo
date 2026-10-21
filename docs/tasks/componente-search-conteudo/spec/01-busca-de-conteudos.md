# Spec 01 — Busca de conteúdos

**Repo:** `akili-site`
**Contrato da API:** [ajuste-endpoint.md](../reference/ajuste-endpoint.md)
**Entrega:** campo de busca que consulta os materiais do aluno no servidor, com o BFF e o hook preparados para o parâmetro `search`, ligado na página de materiais do aluno.

O desenho de referência é o input do tema Kiddino, o mesmo do campo **E-mail ou Usuário** do login (`.form-style3 input` em `public/assets/css/style.css`): altura 55px, borda `1px solid rgba(153, 153, 153, 0.5)`, texto 16px, foco com `border-color: var(--theme-color)` e sem sombra extra. Duas diferenças em relação a esse campo: o raio da borda é maior, e há um botão de lupa dentro do campo, à direita.

---

## Decisões fechadas

- A busca filtra só o nome do conteúdo. O termo vai em `search` na query. A lista não é filtrada de novo no cliente por `content.name`.
- O pedido espera 300ms sem nova digitação (debounce).
- O filtro sai quando o termo, depois do `trim`, tem 2 caracteres ou mais. Com 0 ou 1 caractere o pedido é a lista completa, sem o parâmetro `search`.
- O input aceita no máximo 255 caracteres. Com esse teto o campo não trata o 422 da API.
- Clique na lupa e tecla Enter aplicam na hora a mesma regra de 2 caracteres, sem esperar os 300ms.
- Enquanto o debounce não assenta, a lista permanece no último resultado já recebido.
- Visual Kiddino (Bootstrap + `style.css`). Sem Tailwind e sem `components/ui`.
- `uuid`, slug, entitlement e demais identificadores não aparecem no campo nem na lista.

---

## 1. Contrato que o componente usa

`GET /api/v1/mobile/student/materials` já aceita `search` opcional e devolve os materiais cujo nome do conteúdo contém o termo, sem distinguir maiúsculas de minúsculas. O shape de cada item não muda.

| Quem chama    | Rota                                    |
| ------------- | --------------------------------------- |
| Browser       | `GET /api/student/materials?search=`    |
| BFF → Laravel | `GET /mobile/student/materials?search=` |

| Termo após `trim`             | Pedido                                                   |
| ----------------------------- | -------------------------------------------------------- |
| Ausente, vazio ou 1 caractere | `GET /api/student/materials`                             |
| 2 a 255 caracteres            | `GET /api/student/materials?search=` com o termo trimado |

`fra` encontra `Fração` e `Frações`. A API não olha disciplina, tópico, pacote nem professor. Lista vazia é `{ data: [] }` com 200.

O detalhe do conteúdo continua em `GET /api/student/contents/[uuid]`.

---

## 2. O que entra nesta entrega

| Peça                                                     | Papel                                                                                               |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `app/api/student/materials/route.ts`                     | Lê `search` da query e repassa ao Laravel. Hoje a rota chama `/mobile/student/materials` sem query. |
| `features/student/hooks/use-student-materials.ts`        | `useStudentMaterialsQuery` passa a aceitar o termo e a colocá-lo na query key.                      |
| `features/student/components/student-content-search.tsx` | Campo, debounce e a chamada do hook.                                                                |
| `features/student/components/student-materials-list.tsx` | Recebe loading, erro e a frase de lista vazia quando os dados vêm da busca.                         |
| `app/(aluno)/aluno/(estudante)/materiais/page.tsx`       | Campo acima da lista. A busca é a dona do pedido nessa página.                                      |
| `styles/marketing-overrides.css`                         | Estilo sob `.marketing-root .akili-content-search`.                                                 |

Fora desta entrega:

- Busca na supervisão do responsável (`StudentMaterialsList` com `materials` vindos do dashboard do guardian). Essa lista não usa este filtro.
- Busca por disciplina, tópico ou pacote.
- Paginação.
- `color` e `icon` em `content.subject`.
- Redesenho dos cards de material.

---

## 3. BFF e hook

O Route Handler lê `search` de `request.nextUrl.searchParams`.

- Depois do `trim`, string vazia: chamar `/mobile/student/materials` sem query.
- Termo preenchido: `/mobile/student/materials?search=` via `URLSearchParams`, para espaço e acento saírem codificados (`fração equivalente` → `search=fra%C3%A7%C3%A3o%20equivalente`).
- Repassar o valor trimado. O nome do parâmetro na API é `search`.

O hook mantém o primeiro argumento booleano `enabled`, para a chamada atual `useStudentMaterialsQuery(!materialsProp && !readOnly)` continuar válida. O termo entra no segundo argumento:

```ts
useStudentMaterialsQuery(enabled?: boolean, search?: string)
```

- `search` ausente, vazio ou com menos de 2 caracteres após o `trim`: `GET /api/student/materials` e query key `["student", "materials", ""]`.
- Termo com 2 ou mais caracteres: `GET /api/student/materials?search=` com `encodeURIComponent` do termo trimado e query key `["student", "materials", termoTrimado]`.
- `placeholderData` mantém o array anterior enquanto a query do termo novo está em curso.

Quem já chama o hook sem o segundo argumento continua recebendo a lista completa.

---

## 4. Campo

`StudentContentSearch` é client component. Ele é o dono do estado do input e de `useStudentMaterialsQuery`.

```ts
type StudentContentSearchState = {
    materials: StudentMaterial[];
    isLoading: boolean;
    isFetching: boolean;
    error: unknown;
    isSearchActive: boolean;
};

type StudentContentSearchProps = {
    children: (state: StudentContentSearchState) => React.ReactNode;
};
```

- `isSearchActive` é verdadeiro quando o termo já enviado, após o `trim`, tem 2 ou mais caracteres.
- O valor visível acompanha a digitação na hora. O pedido usa o valor estável, 300ms depois da última alteração.
- `trim` vale para contar caracteres e para montar a query. O espaço digitado permanece no input.
- `maxLength={255}`.
- Abaixo de 2 caracteres, `isSearchActive` fica falso e o hook pede a lista completa.
- Lupa e Enter leem o valor atual, cancelam a espera dos 300ms e aplicam a mesma regra.
- Lupa e Enter com menos de 2 caracteres não disparam filtro. A lista completa permanece.
- Durante a espera, `children` segue recebendo o último `materials` assentado. `isFetching` indica o pedido em curso.

---

## 5. Aparência

Classes novas em `styles/marketing-overrides.css`, escopo `.marketing-root .akili-content-search`. O campo reutiliza a métrica do input do tema e não copia a busca da Central de Ajuda (ícone à esquerda, cápsula de `border-radius: 999px`).

| Token            | Valor                                                                    |
| ---------------- | ------------------------------------------------------------------------ |
| Altura           | 55px                                                                     |
| Borda            | `1px solid rgba(153, 153, 153, 0.5)`                                     |
| Fundo            | `var(--body-bg)`                                                         |
| Texto            | 16px, `var(--body-color)`                                                |
| Placeholder      | mesma cor dos inputs do tema                                             |
| Foco             | `border-color: var(--theme-color)`, `box-shadow: none`, `outline: 0`     |
| Raio             | **24px** (o input de `.form-style3` usa 10px; o `input` global usa 16px) |
| Padding do texto | 20px à esquerda; à direita, folga para o botão (48px)                    |
| Largura          | 100%                                                                     |

Rótulo visível acima do campo, no mesmo peso do `label` de `.form-style3`: **Buscar conteúdos**. O `label` aponta para o `input` (`htmlFor`).

Placeholder: `Nome do conteúdo`.

Botão da lupa:

- Dentro do campo, encostado à direita, centralizado na vertical, com cerca de 6px de respiro da borda para não vazar o canto arredondado.
- `type="button"`. Fundo transparente, sem borda própria, ícone `fas fa-search` na cor `var(--body-color)`.
- Área de toque de pelo menos 44×44px.
- Nome acessível: `Buscar conteúdos`. O ícone é `aria-hidden`.
- Foco visível: anel `var(--theme-color)`, sem deslocar o campo.

O input é `type="search"`, `autoComplete="off"`, `enterKeyHint="search"`. Mobile primeiro: o campo ocupa a largura do conteúdo, numa linha só. Em tela estreita o botão continua dentro do campo.

---

## 6. Página de materiais do aluno

`app/(aluno)/aluno/(estudante)/materiais/page.tsx` renderiza o campo e, no `children`, a lista que já existe.

- O título **Materiais** e a frase **Conteúdos liberados para o seu estudo.** permanecem acima do campo.
- `StudentMaterialsList` nessa página recebe `materials` da busca e não chama `useStudentMaterialsQuery` de novo.
- Props novas na lista, usadas quando os dados vêm de fora: `isLoading`, `error` e `emptyMessage`.
- `isLoading` verdadeiro na primeira carga: o texto atual `Carregando materiais...`. Uma busca seguinte não troca a lista por esse texto; os cards do resultado anterior ficam na tela até o próximo array chegar.
- Erro: o mesmo bloco vermelho que a lista já mostra (`BffClientError` ou `getUserFacingApiMessage`).
- Lista vazia com `isSearchActive` falso: `Nenhum material liberado para este aluno no momento.`
- Lista vazia com `isSearchActive` verdadeiro: `Nenhum conteúdo encontrado com esse nome.`
- Supervisão continua passando `materials`, `readOnly` e `childRef`. Sem campo de busca e sem essas props novas.

Os cards, o progresso, a frequência e os links **Estudar** / **Continuar** permanecem como estão. O card mostra nome do conteúdo, pacote, disciplina, escola e turma. Identificadores técnicos ficam fora da tela.

---

## 7. Critério de aceite

- Campo com rótulo **Buscar conteúdos**, altura 55px, borda do input do tema e raio 24px.
- A lupa é um botão dentro do campo, à direita, com área de toque de pelo menos 44×44px e nome acessível **Buscar conteúdos**.
- Digitar `f` e esperar 300ms pede `GET /api/student/materials` sem `search`. A lista completa continua na tela.
- Digitar `fr` pede, após 300ms, `GET /api/student/materials?search=fr`. O BFF encaminha `search=fr` para `/mobile/student/materials`.
- `fração` sai codificado na query. O espaço no meio do termo também.
- Apagar até sobrar uma letra volta, após 300ms, à lista completa.
- Clicar na lupa ou pressionar Enter com 2 ou mais caracteres dispara o pedido na hora.
- Durante os 300ms a lista não pisca para vazio nem para “Carregando materiais...”.
- Resposta `data: []` com busca ativa mostra **Nenhum conteúdo encontrado com esse nome.**
- Aluno sem materiais e campo vazio mostra **Nenhum material liberado para este aluno no momento.**
- O input não passa de 255 caracteres.
- A lista renderizada é a do servidor. O cliente não filtra `content.name` de novo.
- A página de supervisão não exibe o campo.
- A tela não mostra `uuid`, slug nem entitlement.
- Teste do hook ou do Route Handler: termo com 2 caracteres monta `search`; termo com 1 caractere omite o parâmetro. Sem teste de browser obrigatório além de abrir `/aluno/materiais`, digitar um termo de 2 caracteres e ver a lista acompanhar a resposta.
