# Spec 01 — Tela de materiais do aluno

**Repo:** `akili-site`  
**Contrato da API:** [ajuste-endpoint-2.md](../../componente-search-conteudo/reference/ajuste-endpoint-2.md)  
**Lista de disciplinas:** [01-lista-de-disciplinas.md](../../componente-disciplina-listagem/specs/01-lista-de-disciplinas.md)  
**Campo de busca:** [01-busca-de-conteudos.md](../../componente-search-conteudo/spec/01-busca-de-conteudos.md)  
**Entrega:** `/aluno/materiais` passa a listar disciplinas. O clique na linha abre `/aluno/materiais/disciplina/[subjectUuid]`, com o buscador e os conteúdos daquela disciplina.

O player continua em `/aluno/materiais/[contentUuid]`. O segmento estático `disciplina` separa as duas rotas.

---

## Decisões fechadas

- Índice em `/aluno/materiais`. Página da disciplina em `/aluno/materiais/disciplina/[subjectUuid]`.
- `subjectUuid` é a UUID de `content.subject`. Ela vai na URL e em `subject_uuid`. A tela mostra o nome.
- A linha inteira da disciplina é o link. Sem botão à direita nesta página.
- A lista de conteúdos usa textos genéricos: carregando **Carregando conteúdos...**; vazio **Nenhum material encontrado.**
- O vazio é o mesmo com busca ativa, busca vazia ou disciplina sem conteúdo. `data: []` com 200 usa essa frase.
- Filtro no servidor. O cliente não filtra de novo por `content.name` nem por `content.subject.uuid`.
- Na página da disciplina, `subject_uuid` vai em todo pedido. `search` só entra com termo trimado de 2 a 255 caracteres, como na spec da busca.
- A lista de disciplinas continua o cruzamento materiais × catálogo. Sem endpoint novo na API.
- Supervisão do responsável permanece a lista plana, sem buscador e sem página de disciplina.
- Visual Kiddino. Sem Tailwind e sem `components/ui`.

---

## 1. Rotas

| Tela | Caminho | O que mostra |
| --- | --- | --- |
| Índice | `/aluno/materiais` | Disciplinas que o aluno tem em algum material |
| Disciplina | `/aluno/materiais/disciplina/[subjectUuid]` | Busca e conteúdos dessa disciplina |
| Player | `/aluno/materiais/[contentUuid]` | Aula, como hoje |

`/aluno/materiais/disciplina/[subjectUuid]` tem dois segmentos depois de `materiais`. `isImmersiveLessonPath` só trata um segmento (`/aluno/materiais/[contentUuid]`). A página da disciplina fica no shell do aluno, com o item **Materiais** ativo. O regex do player não muda.

O card de conteúdo continua apontando para `/aluno/materiais/{contentUuid}`. O voltar do player continua `/aluno/materiais`.

---

## 2. O que entra nesta entrega

| Peça | Papel |
| --- | --- |
| `app/(aluno)/aluno/(estudante)/materiais/page.tsx` | Shell do índice. Sem lista de conteúdos e sem buscador. |
| `app/(aluno)/aluno/(estudante)/materiais/disciplina/[subjectUuid]/page.tsx` | Shell da disciplina. Lê `subjectUuid` e repassa ao client. |
| `features/student/components/student-materials-subjects.tsx` | Índice: materiais, catálogo, `resolveStudentSubjects`, `SubjectList`. |
| `features/student/components/student-subject-materials.tsx` | Disciplina: volta, nome, buscador e lista. |
| `features/subjects/components/subject-list.tsx` | Linha inteira vira link quando a página passa o destino. |
| `app/api/student/subjects/route.ts` | Catálogo do aluno, com `color` e `icon`. |
| `app/api/student/materials/route.ts` | Repassa `search` e `subject_uuid`. |
| `features/student/lib/student-materials-search.ts` | Monta a query dos dois parâmetros. |
| `features/student/hooks/use-student-materials.ts` | Query key e pedido com os dois filtros. |
| `features/student/components/student-content-search.tsx` | Aceita `subjectUuid` e o envia em todo pedido. |
| `features/student/components/student-materials-list.tsx` | Textos genéricos. Sem frase de frequência quando os dados vêm de fora. |
| `styles/marketing-overrides.css` | O link da linha ocupa a linha. |

Fora desta entrega:

- Supervisão (`/aluno/supervisao/.../materiais`).
- Player, kanban e dashboard.
- Paginação de materiais.
- `color` e `icon` dentro de `content.subject`.
- Endpoint novo de disciplinas do aluno.

---

## 3. Índice

`StudentMaterialsSubjects` é client component. A página server só o renderiza.

Cabeçalho que já existe, acima da lista:

- Título **Materiais**.
- Frase **Conteúdos liberados para o seu estudo.**

`SubjectList` usa o título padrão **Minhas disciplinas**.

Dados, em paralelo:

1. `useStudentMaterialsQuery(true)` — `GET /api/student/materials`, sem `search` e sem `subject_uuid`. Serve só para saber quais disciplinas o aluno tem. Os cards não são desenhados.
2. Catálogo em `GET /api/student/subjects`.

`resolveStudentSubjects(materials, catalog)` faz a interseção. Disciplina do material que não está no catálogo não ganha linha.

Estados, antes da lista:

| Situação | Tela |
| --- | --- |
| Primeira carga de materiais ou do catálogo | **Carregando conteúdos...** |
| Erro de um dos dois pedidos | O bloco vermelho que a lista de conteúdos já usa |
| Os dois pedidos ok | `SubjectList` com o resultado do cruzamento |

Lista vazia fica com o texto do componente: **Nenhuma disciplina disponível.**

Cada linha aponta para `/aluno/materiais/disciplina/${subject.uuid}`. A UUID não aparece como texto.

---

## 4. Linha clicável

`SubjectList` ganha destino opcional:

```ts
type SubjectListProps = {
  subjects: SubjectListItem[];
  title?: string;
  renderAction?: (subject: SubjectListItem) => React.ReactNode;
  hrefFor?: (subject: SubjectListItem) => string;
};
```

- Com `hrefFor`, a linha é um `Link` do Next. O link é o retângulo inteiro: círculo, nome e fundo pastel. Não há segundo controle na linha, e `renderAction` não é desenhado.
- O nome acessível do link é o nome da disciplina. O ícone continua `aria-hidden`.
- Área de toque: a linha já tem círculo de 2,75rem e padding. O link preenche a `li`, largura 100%.
- Aparência: `text-decoration: none`, cor herdada, `cursor: pointer`. Foco visível com anel `var(--theme-color)`, sem deslocar a linha.
- Sem `hrefFor`, a linha permanece como está: sem link, e `renderAction` segue valendo para outros usos.

O índice passa `hrefFor` e não passa `renderAction`.

---

## 5. Catálogo no BFF do aluno

`GET /api/student/subjects` usa a sessão do aluno e chama `GET /admin/subjects?page=&per_page=100`, repetindo enquanto `page < last_page`. O teto é 20 páginas.

A query da API é `per_page`. O corpo usa `data` e `meta.last_page`. `studentLaravelRequest` descarta `meta`; a rota lê o payload bruto.

A resposta do site é `{ data: SubjectCatalogItem[] }`: `uuid`, `name`, `color`, `icon`. `code` e datas não saem. Item sem `uuid` ou sem `name` é ignorado. Ordem alfabética do nome, em pt-BR.

O browser chama só `/api/student/subjects`.

---

## 6. Página da disciplina

`student-subject-materials.tsx` recebe `subjectUuid` da rota.

Ordem, de cima para baixo:

1. Link **Materiais** para `/aluno/materiais`.
2. Título: `name` da disciplina no catálogo, a mesma lista do índice. Enquanto o catálogo carrega, o título não usa a UUID; o texto no lugar do título é **Carregando conteúdos...**.
3. `StudentContentSearch` com esse `subjectUuid`.
4. No `children` do buscador, `StudentMaterialsList` com os `materials` do estado da busca.

O título, quando o catálogo já respondeu e a UUID não está nele, é **Conteúdos**. O pedido de materiais segue mesmo assim.

A busca e a lista disparam junto com o catálogo. Não esperam o nome para pedir os conteúdos.

422 de `subject_uuid` (UUID inválida ou disciplina inexistente) mostra a mensagem do campo, `errors.subject_uuid`. Exemplos estáveis da API: **A disciplina deve ser um UUID válido.** e **Disciplina não encontrada.** Sem essa chave, vale o bloco vermelho atual (`detail` ou `title`). Nesse erro a lista não cai no vazio.

`data: []` com 200 mostra **Nenhum material encontrado.**

Os cards, o progresso e os links **Estudar** / **Continuar** permanecem. Identificadores técnicos ficam fora da tela. A frase de aulas vistas não aparece aqui: esses números são da matrícula inteira e já estão no dashboard. Quando a lista recebe `materials` de fora, ela não pede nem desenha a frequência.

---

## 7. Busca presa à disciplina

`StudentContentSearch` aceita `subjectUuid?: string`. O debounce, o mínimo de 2 caracteres, o teto de 255, a lupa e o Enter continuam os da spec da busca.

```ts
useStudentMaterialsQuery(enabled?: boolean, search?: string, subjectUuid?: string)
```

Quem chama sem o terceiro argumento continua pedindo a lista sem disciplina.

`resolveStudentMaterialsSearch` passa a receber os dois valores e devolver o path:

| Termo trimado | `subjectUuid` | Path |
| --- | --- | --- |
| Ausente, vazio ou 1 caractere | ausente | `/api/student/materials` |
| 2 a 255 caracteres | ausente | `/api/student/materials?search=` |
| Ausente, vazio ou 1 caractere | preenchido | `/api/student/materials?subject_uuid=` |
| 2 a 255 caracteres | preenchido | `/api/student/materials?search=&subject_uuid=` |

`subjectUuid` entra trimado. Vazio é omitido. Os dois parâmetros saem por `URLSearchParams`, para espaço e acento de `search` continuarem codificados.

A query key é `["student", "materials", termoTrimadoOuVazio, subjectUuidTrimadoOuVazio]`. `placeholderData` mantém o array anterior enquanto o pedido novo não chega. Durante os 300ms a lista não troca para **Carregando conteúdos...**.

O Route Handler lê `search` e `subject_uuid`. Depois do `trim`, valor vazio não é repassado. Os dois preenchidos vão juntos para `/mobile/student/materials`. O nome na API é `subject_uuid`.

---

## 8. Textos da lista de conteúdos

`StudentMaterialsList` deixa de variar a frase conforme a busca.

| Situação | Texto |
| --- | --- |
| Primeira carga, quando a própria lista busca | **Carregando conteúdos...** |
| Array vazio | **Nenhum material encontrado.** |
| Erro | Bloco vermelho já existente |

A frase **Nenhum material liberado para este aluno no momento.** e a frase **Nenhum conteúdo encontrado com esse nome.** saem. Supervisão usa o mesmo vazio genérico. Ela não ganha buscador.

`isSearchActive` continua no estado do campo, para quem precisar saber se o termo já foi aplicado. A lista não escolhe o texto por esse flag.

---

## 9. Critério de aceite

- `/aluno/materiais` mostra as disciplinas do aluno, uma linha cada, em ordem alfabética, e não mostra os cards de conteúdo.
- Clicar em qualquer ponto da linha abre `/aluno/materiais/disciplina/{uuid}` dessa disciplina. A UUID não aparece escrita na linha.
- A página da disciplina abre no shell, com **Materiais** ativo no menu. O player em `/aluno/materiais/{contentUuid}` continua imersivo.
- O título da disciplina é o nome do catálogo. Há um link **Materiais** de volta ao índice.
- O buscador fica acima dos conteúdos. O pedido inicial é `GET /api/student/materials?subject_uuid=` dessa UUID, sem `search`.
- Digitar `fr` pede, após 300ms, `search=fr` e o mesmo `subject_uuid`. Apagar até uma letra tira só `search`.
- A lista na tela é a do servidor.
- Lista vazia, com ou sem termo, mostra **Nenhum material encontrado.**
- A primeira carga mostra **Carregando conteúdos...**. Uma busca seguinte não substitui os cards por esse texto.
- UUID inválida ou disciplina inexistente mostra a mensagem de `errors.subject_uuid`.
- A tela não mostra `uuid`, slug, entitlement nem `code`.
- A supervisão não exibe o buscador nem a lista de disciplinas.
- Teste de `resolveStudentMaterialsSearch`: termo curto omite `search` e mantém `subject_uuid`; termo com 2 caracteres envia os dois; sem disciplina, o path segue o da spec da busca.
