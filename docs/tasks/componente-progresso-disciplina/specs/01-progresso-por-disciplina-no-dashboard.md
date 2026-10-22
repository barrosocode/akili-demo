# Spec 01 — Progresso por disciplina

**Repo:** `akili-site`  
**Contrato da API:** [api-dashboard.md](../reference/api-dashboard.md)  
**Entrega:** card **Meu progresso** com a prévia de três disciplinas e a lista completa atrás de **Ver detalhes**.

O desenho de referência é um card branco: à esquerda, ícone de barras e o título **Meu progresso**; à direita, o link **Ver detalhes**. Cada linha tem círculo colorido com ícone branco, nome, percentual à direita, barra na cor da disciplina e, sob o percentual, a fração de materiais (`17 / 25`).

---

## Decisões fechadas

- A prévia mostra no máximo três itens, na ordem em que a API mandou. O front não reordena e não recalcula `percent` a partir da fração.
- **Ver detalhes** é um único link no cabeçalho do card. A linha da disciplina não é link e não abre os materiais.
- O link existe sempre que a prévia tem ao menos uma disciplina, mesmo quando a lista completa tem três ou menos. Com lista vazia, o link some.
- A lista completa é o mesmo visual, com todas as disciplinas de `subject_progress` e sem o link.
- Prévia do aluno na home (`/aluno`). **Ver detalhes** vai para `/aluno/progresso`, que passa a mostrar a lista completa acima dos indicadores que já existem.
- Prévia do responsável no ambiente do filho (`/aluno/supervisao/[childRef]`). **Ver detalhes** vai para `/aluno/supervisao/[childRef]/progresso`.
- Disciplina com `percent: 0` aparece. A barra fica vazia e o texto mostra `0%` e `0 / total`.
- Cor e ícone vêm de `subject.color` e `subject.icon`, com o mesmo fallback de `resolveSubjectColor` e `resolveSubjectIcon`.
- `uuid` não aparece na tela. Serve só de chave da linha.
- Visual Kiddino (Bootstrap + `style.css`). Sem Tailwind e sem `components/ui`.

---

## 1. Contrato que o componente usa

`subject_progress` já vem em `data` de:

| Quem vê | Browser | Laravel |
| --- | --- | --- |
| Aluno | `GET /api/student/dashboard` | `GET /mobile/student/dashboard` |
| Responsável | `GET /api/guardian/children/[ref]/learning` | `GET /guardian/students/{uuid}/learning` |

Os route handlers devolvem o objeto `data` inteiro. Esta entrega não cria rota de BFF e não altera esses handlers. O tipo `StudentDashboard` passa a declarar o campo.

Cada item:

```ts
{
  subject: { uuid: string; name: string; color: string; icon: string };
  materials_total: number;
  materials_completed: number;
  percent: number;
}
```

A API só inclui disciplina que tem material no catálogo do aluno. A ordem já é maior `percent` primeiro e, no empate, nome ascendente. Campo ausente ou `null` equivale a lista vazia, não a erro de rede.

`overall_percent` e os outros KPIs continuam nos cards que já existem. Este componente não os lê.

---

## 2. O que entra nesta entrega

| Peça | Papel |
| --- | --- |
| `types/student-learning.ts` | `SubjectProgressItem` e `subject_progress` em `StudentDashboard`. |
| `features/subjects/lib/select-subject-progress.ts` | Deduplica, preserva a ordem e, na prévia, corta em três. Sem I/O. |
| `features/subjects/components/subject-progress-list.tsx` | Card visual. Não busca dados. |
| `features/student/components/student-subject-progress-preview.tsx` | Prévia da home do aluno. Dona de `useStudentDashboardQuery`. |
| `features/study-board/components/student-study-board-view.tsx` | Encaixa a prévia no topo da home. |
| `features/student/components/student-dashboard-view.tsx` | Lista completa no topo de `/aluno/progresso`. |
| `features/student/components/supervision-dashboard-page.tsx` | Prévia com os dados que a página já carregou. |
| `features/student/components/supervision-subject-progress-page.tsx` | Lista completa do filho. |
| `app/(aluno)/aluno/supervisao/[childRef]/progresso/page.tsx` | Casca da lista do responsável. |
| `lib/auth/portal-paths.ts` | `supervisionProgressPath(childRef)`. |
| `styles/marketing-overrides.css` | Layout sob `.marketing-root .subject-progress`. |

Fora desta entrega:

- Item novo na sidebar. **Meu progresso** continua em `/aluno/progresso`. No ambiente do filho, a rota nova permanece sob **Ambiente do aluno**.
- Clique da linha para `GET /api/student/materials?subject_uuid=`.
- Alterar `SubjectList` (**Minhas disciplinas**), os cards de KPI, a frequência, os materiais e o quadro de estudos além de encaixar a prévia.
- Dashboard escolar (`by_subject`).
- `color` e `icon` nos cards de material.

---

## 3. Tipos e seleção

```ts
export type SubjectProgressItem = {
  subject: {
    uuid: string;
    name: string;
    color: string;
    icon: string;
  };
  materials_total: number;
  materials_completed: number;
  percent: number;
};
```

`StudentDashboard.subject_progress` é `SubjectProgressItem[]` opcional, para um payload antigo não quebrar a tela.

`selectSubjectProgress(items, mode)`:

- `null`, `undefined` ou o que não for array vira `[]`.
- Item sem `subject.uuid` string não vazia sai.
- `uuid` repetido: fica a primeira ocorrência.
- A ordem restante é a do array recebido.
- `mode: "preview"` devolve no máximo três.
- `mode: "full"` devolve todos os que sobraram.
- Não ordena por nome nem por percentual.
- Não chama a rede.

---

## 4. Componente

`SubjectProgressList` é client component.

```ts
type SubjectProgressListProps = {
  items: SubjectProgressItem[] | null | undefined;
  mode?: "preview" | "full";
  detailsHref?: string;
  title?: string;
};
```

- `mode` padrão: `"preview"`.
- `title` padrão: `Meu progresso`. String vazia omite o cabeçalho.
- Na prévia, com ao menos uma linha e `detailsHref` preenchido, o cabeçalho mostra **Ver detalhes**. Sem `detailsHref`, a prévia não inventa destino e não desenha o link.
- `mode: "full"` ignora `detailsHref`.
- Lista vazia, com título: o título permanece e o texto é **Nenhuma disciplina com conteúdo ainda.** Sem link.
- Loading e erro de rede ficam com quem busca os dados. Este componente recebe a lista já pronta.

Números, só para exibir:

- Percentual visível: `Math.round(percent)` seguido de `%`, quando `percent` é finito. Fora disso, `0%`.
- Largura da barra: esse inteiro limitado ao intervalo de 0 a 100. O limite é só da barra; a fração não é usada para chegar nele.
- Fração: `materials_completed / materials_total`, com inteiro finito ou `0` em cada lado. Exemplo: `17 / 25`.

---

## 5. Aparência

Classes em `styles/marketing-overrides.css`, escopo `.marketing-root .subject-progress`. O card não usa `.widget` nem `.widget_title`: o título do tema tem 30px e um traço decorativo, e a barra `.progress` do Bootstrap não acompanha a cor da disciplina.

O card é branco, largura 100%, raio 20px, padding 20px, sombra suave (`0 8px 24px rgba(15, 23, 42, 0.06)`). Mobile primeiro: uma coluna, linhas empilhadas.

Cabeçalho, quando o título existe:

| Peça | Valor |
| --- | --- |
| Ícone | lucide `ChartColumn`, 18px, `#16a34a`, `aria-hidden` |
| Título | **Meu progresso**, 1.05rem, peso 700, cor `#1e3a5f` |
| Link | **Ver detalhes**, 0.9rem, peso 600, `#16a34a`, seta lucide `ArrowRight` à direita, `aria-hidden` |
| Toque do link | altura mínima 44px, alinhado à direita |
| Foco do link | anel `2px solid #16a34a`, `outline-offset: 2px` |

`#16a34a` é o verde do modelo. O link não usa `var(--theme-color)` (`#DF5C16` no Kiddino).

Linha:

- Círculo de 2.5rem, fundo `resolveSubjectColor`, ícone branco de 20px via `resolveSubjectIcon`, `aria-hidden`. Alinhado ao topo da linha.
- Nome à direita do círculo, peso 600, `#1e3a5f`, uma linha com reticências se não couber.
- Coluna direita, cerca de 4.5rem, alinhada ao fim: percentual em 0.95rem peso 700; abaixo, a fração em 0.8rem, `#6b7280`.
- Barra na coluna do nome, altura 8px, raio total. Trilho `#e5e7eb`. Preenchimento na cor resolvida da disciplina.
- Folga de 1.15rem entre linhas. Sem divisória e sem fundo pastel na linha.
- A região aponta para o título (`aria-labelledby`) quando o título existe. A lista é `ul` / `li`.
- A barra é `role="progressbar"` com `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-valuenow` no inteiro já limitado e `aria-label={`Progresso em ${nome}`}`.
- A cor não é a única informação: nome, percentual e fração estão em texto.

---

## 6. Onde aparece

### Home do aluno

`StudentSubjectProgressPreview` entra no topo de `StudentStudyBoardView`, dentro de `.blog-content`, antes do plano ou do estado vazio do quadro.

- Busca `useStudentDashboardQuery` à parte do quadro. O quadro não espera esse pedido.
- Enquanto o dashboard carrega e ainda não há dado, o card mostra o título e **Carregando progresso...** Sem link.
- Erro e sem dado anterior: título e **Não foi possível carregar o progresso.** Sem link. O quadro continua na tela.
- Sucesso: `mode="preview"` e `detailsHref` = `STUDENT_PROGRESS_PATH` (`/aluno/progresso`).

### Página Meu progresso

`/aluno/progresso` continua em `StudentDashboardView` com o `h2` **Meu progresso**. A lista completa entra logo abaixo desse título, antes dos quatro indicadores.

- `mode="full"` e `title=""`, para não repetir o `h2`.
- Usa o `data` que a view já tem. Não faz outro pedido.
- `readOnly` não muda a lista. No aluno esta página não é somente leitura.

### Supervisão

`SupervisionDashboardPage` já tem o learning do filho. A prévia fica acima de `StudentDashboardView`, com `mode="preview"` e `detailsHref` = `supervisionProgressPath(childRef)` (`/aluno/supervisao/${childRef}/progresso`).

A página nova mostra:

- Link **Voltar**, classe `vs-btn style3`, para o ambiente do filho (`supervisionHomePath`).
- O mesmo card em `mode="full"`, título **Meu progresso**, dados de `useGuardianSupervisionDashboardQuery`.
- Loading, erro e lista vazia com as mesmas frases da prévia.
- Nenhuma ação de estudo. A lista só informa.

`resolveStudentShellActiveHref` já trata caminho desconhecido da supervisão como o ambiente do filho. Não acrescentar item de menu.

---

## 7. Critério de aceite

- Home do aluno: card **Meu progresso**, no máximo três disciplinas, link **Ver detalhes** para `/aluno/progresso`.
- Três ou menos disciplinas na prévia: o link continua, e a página de detalhes mostra exatamente essas linhas.
- Quatro ou mais: a prévia fica nas três primeiras do array; a página de detalhes mostra todas, na mesma ordem.
- `/aluno/progresso` mostra a lista completa, sem **Ver detalhes**, e os indicadores, a frequência e os materiais que já estavam na página.
- Ambiente do filho: a mesma prévia; **Ver detalhes** abre `/aluno/supervisao/[childRef]/progresso` com a lista completa e **Voltar**.
- A ordem da tela é a ordem de `subject_progress`. O cliente não ordena de novo.
- Barra com a largura do percentual, na cor da disciplina. Texto do percentual e fração `concluídos / total` iguais aos números do item. `in_progress` não entra nessa conta porque o cliente não recalcula.
- Disciplina com `percent: 0` aparece com barra vazia.
- Lista vazia: **Nenhuma disciplina com conteúdo ainda.** Sem link.
- Ícone desconhecido cai em `book-open`. Cor que não é `#RRGGBB` cai em `#64748b`.
- A tela não mostra `uuid`. A linha não navega para materiais.
- A home não fica em branco se o dashboard do progresso falhar; o quadro de estudos segue visível.
- Teste unitário de `selectSubjectProgress`: corte em três, ordem preservada, `uuid` repetido, campo ausente. Sem teste de browser obrigatório além de abrir a home, seguir **Ver detalhes** e ver a lista completa no aluno e na supervisão.
