# Spec 01 — Lista de disciplinas

**Repo:** `akili-site`  
**Contrato da API:** [api-documentation.md](../reference/api-documentation.md)  
**Entrega:** componente visual e a função que monta a lista. Sem página, sem rota e sem ligar o componente na tela inicial.

O desenho de referência é uma linha por disciplina: círculo colorido com ícone branco, nome e um espaço à direita. O título do bloco é **Minhas disciplinas**.

---

## Decisões fechadas

- Uma linha por disciplina. Várias aulas da mesma disciplina viram uma linha.
- A lista mostra só disciplinas que o aluno tem em algum material. O catálogo completo não aparece.
- Não criar endpoint novo na API. Ver a seção 1.
- Sem frase cinza. Não existe `description` e o componente não inventa subtítulo.
- À direita, um nó opcional por linha. Esta entrega não define o clique nem o rótulo. O botão, quando existir, não usa a cor da disciplina.
- Ordem alfabética do nome, em pt-BR.
- Disciplina do material cujo `uuid` não está no catálogo some da lista. Não desenhar a linha só com o nome do material.
- Ícone da lucide dentro do visual Kiddino (Bootstrap). Sem `components/ui` (shadcn).
- `uuid` e `code` não aparecem na tela.

---

## 1. Por que não há endpoint novo

`GET /api/v1/admin/subjects` já lista o catálogo para qualquer sessão autenticada, inclusive a do aluno. A policy `viewAny` libera a leitura. Criar, editar e excluir continuam com `akili_admin` e `master`.

Essa rota devolve o catálogo inteiro, não o recorte do aluno. Filtro de `search` no nome, paginação `page` + `per_page` (padrão 15, máximo 100), disciplinas com soft delete de fora. O detalhe `GET /api/v1/admin/subjects/{uuid}` também é aberto, e esta spec não o usa.

As disciplinas do aluno já vêm em `GET /api/v1/mobile/student/materials` (`content.subject` com `uuid` e `name`, sem `color` nem `icon`). O site já consome isso em `GET /api/student/materials`.

O cruzamento fica no front:

1. Uuids distintos de `content.subject` nos materiais.
2. Catálogo completo, com `color` e `icon`.
3. Interseção pela `uuid`.
4. O que não cruzar é descartado.
5. Ordenar pelo nome.

Não vale um endpoint “disciplinas do aluno” agora. Cor e ícone são únicos entre disciplinas ativas, e o catálogo de ícones tem 26 chaves, então a lista ativa não passa de 26. Uma página com `per_page=100` cobre o catálogo. Um endpoint novo só passa a fazer sentido se o catálogo deixar de caber em poucas páginas, ou se os materiais deixarem de identificar a disciplina.

`GET /api/guardian/subjects` não serve esta lista. É sessão do responsável e hoje devolve só `{ uuid, name }`. Não alterar essa rota nesta spec.

---

## 2. O que entra nesta entrega

| Peça | Papel |
| --- | --- |
| `features/subjects/components/subject-list.tsx` | Lista visual. Não busca dados. |
| `features/subjects/lib/subject-icons.ts` | Mapa das 26 chaves para o componente lucide. |
| `features/subjects/lib/subject-color.ts` | Cor válida e pastel com alpha 0,12. |
| `features/subjects/lib/resolve-student-subjects.ts` | Interseção materiais × catálogo, sem I/O. |
| `types/subject-catalog.ts` | Tipo do item. Não alargar `CatalogSubject` do plano de estudos. |
| `styles/marketing-overrides.css` | Layout estático sob `.marketing-root .subject-list`. Cor dinâmica em `style`. |

Fora desta entrega:

- Página, item de menu e a tela inicial do aluno.
- BFF novo e qualquer `fetch` dentro do componente.
- Formulário de criar ou editar disciplina (isso é admin).
- Trocar os cards de material que já existem.

Quando a tela inicial for ligada, o caminho é: materiais que já existem, catálogo via BFF do aluno (`GET /api/v1/admin/subjects?page=&per_page=100` com o token do aluno, repetindo enquanto `page < last_page`), `resolveStudentSubjects`, e então `<SubjectList />`. Query da API é `per_page`, não `page_size`. Envelope `data` + `meta` (`current_page`, `last_page`, `per_page`, `total`).

---

## 3. Tipos

```ts
export type SubjectCatalogItem = {
  uuid: string;
  name: string;
  color: string;
  icon: string;
};

export type SubjectListItem = SubjectCatalogItem;
```

`uuid` é chave de lista e de cruzamento. O componente não a escreve na tela.

A função de cruzamento aceita o recorte que os materiais já têm (`{ uuid, name } | null`) e o catálogo com cor e ícone. Não depende do tipo inteiro de `StudentMaterial`.

---

## 4. Cruzamento

`resolveStudentSubjects(materials, catalog)`:

- Ignora material sem `content.subject`.
- Monta o conjunto de `subject.uuid` dos materiais.
- Mantém o item do catálogo cujo `uuid` está nesse conjunto.
- Descarta uuid de material que não está no catálogo. Não cria linha com o nome do material nem com a cor padrão.
- Uma linha por `uuid`. Se o catálogo repetir, fica a primeira ocorrência.
- Ordena por `name` com `localeCompare` pt-BR.
- Não inclui disciplina do catálogo que o aluno não tem.
- Não chama a rede.

---

## 5. Cor e ícone

Mapa único, as mesmas chaves da API:

`book-open`, `book`, `library`, `languages`, `pen-line`, `layout-grid`, `calculator`, `sigma`, `flask-conical`, `microscope`, `atom`, `leaf`, `test-tube`, `landmark`, `globe`, `map`, `brain`, `users`, `scale`, `music`, `palette`, `dumbbell`, `clipboard-list`, `graduation-cap`, `puzzle`, `lightbulb`.

- Chave ausente no mapa, ou ícone vazio, renderiza `book-open`.
- Cor que não é `#RRGGBB` (maiúsculas entram, o cliente normaliza) renderiza `#64748b`.
- Círculo: fundo da cor resolvida, ícone branco, traço, sem preenchimento.
- Fundo da linha: a mesma cor com alpha 0,12. Calcular no cliente. Não persistir e não esperar `surface_color`.
- O ícone é decorativo (`aria-hidden`). O nome é o texto da linha.

---

## 6. Componente

`SubjectList` é client component. A página que passar o nó da direita também será client.

```ts
type SubjectListProps = {
  subjects: SubjectListItem[];
  title?: string;
  renderAction?: (subject: SubjectListItem) => React.ReactNode;
};
```

- `title` padrão: `Minhas disciplinas`. String vazia omite o título, para uma página que já tenha o cabeçalho.
- `renderAction` omitido, ou retorno `null` numa linha: essa linha não reserva coluna à direita.
- O componente não envolve a linha em link e não escolhe destino.
- O nó da direita não herda a cor da disciplina. Um “Continuar” futuro usa o verde do `vs-btn`.
- Antes de desenhar, o componente deduplica por `uuid` e ordena de novo por nome. A função da seção 4 continua obrigatória: é ela que tira o que o aluno não tem e o que não cruzou.
- Lista vazia: mantém o título (se houver) e o texto “Nenhuma disciplina disponível.” Sem botão de adicionar.
- Loading e erro de rede ficam com quem busca os dados. Este componente recebe a lista já pronta.
- Mobile primeiro: círculo e nome na mesma linha; se houver ação e a largura não couber, a ação quebra para baixo, alinhada ao fim, com área de toque a cargo do botão que o caller passar.
- Linhas empilhadas em largura cheia, não em grade de duas colunas.
- Não exibir `code`, `uuid`, data, progresso nem nome de pacote.

Acessibilidade: a região aponta para o título (`aria-labelledby`). A lista é `ul` / `li`. A cor não é a única informação: o nome está sempre em texto.

---

## 7. Critério de aceite

- Três disciplinas do aluno, com cor e ícone do catálogo, aparecem em ordem alfabética, uma linha cada, título “Minhas disciplinas”, sem subtítulo.
- Duas aulas da mesma disciplina geram uma linha.
- Disciplina do catálogo sem material não aparece.
- Material cuja disciplina não está no catálogo não aparece.
- Sem `renderAction`, a linha termina no nome.
- Com `renderAction`, o nó fica à direita e não pinta com a cor da disciplina.
- Ícone fora do mapa cai em `book-open`. Cor inválida cai em `#64748b`, no círculo e no pastel.
- A tela não mostra `uuid` nem `code`.
- Nenhum endpoint novo na API. Nenhum fetch dentro de `SubjectList`. Nenhuma página nova.
- Teste unitário de `resolveStudentSubjects` e da normalização de cor. Sem teste de browser nesta entrega, porque a lista ainda não tem rota.
