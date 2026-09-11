export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  profile: {
    all: ["profile"] as const,
    me: () => [...queryKeys.profile.all, "me"] as const,
  },
  children: {
    all: ["children"] as const,
    list: () => [...queryKeys.children.all, "list"] as const,
    progress: (ref: string) =>
      [...queryKeys.children.all, "progress", ref] as const,
  },
  purchases: {
    all: ["purchases"] as const,
    list: () => [...queryKeys.purchases.all, "list"] as const,
  },
  support: {
    all: ["support"] as const,
    topics: () => [...queryKeys.support.all, "topics"] as const,
    topic: (uuid: string) => [...queryKeys.support.all, "topic", uuid] as const,
    faq: (uuid: string) => [...queryKeys.support.all, "faq", uuid] as const,
    search: (q: string) => [...queryKeys.support.all, "search", q] as const,
  },
  demo: {
    all: ["demo"] as const,
    personas: ["demo", "personas"] as const,
  },
};
