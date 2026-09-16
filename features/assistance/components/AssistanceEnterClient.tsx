"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { authBff } from "@/services/bff/auth.bff";
import { BffClientError } from "@/services/bff/client";
import { queryKeys } from "@/services/queries/query-keys";
import { GUARDIAN_DEFAULT_PATH } from "@/lib/auth/portal-destination";
import { SUPPORT_LOGIN_PATH } from "@/lib/auth/support-config";
import { getUserFacingApiMessage } from "@/lib/api/errors";

const MAX_ATTEMPTS = 4;
const RETRY_MS = 400;

const WAITING = "Abrindo o portal em modo atendimento…";
const GENERIC_ERROR =
  "Não foi possível carregar o modo atendimento. Tente iniciar novamente pela mesa.";

/**
 * Após start/adopt: espera a sessão de assistência ficar disponível e entra no dashboard.
 */
export function AssistanceEnterClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const startedRef = useRef(false);
  const [message, setMessage] = useState(WAITING);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    void (async () => {
      let lastError: unknown;

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
        try {
          const session = await authBff.me();
          if (session.assistance?.active) {
            await queryClient.cancelQueries({ queryKey: queryKeys.auth.me });
            queryClient.setQueryData(queryKeys.auth.me, session);
            router.replace(GUARDIAN_DEFAULT_PATH);
            router.refresh();
            return;
          }
          lastError = new Error("Sessão sem atendimento ativo.");
        } catch (error) {
          lastError = error;
        }

        if (attempt < MAX_ATTEMPTS - 1) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_MS));
        }
      }

      setFailed(true);
      setMessage(
        lastError instanceof BffClientError
          ? getUserFacingApiMessage(lastError, GENERIC_ERROR)
          : GENERIC_ERROR
      );
    })();
  }, [queryClient, router]);

  return (
    <div className="container space-top space-extra-bottom" role="status">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h1 className="h4 mb-3">Atendimento</h1>
          <p className={failed ? "text-danger" : undefined}>{message}</p>
          {failed ? (
            <p className="mb-0">
              <a href={SUPPORT_LOGIN_PATH}>Voltar à mesa de atendimento</a>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
