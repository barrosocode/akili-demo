"use client";

import type { ReactNode } from "react";

import { isAssistanceReadOnly } from "@/lib/permissions/guardian-capabilities";
import { useSession } from "@/providers/session-provider";

/**
 * Oculta chrome de suporte (Tawk FAB) durante assistência —
 * evita identificar o operador como o responsável no chat.
 */
export function AssistanceShellChrome({ children }: { children: ReactNode }) {
  const { user } = useSession();
  if (isAssistanceReadOnly(user)) return null;
  return <>{children}</>;
}
