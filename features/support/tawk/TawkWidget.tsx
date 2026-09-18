"use client";

import { useEffect } from "react";
import {
  ensureTawkLoaded,
  getTawkPublicConfig,
} from "@/features/support/tawk/tawk.service";

type TawkWidgetProps = {
  /** Quando true, injeta o script do Tawk no client. */
  load: boolean;
  onReady?: () => void;
  onError?: (error: unknown) => void;
};

/**
 * Boundary client-only do embed Tawk. Não renderiza UI; só gerencia o script.
 */
export function TawkWidget({ load, onReady, onError }: TawkWidgetProps) {
  useEffect(() => {
    if (!load) return;

    if (!getTawkPublicConfig()) {
      onError?.(new Error("Tawk não configurado."));
      return;
    }

    let cancelled = false;

    ensureTawkLoaded()
      .then(() => {
        if (!cancelled) onReady?.();
      })
      .catch((error) => {
        if (!cancelled) onError?.(error);
      });

    return () => {
      cancelled = true;
    };
  }, [load, onReady, onError]);

  return null;
}
