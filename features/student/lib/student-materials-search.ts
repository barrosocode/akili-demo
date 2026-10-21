const MIN_SEARCH_LENGTH = 2;
const MAX_SEARCH_LENGTH = 255;

export type StudentMaterialsSearch = {
  term: string;
  subjectUuid: string;
  path: string;
};

export function resolveStudentMaterialsSearch(
  search?: string,
  subjectUuid?: string
): StudentMaterialsSearch {
  const rawTerm = (search ?? "").trim();
  const term =
    rawTerm.length >= MIN_SEARCH_LENGTH && rawTerm.length <= MAX_SEARCH_LENGTH
      ? rawTerm
      : "";
  const subject = (subjectUuid ?? "").trim();
  const params = new URLSearchParams();

  if (term) params.set("search", term);
  if (subject) params.set("subject_uuid", subject);

  const serialized = params.toString().replace(/\+/g, "%20");

  return {
    term,
    subjectUuid: subject,
    path: serialized ? `/api/student/materials?${serialized}` : "/api/student/materials",
  };
}
