export type MockReportMonth = {
  id: string;
  label: string;
};

export type MockReportSection = {
  id: string;
  title: string;
  /** Corpo base; o mês selecionado pode ser interpolado na UI. */
  body: string;
};

/** Últimos meses — espelha $showPreviousMonths / $showRelatoriosDate do legado. */
export const mockReportMonths: MockReportMonth[] = [
  { id: "2026-08", label: "Agosto 2026" },
  { id: "2026-07", label: "Julho 2026" },
  { id: "2026-06", label: "Junho 2026" },
  { id: "2026-05", label: "Maio 2026" },
];

/**
 * Seções no formato do accordion comentado em
 * layout_old/dashboard/responsavel/conteudo/relatoriosView.php
 * (títulos adaptados para português + conteúdo de relatório fictício).
 */
export const mockReportSections: MockReportSection[] = [
  {
    id: "little-readers",
    title: "First Little Readers (Níveis A–C)",
    body: "Neste período, o aluno avançou na leitura guiada dos níveis A a C. Completou {sessions} sessões, com média de {minutes} minutos por dia. Destaque: reconhecimento de palavras familiares e fluência em frases curtas. Recomendação: manter 15 minutos de leitura compartilhada em casa, três vezes por semana.",
  },
  {
    id: "preschool-age",
    title: "Preparação para a pré-escola",
    body: "O acompanhamento indica evolução nas rotinas de atenção e organização. Em {month}, foram registradas atividades de socialização e autonomia (guardar materiais, seguir sequência de tarefas). Continue incentivando a rotina matinal com checklist visual simples.",
  },
  {
    id: "preschool-ready",
    title: "Pronto para a pré-escola?",
    body: "Indicadores de prontidão: foco em atividades curtas (melhorou), seguir instruções em dois passos (estável) e interesse por histórias (alto). Pontos a reforçar: separar-se do responsável em ambientes novos e compartilhar materiais com colegas. Progresso geral do mês: satisfatório.",
  },
  {
    id: "separate",
    title: "Separação e segurança emocional",
    body: "Nas atividades do mês de {month}, o aluno demonstrou maior confiança ao iniciar tarefas sozinho após um breve acolhimento. Sugestão: combinar uma despedida curta e previsível antes das sessões de estudo, reforçando que você estará por perto ao final.",
  },
  {
    id: "play-others",
    title: "Brincar e colaborar com outros",
    body: "Participou de {sessions} atividades em grupo (jogos e desafios colaborativos). Houve melhora em esperar a vez e celebrar conquistas dos colegas. Continue oferecendo brincadeiras de turnos em casa (ex.: jogos de memória ou encaixe) para consolidar o aprendizado.",
  },
];

export function formatReportBody(
  template: string,
  monthLabel: string,
  seed: number
): string {
  const sessions = 8 + (seed % 7);
  const minutes = 12 + (seed % 10);

  return template
    .replaceAll("{month}", monthLabel)
    .replaceAll("{sessions}", String(sessions))
    .replaceAll("{minutes}", String(minutes));
}
