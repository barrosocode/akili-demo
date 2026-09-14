"use client";

import { useContext } from "react";
import { TawkContext } from "@/features/support/tawk/TawkProvider";
import { logoutTawk, maximizeTawk } from "@/features/support/tawk/tawk.service";
import type { TawkContextValue } from "@/features/support/tawk/tawk.types";

const fallback: TawkContextValue = {
  status: "unavailable",
  isReady: false,
  isConfigured: false,
  isAvailable: false,
  openChat: async () => {
    // Sem provider / Tawk falhou — portal continua.
    return false;
  },
  maximize: () => {
    maximizeTawk();
  },
  logout: () => {
    void logoutTawk();
  },
};

/**
 * API estável do chat. Páginas não devem acessar `window.Tawk_API` diretamente.
 * Fora do provider, retorna no-ops seguros (degradação graciosa).
 */
export function useTawk(): TawkContextValue {
  return useContext(TawkContext) ?? fallback;
}
