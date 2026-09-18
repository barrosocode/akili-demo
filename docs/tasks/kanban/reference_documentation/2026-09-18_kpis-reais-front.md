# Relatório — KPIs reais no card do filho (front-end)

**Data:** 2026-09-18  
**Para:** equipe `akili-site` (portal do responsável e, se o mesmo padrão existir, dashboard do aluno)  
**Origem:** cards de filhos no portal do responsável (progresso, streak, nível, resumo)

Pedido: **parar de ler os números pedagógicos do stub** `GET /progress` e passar a usar os endpoints que já calculam a partir da atividade do aluno.

---

## 1. O que mudou no demo

O `DemoProgressSeeder` **deixou de gravar** duplicatas inventadas de:

- `%` de progresso
- atividades concluídas
- tempo estudado
- média / evolução semanal
- `demo_progress` no entitlement

O seed **continua gravando** a fonte real: linhas em `student_content_progress` (percentual, status, tempo). Streak, nível/XP e relatório pedagógico seguem no JSON de demo, porque **não há motor** para eles.

Depois do próximo rebuild (`DemoEnvironmentSeeder` / reset demo), `GET .../progress` **não devolve mais** `kpis.overall_percent`, `kpis.activities_completed`, `kpis.average_score` nem `materials[].percent_complete`. Quem ainda ler esses campos vai ver card vazio ou streak-only.

---

## 2. Mapa do card → fonte correta

| UI no card | Ainda é stub? | Endpoint | Campo |
|---|---|---|---|
| Barra **Progresso** (%) | Não | `GET .../learning` (responsável) ou `GET .../dashboard` (aluno) | `kpis.overall_percent` |
| **Atividades concluídas** | Não | mesmo | `kpis.activities_completed` |
| Tempo estudado (se exibir) | Não | mesmo | `kpis.time_studied_seconds` |
| **Média** (%) | Não | `GET .../kpis/learning` | `learning_kpi.accuracy.percent` |
| **Dias consecutivos** (fogo e resumo) | **Sim** | `GET .../progress` | `kpis.study_streak_days` e/ou `gamification.streak_days` |
| **Nível** + título (ex.: Explorador das Sílabas) | **Sim** | `GET .../progress` | `gamification.level`, `gamification.level_name` |
| Relatórios, notificações, última aula de alfabetização | **Sim** | `GET .../progress` | `reports`, `notifications`, `latest_literacy_lesson` |
| Nome, turma, selo Demonstração | Cadastro / tenant | `GET .../students` + `learning.classroom` | não é KPI de estudo |

Não misturar as duas fontes no mesmo número. Não somar `progress.kpis` com `learning.kpis`.

---

## 3. Endpoints e como consumir

Prefixo Laravel: `/api/v1`. Auth Sanctum. Sessão do responsável **não** é a do aluno.

### 3.1 Progresso e atividades (dado real)

**Responsável**

```http
GET /api/v1/guardian/students/{student_uuid}/learning
Authorization: Bearer {token do responsável}
Permission: guardian.children.progress.read
```

BFF sugerido (já documentado em `docs/api/22-student-web-portal.md`):

```http
GET /api/guardian/children/{ref}/learning
```

Envelope **legado** `{ data }`:

```json
{
  "data": {
    "kpis": {
      "overall_percent": 84,
      "materials_available": 1,
      "materials_completed": 0,
      "materials_in_progress": 1,
      "time_studied_seconds": 5040,
      "activities_completed": 0
    },
    "materials": [
      {
        "content": { "uuid": "...", "name": "..." },
        "progress": {
          "status": "in_progress",
          "percent_complete": 84,
          "time_studied_seconds": 5040,
          "last_activity_at": "2026-09-18T08:20:00+00:00"
        }
      }
    ],
    "read_only": true,
    "supervision_mode": true
  }
}
```

**Aluno** (o próprio dashboard):

```http
GET /api/v1/mobile/student/dashboard
```

BFF: `GET /api/student/dashboard` → mesma chave `data.kpis`.

Regras de leitura:

- Barra do card = `data.kpis.overall_percent` (média dos materiais do catálogo).
- “X atividades concluídas” = `data.kpis.activities_completed` (conteúdos com `status = completed`). **Não** é o número 28/11 antigo do seed.
- Lista por material: `data.materials[].progress.percent_complete`.
- `overall_percent` 0 com `materials_available` 0 = aluno sem pacote/conteúdo, não é erro de API.

### 3.2 Média / acerto (dado real)

**Responsável**

```http
GET /api/v1/guardian/students/{student_uuid}/kpis/learning
```

Query opcional: `date_from`, `date_to` (default últimos 30 dias, timezone `America/Sao_Paulo`). **Não** enviar `student_uuid` na query — o aluno é o da rota.

BFF sugerido (`docs/tasks/gameficacao-e-kpis/front-end/site/specs/03-kpis-responsavel.md`):

```http
GET /api/guardian/children/{ref}/kpis/learning
```

Envelope **padrão Akili** (não é `{ data }`):

```json
{
  "status": 200,
  "message": "Indicadores de aprendizagem obtidos com sucesso.",
  "errors": {},
  "learning_kpi": {
    "aggregation": "response",
    "accuracy": {
      "percent": 72.5,
      "correct_count": 58,
      "incorrect_count": 22,
      "responses_count": 80
    },
    "time_ratio": {
      "avg": 1.24,
      "responses_count": 80
    }
  },
  "pagination": null,
  "error_code": null
}
```

O BFF **não** pode unwrapar só `data`. Extrair `learning_kpi`. Se o helper do site só entende `{ data }`, mapear **depois** de ler `learning_kpi`.

Regras de leitura:

- “Média de X%” no card = `learning_kpi.accuracy.percent`.
- Se `accuracy.percent` for `null` **ou** `responses_count === 0`: empty state (“Ainda não há respostas neste período.”). Não inventar 0% como média.
- No demo recém-rebuildado a média pode vir vazia: o seed **não** fabrica respostas. O número só aparece depois que o aluno (ou a aula) gravar `activity_responses`.

Contrato completo: `docs/tasks/gameficacao-e-kpis/specs/05-graficos-e-contratos.md`.

### 3.3 Streak, nível e texto de resumo (ainda stub)

```http
GET /api/v1/guardian/students/{student_uuid}/progress
```

BFF típico: `GET /api/guardian/children/{ref}/progress`.

Envelope legado `{ data }`. Usar **somente**:

```json
{
  "data": {
    "status": "demo",
    "kpis": { "study_streak_days": 12 },
    "summary": "Resumo: 12 dias consecutivos de estudo.",
    "gamification": {
      "xp": 1480,
      "level": 9,
      "level_name": "Explorador das Sílabas",
      "streak_days": 8
    },
    "reports": [],
    "notifications": [],
    "latest_literacy_lesson": {}
  }
}
```

- Fogo / “N dias consecutivos”: preferir `gamification.streak_days` se existir; senão `kpis.study_streak_days`.
- Nível: `gamification.level` + `gamification.level_name`. Se `gamification` for `null` (Lívia, plano sem gamificação), **omitir** a linha de nível. Não mostrar “Nível 0”.
- **Não** montar o resumo com `kpis.activities_completed` / `kpis.average_score` — esses campos saíram do stub. Compor o texto no front: atividades de `/learning` + média de `/kpis/learning` + streak de `/progress`.

### 3.4 Frequência (aluno, se a UI precisar)

```http
GET /api/v1/mobile/student/kpis/frequency
```

Envelope padrão, chave `frequency`: `available_count`, `viewed_count`, `pending_count`, `viewed_percent`.

Não existe o mesmo endpoint no canal do responsável; para o pai, use `learning.kpis.materials_available` / `materials_completed`.

---

## 4. Orquestração sugerida no card da lista de filhos

Por filho, em paralelo (2 filhos = 6 requests no máximo; cache 180s no KPI):

1. `GET .../learning` → barra + atividades.
2. `GET .../kpis/learning` → média (tratar `null`).
3. `GET .../progress` → streak, nível, relatórios, `status: demo`.

Não bloquear o card inteiro se o KPI de acerto vier vazio.

Professor/coordenador: **não** usar o stub do responsável. Progresso da turma já sai de `student_content_progress` em `GET /api/v1/teacher/students/{uuid}/progress` e no dashboard da escola. Acerto: `GET /api/v1/teacher/kpis/learning?student_uuid=` / `GET /api/v1/schools/{school}/kpis/learning`.

---

## 5. Pedido à equipe front-end

1. Nos cards de filhos, **trocar** progresso, atividades concluídas e média para `/learning` + `/kpis/learning`.
2. Manter `/progress` só para gamificação, streak, relatórios e metadados de demo.
3. Tratar envelope `{ data }` vs `{ learning_kpi }` corretamente no BFF.
4. Empty state quando não houver respostas; não recuar para número seedado.
5. Não interpolar `data.summary` antigo como fonte de verdade das atividades/média.

Critério de aceite: com o aluno estudando no player, a barra e as atividades do card do responsável **sobem** sem rebuild do demo. Nível e streak continuam estáticos até existir motor de gamificação.
