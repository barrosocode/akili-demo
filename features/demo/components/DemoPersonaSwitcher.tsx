"use client";

import { useState, type ChangeEvent } from "react";

import {
  isDemoPersonaKey,
  personaLabel,
  resolveCurrentPersonaKey,
} from "@/lib/demo/personas";
import { useSession } from "@/providers/session-provider";
import { BffClientError } from "@/services/bff/client";
import { useSwitchDemoPersonaMutation } from "@/services/queries/demo.mutations";
import { useDemoPersonas } from "@/services/queries/demo.queries";

function switcherErrorMessage(error: unknown): string {
  if (error instanceof BffClientError) {
    return error.detail?.trim() || error.title || "Não foi possível trocar de persona.";
  }
  return "Não foi possível trocar de persona.";
}

/**
 * Seletor permanente das personas demo — só renderiza com lista da API.
 */
export function DemoPersonaSwitcher() {
  const { user } = useSession();
  const { personas, isLoading } = useDemoPersonas();
  const switchPersona = useSwitchDemoPersonaMutation();
  const [error, setError] = useState<string | null>(null);

  if (personas.length === 0) {
    return null;
  }

  const current = resolveCurrentPersonaKey(personas, user);
  const busy = isLoading || switchPersona.isPending;

  async function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const key = event.target.value;
    if (!isDemoPersonaKey(key) || key === current) return;

    setError(null);
    try {
      const result = await switchPersona.mutateAsync(key);
      window.location.assign(result.redirectTo);
    } catch (switchError) {
      setError(switcherErrorMessage(switchError));
    }
  }

  return (
    <div className="demo-persona-switcher">
      <span className="portal-chip portal-chip--muted">Demo</span>
      <label htmlFor="demo-persona-select">
        Ver como
        <select
          id="demo-persona-select"
          value={current}
          disabled={busy}
          onChange={(event) => {
            void handleChange(event);
          }}
        >
          {personas.map((persona) => (
            <option key={persona.key} value={persona.key}>
              {personaLabel(persona)}
            </option>
          ))}
        </select>
      </label>
      {error ? (
        <span className="demo-persona-switcher__error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
