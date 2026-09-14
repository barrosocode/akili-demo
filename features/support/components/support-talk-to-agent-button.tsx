"use client";

import { useState } from "react";
import { useTawk } from "@/features/support/tawk";

type SupportTalkToAgentButtonProps = {
  className?: string;
};

/**
 * CTA da Central de Ajuda → `useTawk().openChat()` (sem Tawk inline no modal).
 */
export function SupportTalkToAgentButton({
  className = "vs-btn style3",
}: SupportTalkToAgentButtonProps) {
  const { openChat } = useTawk();
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <span className="akili-support-chat-cta">
      <button
        type="button"
        className={className}
        disabled={pending}
        onClick={() => {
          void (async () => {
            setPending(true);
            setErrorMessage(null);
            try {
              const opened = await openChat();
              if (!opened) {
                setErrorMessage("Não foi possível abrir o chat.");
              }
            } catch {
              setErrorMessage("Não foi possível abrir o chat.");
            } finally {
              setPending(false);
            }
          })();
        }}
      >
        {pending ? "Abrindo chat…" : "Falar com suporte"}
      </button>
      {errorMessage ? (
        <span className="akili-support-chat-cta__error" role="alert">
          {errorMessage}
        </span>
      ) : null}
    </span>
  );
}
