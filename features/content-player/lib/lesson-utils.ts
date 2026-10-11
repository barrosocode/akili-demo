import type { ContentQuestion } from "@/types/student-learning";

export type LessonTabId = "treino" | "conf" | "r1" | "r2" | "r3" | "desafio";

export type LessonQuestionTabId = Exclude<LessonTabId, "treino">;

export interface LessonTabMeta {
  id: LessonTabId;
  label: string;
  tierName?: string;
  tierSub?: string;
}

const LESSON_TAB_META: Record<LessonTabId, LessonTabMeta> = {
  treino: { id: "treino", label: "Conteúdo" },
  conf: {
    id: "conf",
    label: "Conferência",
    tierName: "Conferência de aprendizado",
    tierSub: "(memória — logo após estudar o conteúdo)",
  },
  r1: {
    id: "r1",
    label: "Revisão 1",
    tierName: "Revisão 1",
    tierSub: "(memória — após 1 dia)",
  },
  r2: {
    id: "r2",
    label: "Revisão 2",
    tierName: "Revisão 2",
    tierSub: "(memória — revisão)",
  },
  r3: {
    id: "r3",
    label: "Revisão 3",
    tierName: "Revisão 3",
    tierSub: "(memória — revisão)",
  },
  desafio: {
    id: "desafio",
    label: "Desafio",
    tierName: "Desafio",
    tierSub: "(generalização — aprofundam e testam o raciocínio)",
  },
};

/** Abas da aula em supervisão (sem sessão). Não é a lista completa do player. */
export const AULA_TAB_IDS: LessonTabId[] = ["treino", "conf"];

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

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

export function isPersistedQuestionUuid(value: string | undefined): value is string {
  return Boolean(value && UUID_PATTERN.test(value));
}

export function questionAnswerKey(
  question: ContentQuestion,
  index: number
): string {
  if (isPersistedQuestionUuid(question.uuid)) return question.uuid;
  return `legacy:${index}:${question.text.slice(0, 80)}`;
}

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleArray<T>(
  items: T[],
  random: () => number = Math.random
): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = result[index];
    result[index] = result[swapIndex];
    result[swapIndex] = current;
  }
  return result;
}

function sortQuestionsForSeed(questions: ContentQuestion[]): ContentQuestion[] {
  return [...questions].sort((left, right) => {
    const leftKey = left.uuid || left.text;
    const rightKey = right.uuid || right.text;
    return leftKey.localeCompare(rightKey);
  });
}

/** Divide itens já ordenados de forma equilibrada entre N buckets, sem repetição. */
export function distributeEvenly<T>(items: T[], bucketCount: number): T[][] {
  if (bucketCount <= 0) return [];

  const buckets: T[][] = Array.from({ length: bucketCount }, () => []);
  const baseSize = Math.floor(items.length / bucketCount);
  const remainder = items.length % bucketCount;
  let offset = 0;

  for (let bucketIndex = 0; bucketIndex < bucketCount; bucketIndex += 1) {
    const size = baseSize + (bucketIndex < remainder ? 1 : 0);
    buckets[bucketIndex] = items.slice(offset, offset + size);
    offset += size;
  }

  return buckets;
}

export function buildQuestionTabDistribution(
  questions: ContentQuestion[],
  seed?: number
): QuestionTabDistribution {
  const random = seed === undefined ? null : mulberry32(seed);

  function order(items: ContentQuestion[]): ContentQuestion[] {
    const sorted = sortQuestionsForSeed(items);
    if (!random) return sorted;
    return shuffleArray(sorted, random);
  }

  const memorization = order(
    questions.filter((question) => question.question_type === "memorization")
  );
  const generalized = order(
    questions.filter((question) => question.question_type === "generalized")
  );
  const untyped = order(
    questions.filter(
      (question) =>
        question.question_type !== "memorization" &&
        question.question_type !== "generalized"
    )
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
    desafio: generalized,
  };
}

export function isLessonTabId(value: string): value is LessonTabId {
  return Object.prototype.hasOwnProperty.call(LESSON_TAB_META, value);
}

export function isQuestionTabId(
  tabId: LessonTabId
): tabId is LessonQuestionTabId {
  return tabId !== "treino";
}

/**
 * Abas do player vêm da sessão (`visible_tabs`), inclusive Desafio.
 */
export function resolveTabsFromIds(tabIds: readonly string[]): LessonTabMeta[] {
  const seen = new Set<LessonTabId>();
  const tabs: LessonTabMeta[] = [];

  tabIds.forEach((raw) => {
    if (!isLessonTabId(raw) || seen.has(raw)) return;
    seen.add(raw);
    tabs.push(LESSON_TAB_META[raw]);
  });

  return tabs;
}
