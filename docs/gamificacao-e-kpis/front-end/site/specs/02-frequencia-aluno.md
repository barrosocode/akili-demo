# Spec 02 — Frequência de aulas (aluno)

**Repo:** `akili-site`  
**Depende de:** [01-player-sessoes.md](01-player-sessoes.md) não bloqueia esta UI (frequência usa catálogo + `student_content_progress`, não `activity_responses`). Pode seguir logo após o player **ou** em paralelo se o usuário pedir. Preferência do orquestrador: depois da 01, para o BFF de envelope nascer no mesmo fôlego da 03.  
**API:** `GET /api/v1/mobile/student/kpis/frequency`  
**Chave:** `frequency`

Aluno **não** recebe séries de tempo/acerto neste recorte.

---

## Decisões fechadas

- Superfícies: `StudentDashboardView` (`/aluno`) e, se couber sem poluir, um resumo em `StudentMaterialsList` (`/aluno/materiais`).
- Payload:

```json
{
  "available_count": 12,
  "viewed_count": 5,
  "pending_count": 7,
  "viewed_percent": 41.7
}
```

- Vista = `status != not_started` no progresso do catálogo (definição da API). Ausência de linha = pendente.
- Sem filtro de currículo/data nesta fase.
- Sem testes automatizados.

---

## 1. Envelope BFF

`unwrapData` em `lib/api/envelope.ts` só extrai `{data}`. A resposta Laravel traz `frequency`, não `data`.

Na rota BFF (ex. `app/api/student/kpis/frequency/route.ts`):

1. `studentLaravelRequest` **não** pode devolver o objeto inteiro sem mapear — criar `unwrapResource(payload, 'frequency')` (ou ler `payload.frequency` se o request for adaptado para não unwrapar cego).
2. Devolver ao browser com `jsonSuccess(frequency)` para o `bffClient` atual continuar unwrapando `{data}`.

Não mudar o unwrap global das rotas antigas (dashboard, materials, progress).

---

## 2. Hook e UI

Hook em `features/student/hooks/` (ex. `use-student-frequency.ts`) → `GET /api/student/kpis/frequency`.

Cards (copy neutra, português):

- Aulas disponíveis
- Já vistas
- Pendentes
- % vistas (`viewed_percent`)

Não substituir os cards atuais de `overall_percent` / tempo de tela — **acrescentar**. Conclusão (`percent_complete`) e frequência são métricas diferentes.

Empty: `available_count = 0` → “Não há aulas disponíveis na sua matrícula.”

Supervisão read-only: o responsável **não** consome este endpoint nesta spec (frequência é só aluno autenticado).

---

## 3. Critério de aceite

- Network: BFF → Laravel `GET /mobile/student/kpis/frequency`; browser recebe `{data: { available_count, ... }}`.
- Números batem com o catálogo (disponíveis = materiais listados; vistas = os que não estão `not_started`).
- Dashboard legado de progresso continua visível.
- Sem gráfico de acerto no aluno.
- Sem testes automatizados.

## 4. Relatório

`reports/YYYY-MM-DD_spec-02.md`: rota BFF, helper de envelope, superfícies de UI.
