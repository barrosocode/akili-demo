/** Portal slug fixed on BFF for the Guardian Portal Help Center. */
export const SUPPORT_PORTAL_GUARDIAN = "guardian" as const;

export const SUPPORT_PATHS = {
  home: "/ajuda",
  topic: (topicUuid: string) => `/ajuda/topicos/${topicUuid}`,
  faq: (topicUuid: string, faqUuid: string) =>
    `/ajuda/topicos/${topicUuid}/faqs/${faqUuid}`,
} as const;
