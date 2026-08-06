import type { ContentQuestion } from "@/types/student-learning";

export type LessonTabId = "treino" | "conf" | "r1" | "r2" | "r3" | "desafio";

export type LessonQuestionTabId = Exclude<LessonTabId, "treino">;

export interface LessonTabMeta {
  id: LessonTabId;
  label: string;
  tierName?: string;
  tierSub?: string;
}

export const LESSON_TABS: LessonTabMeta[] = [
  { id: "treino", label: "Conteúdo" },
  {
    id: "conf",
    label: "Conferência",
    tierName: "Conferência de aprendizado",
    tierSub: "(memória — logo após estudar o conteúdo)",
  },
  {
    id: "r1",
    label: "Revisão 1",
    tierName: "Revisão 1",
    tierSub: "(memória — após 1 dia)",
  },
  {
    id: "r2",
    label: "Revisão 2",
    tierName: "Revisão 2",
    tierSub: "(memória — revisão)",
  },
  {
    id: "r3",
    label: "Revisão 3",
    tierName: "Revisão 3",
    tierSub: "(memória — revisão)",
  },
  {
    id: "desafio",
    label: "Desafio",
    tierName: "Desafio",
    tierSub: "(generalização — aprofundam e testam o raciocínio)",
  },
];

export const MEMORIZATION_TAB_IDS: LessonQuestionTabId[] = [
  "conf",
  "r1",
  "r2",
  "r3",
];

export type QuestionTabDistribution = Record<
  LessonQuestionTabId,
  ContentQuestion[]
>;

export function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

export function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = result[index];
    result[index] = result[swapIndex];
    result[swapIndex] = current;
  }
  return result;
}

/** Divide itens embaralhados de forma equilibrada entre N buckets, sem repetição. */
export function distributeEvenly<T>(items: T[], bucketCount: number): T[][] {
  if (bucketCount <= 0) return [];

  const shuffled = shuffleArray(items);
  const buckets: T[][] = Array.from({ length: bucketCount }, () => []);
  const baseSize = Math.floor(shuffled.length / bucketCount);
  const remainder = shuffled.length % bucketCount;
  let offset = 0;

  for (let bucketIndex = 0; bucketIndex < bucketCount; bucketIndex += 1) {
    const size = baseSize + (bucketIndex < remainder ? 1 : 0);
    buckets[bucketIndex] = shuffled.slice(offset, offset + size);
    offset += size;
  }

  return buckets;
}

export function buildQuestionTabDistribution(
  questions: ContentQuestion[]
): QuestionTabDistribution {
  const memorization = questions.filter(
    (question) => question.question_type === "memorization"
  );
  const generalized = questions.filter(
    (question) => question.question_type === "generalized"
  );
  // Sem tipo tipado → Conferência (compatível com conteúdos legados).
  const untyped = questions.filter(
    (question) =>
      question.question_type !== "memorization" &&
      question.question_type !== "generalized"
  );
  const memorizationBuckets = distributeEvenly(
    memorization,
    MEMORIZATION_TAB_IDS.length
  );

  return {
    conf: [...(memorizationBuckets[0] ?? []), ...untyped],
    r1: memorizationBuckets[1] ?? [],
    r2: memorizationBuckets[2] ?? [],
    r3: memorizationBuckets[3] ?? [],
    desafio: shuffleArray(generalized),
  };
}

export function isQuestionTabId(
  tabId: LessonTabId
): tabId is LessonQuestionTabId {
  return tabId !== "treino";
}

/** Abas visíveis: Conteúdo sempre; demais só se houver questões. */
export function resolveVisibleTabs(
  _pagesCount: number,
  distribution: QuestionTabDistribution
): LessonTabMeta[] {
  return LESSON_TABS.filter((tab) => {
    if (tab.id === "treino") return true;
    return distribution[tab.id].length > 0;
  });
}
