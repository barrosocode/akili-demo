# Spec 03 — KPIs e gráficos do professor

**Repo:** `akili-admin`  
**Depende de:** [02-kpis-coordenador.md](02-kpis-coordenador.md) (helper de envelope, tipos, componentes de card/chart).  
**API:** `GET /api/v1/teacher/kpis/learning` e `GET /api/v1/teacher/charts/learning?series=`.

Não inventar permission nova. Escopo de turma já é imposto pela API (`classroom_teachers.left_at is null`).

---

## Decisões fechadas

- Superfícies:
  - `/teacher/classrooms/[uuid]` — agregado da turma (`classroom_uuid` na query).
  - `/teacher/students/[uuid]` — um aluno (`student_uuid` na query).
- Lista `/teacher/classrooms` **não** é obrigada a mostrar os novos KPIs nesta spec (pode continuar com as métricas de conclusão).
- `TeacherExecutiveDashboard` órfão: **não** criar rota nova só para hospedar isto. Encaixar nas páginas que o professor já usa.
- Permission de rota/página: `dashboards.teacher.view` para agregado. Com `student_uuid`, a API também exige `students.progress.read` — se 403, mensagem em português, sem inventar número.
- Reusar service/helper da spec 02. Não duplicar unwrap de envelope.
- Sem testes automatizados.

---

## 1. Chamadas

Mesmos query params da spec 02 / spec 05 da API.

| Tela | Params obrigatórios no client |
|---|---|
| Turma | `classroom_uuid` = uuid da rota |
| Aluno | `student_uuid` = uuid da rota |

Não mandar `student_uuid` de outro aluno. Não mandar `classroom_uuid` de turma que o professor não leciona — a API responde 403.

Omitir ambos no client **desta spec** (agregado de todas as turmas) só se a UI tiver um ponto explícito para isso. Preferência fechada: sempre escopar pela rota atual.

---

## 2. UI

Reusar os cards e gráficos da seção Aprendizagem da spec 02 (extrair componente compartilhado se ainda estiver inline no dashboard escolar).

Textos: média da turma ou do aluno, sem ranking entre crianças, sem “dificuldade de aprendizagem” / diagnóstico.

Empty state igual ao coordenador.

Filtros úteis na turma: período, disciplina, `outcome`, `session_position`. Filtro de outra turma nesta tela: não.

---

## 3. Critério de aceite

- Professor da turma X vê só responses da turma X; aluno de outra turma → 403 tratado.
- Ficha do aluno: `learning_kpi.filters.student_uuid` é o da rota.
- Network: `GET /teacher/kpis/learning` e `GET /teacher/charts/learning?series=...`.
- Coordenador / dashboard escolar da spec 02 não regride.
- Sem testes automatizados.

## 4. Relatório

`reports/YYYY-MM-DD_spec-03.md`: páginas tocadas, se `TeacherExecutiveDashboard` foi ou não reutilizado, e o recorte de filtros.
