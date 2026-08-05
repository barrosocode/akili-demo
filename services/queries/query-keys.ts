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
};
