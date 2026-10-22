export function studentProgressScopeQuery(subjectUuid?: string | null): string {
  const value = subjectUuid?.trim() ?? "";
  if (!value) return "";

  const params = new URLSearchParams();
  params.set("subject_uuid", value);
  return `?${params.toString()}`;
}
