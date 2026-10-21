import type { SubjectCatalogItem, SubjectListItem } from "@/types/subject-catalog";

export type StudentMaterialSubjectSource = {
  content: {
    subject: { uuid: string; name: string } | null;
  };
};

export function resolveStudentSubjects(
  materials: readonly StudentMaterialSubjectSource[],
  catalog: readonly SubjectCatalogItem[],
): SubjectListItem[] {
  const subjectUuids = new Set<string>();
  for (const material of materials) {
    const subject = material.content.subject;
    if (!subject) continue;
    subjectUuids.add(subject.uuid);
  }

  const seen = new Set<string>();
  const matched: SubjectListItem[] = [];
  for (const item of catalog) {
    if (!subjectUuids.has(item.uuid) || seen.has(item.uuid)) continue;
    seen.add(item.uuid);
    matched.push(item);
  }

  return matched.sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
}
