/** Portal slug fixed on BFF for the Guardian Portal Help Center. */
export const SUPPORT_PORTAL_GUARDIAN = "guardian" as const;

export type SupportPathSet = {
  home: string;
  topic: (topicUuid: string) => string;
  faq: (topicUuid: string, faqUuid: string) => string;
};

function makeSupportPaths(home: string): SupportPathSet {
  return {
    home,
    topic: (topicUuid: string) => `${home}/topicos/${topicUuid}`,
    faq: (topicUuid: string, faqUuid: string) =>
      `${home}/topicos/${topicUuid}/faqs/${faqUuid}`,
  };
}

export const SUPPORT_PATHS = makeSupportPaths("/ajuda");
export const STUDENT_SUPPORT_PATHS = makeSupportPaths("/aluno/ajuda");

export type SupportActionAudience = "guardian" | "student";

/**
 * Área autenticada do aluno (não supervisão do responsável).
 */
export function isStudentHelpArea(pathname: string): boolean {
  if (pathname.startsWith("/aluno/supervisao/")) return false;
  return pathname === "/aluno" || pathname.startsWith("/aluno/");
}

export function supportPathsFor(pathname: string): SupportPathSet {
  return isStudentHelpArea(pathname) ? STUDENT_SUPPORT_PATHS : SUPPORT_PATHS;
}

export function supportActionAudienceFor(
  pathname: string
): SupportActionAudience {
  return isStudentHelpArea(pathname) ? "student" : "guardian";
}
