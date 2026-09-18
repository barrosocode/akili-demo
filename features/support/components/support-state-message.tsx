"use client";

import { BffClientError } from "@/services/bff/client";
import { getUserFacingApiMessage } from "@/lib/api/errors";

type SupportStateMessageProps = {
  variant: "loading" | "empty" | "error";
  error?: unknown;
  onRetry?: () => void;
  emptyMessage?: string;
};

export function SupportStateMessage({
  variant,
  error,
  onRetry,
  emptyMessage = "Nenhum conteúdo de ajuda disponível.",
}: SupportStateMessageProps) {
  if (variant === "loading") {
    return (
      <div className="akili-support-state" role="status" aria-live="polite">
        <div className="akili-support-skeleton" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="visually-hidden">Carregando Central de Ajuda…</p>
      </div>
    );
  }

  if (variant === "empty") {
    return (
      <div className="akili-support-state alert alert-info" role="status">
        {emptyMessage}
      </div>
    );
  }

  const message =
    error instanceof BffClientError
      ? error.detail ?? error.title
      : getUserFacingApiMessage(error, "Não foi possível carregar a Central de Ajuda.");

  return (
    <div className="akili-support-state alert alert-danger" role="alert">
      <p className="mb-2">{message}</p>
      {onRetry && (
        <button type="button" className="vs-btn style3" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
