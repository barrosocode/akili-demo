import type { SubjectProgressItem } from "@/types/student-learning";

export type SubjectProgressMode = "preview" | "full";

const PREVIEW_LIMIT = 3;

function isProgressItem(value: unknown): value is SubjectProgressItem {
  if (!value || typeof value !== "object") return false;
  const subject = (value as { subject?: unknown }).subject;
  if (!subject || typeof subject !== "object") return false;
  const uuid = (subject as { uuid?: unknown }).uuid;
  return typeof uuid === "string" && uuid.trim().length > 0;
}

export function selectSubjectProgress(
  items: SubjectProgressItem[] | null | undefined,
  mode: SubjectProgressMode,
): SubjectProgressItem[] {
  if (!Array.isArray(items)) return [];

  const seen = new Set<string>();
  const unique: SubjectProgressItem[] = [];

  for (const item of items) {
    if (!isProgressItem(item)) continue;
    const uuid = item.subject.uuid;
    if (seen.has(uuid)) continue;
    seen.add(uuid);
    unique.push(item);
  }

  if (mode === "preview") return unique.slice(0, PREVIEW_LIMIT);
  return unique;
}
